import { expect, test, type Page } from "@playwright/test";
import { encodeSession, SESSION_COOKIE } from "../../src/lib/session-shared";

const studentPaths = [
  "/dashboard",
  "/applications/demo/essay",
  "/applications/demo/analysis",
  "/applications/demo/practice",
  "/applications/demo/mock-interview",
  "/applications/demo/cheat-sheet",
  "/settings",
];

const adminPaths = [
  "/admin",
  "/admin/questions",
  "/admin/prompts",
  "/admin/videos",
  "/admin/schools",
  "/admin/metrics",
  "/settings",
];

async function visit(page: Page, path: string) {
  // UI 검사는 load 이벤트보다 화면의 핵심 요소를 기다립니다. 동적 모션 청크가
  // 늦게 로드돼도 CI의 라우팅 검증이 불필요하게 실패하지 않게 합니다.
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-app-hydrated", "true");
}

function contrastRatio(foreground: string, background: string) {
  const parse = (color: string) => {
    const rawValue = color.replace("#", "");
    const value =
      rawValue.length === 3
        ? rawValue
            .split("")
            .map((channel) => `${channel}${channel}`)
            .join("")
        : rawValue;
    const channels = [0, 2, 4].map(
      (offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255,
    );
    const [red, green, blue] = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const [lighter, darker] = [parse(foreground), parse(background)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

async function expectInterfaceFitsViewport(page: Page) {
  await expect(page.locator("main")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);

  const clipped = await page.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        "h1, h2, h3, button, input, textarea, select, [role=button]",
      ),
    );
    return candidates
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        );
      })
      .flatMap((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const textOverflowing =
          (style.overflow === "hidden" || style.textOverflow === "ellipsis") &&
          element.scrollWidth > element.clientWidth + 1;
        const hasHorizontalScroller = Array.from(
          element.parentElement?.closest("main") ? [element.parentElement] : [],
        )
          .flatMap((parent) => {
            const ancestors: HTMLElement[] = [];
            let current: HTMLElement | null = parent;
            while (current && current.tagName !== "MAIN") {
              ancestors.push(current);
              current = current.parentElement;
            }
            return ancestors;
          })
          .some((ancestor) => {
            const overflowX = getComputedStyle(ancestor).overflowX;
            return overflowX === "auto" || overflowX === "scroll";
          });
        const outsideViewport =
          !hasHorizontalScroller &&
          (rect.left < -1 || rect.right > window.innerWidth + 1);
        return textOverflowing || outsideViewport
          ? [
              {
                tag: element.tagName,
                label:
                  element.getAttribute("aria-label") ??
                  element.textContent?.trim(),
                outsideViewport,
                textOverflowing,
              },
            ]
          : [];
      });
  });
  expect(clipped).toEqual([]);
}

async function expectPrimaryTitle(page: Page) {
  // 화면 전환 직후에는 이전 제목이 짧게 남을 수 있습니다. 이 감사의 목적은
  // 각 화면의 주 제목이 보이는지 확인하는 것이므로, main의 첫 level-1 제목을
  // 기준으로 검사합니다.
  await expect(
    page.locator("main").getByRole("heading", { level: 1 }).first(),
  ).toBeVisible();
}

function isWebKitRscPrefetchNoise(message: string) {
  // WebKit은 Next의 same-origin RSC prefetch를 실제 화면 오류와 무관하게
  // access-control 오류로 기록할 수 있습니다. _rsc 요청에만 한정합니다.
  return /\?_rsc=.*due to access control checks/i.test(message);
}

async function seedRoleSession(page: Page, role: "user" | "admin") {
  // 이 파일은 각 보호 화면의 반응형 감사를 담당합니다. 가입 흐름의 POST·쿠키·
  // 리다이렉트는 smoke.spec.ts에서 별도로 검증해, 화면 감사가 인증 전송 타이밍에
  // 의존하지 않도록 합니다.
  await page.context().addCookies([
    {
      name: SESSION_COOKIE,
      value: encodeSession({
        name: role === "user" ? "모바일학생" : "운영교사",
        email: `${role}@example.com`,
        role,
      }),
      url: "http://127.0.0.1:3000",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

test("공개·인증 화면은 320px부터 데스크톱까지 잘리지 않는다", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/login", "/signup", "/terms", "/privacy"]) {
      await visit(page, path);
      await expectInterfaceFitsViewport(page);
    }
  }

  expect(
    pageErrors.filter((message) => !isWebKitRscPrefetchNoise(message)),
  ).toEqual([]);
  expect(
    consoleErrors.filter((message) =>
      /hydration|hydrated|server rendered html/i.test(message),
    ),
  ).toEqual([]);
  expect(
    consoleErrors.filter((message) => !isWebKitRscPrefetchNoise(message)),
  ).toEqual([]);
});

test("라이트·다크 색상 토큰은 기본·강조 표면에서 읽을 수 있다", async ({
  page,
}) => {
  await visit(page, "/");

  for (const theme of ["light", "dark"]) {
    const palette = await page.evaluate((nextTheme) => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextTheme);
      const style = getComputedStyle(document.documentElement);
      return {
        canvas: style.getPropertyValue("--canvas").trim(),
        textPrimary: style.getPropertyValue("--text-primary").trim(),
        contrastSurface: style.getPropertyValue("--surface-contrast").trim(),
        contrastText: style.getPropertyValue("--text-on-contrast").trim(),
        brand: style.getPropertyValue("--brand").trim(),
        brandText: style.getPropertyValue("--text-on-brand").trim(),
      };
    }, theme);

    expect(
      contrastRatio(palette.textPrimary, palette.canvas),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(palette.contrastText, palette.contrastSurface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(palette.brandText, palette.brand),
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test("모바일 랜딩의 중앙 카피·개별 오브젝트·다음 구간은 서로 겹치지 않는다", async ({
  page,
}) => {
  for (const width of [320, 400]) {
    await page.setViewportSize({ width, height: 910 });
    await visit(page, "/");

    const mobileArtObjects = page.locator("[data-motion-waterfall-art]");
    await expect(mobileArtObjects).toHaveCount(3);
    await expect
      .poll(
        () =>
          mobileArtObjects.evaluateAll((elements) =>
            elements.map((element) => getComputedStyle(element).transform),
          ),
        { timeout: 3_000 },
      )
      .toEqual(["none", "none", "none"]);

    const copy = await page.getByTestId("landing-hero-copy").boundingBox();
    const mobileArt = await mobileArtObjects.evaluateAll((elements) => {
      const boxes = elements.map((element) => element.getBoundingClientRect());
      return {
        top: Math.min(...boxes.map((box) => box.top + window.scrollY)),
        bottom: Math.max(...boxes.map((box) => box.bottom + window.scrollY)),
      };
    });
    const roleStrip = await page
      .getByTestId("landing-role-strip")
      .boundingBox();

    expect(copy).not.toBeNull();
    expect(roleStrip).not.toBeNull();
    expect(mobileArt.top).toBeGreaterThanOrEqual(copy!.y + copy!.height + 16);
    expect(roleStrip!.y).toBeGreaterThanOrEqual(mobileArt.bottom);
    expect(roleStrip!.y - mobileArt.bottom).toBeLessThanOrEqual(24);
    await expectInterfaceFitsViewport(page);
  }
});

test("상품 준비 시퀀스는 모든 화면에서 스크롤 가능한 하나의 장면으로 남는다", async ({
  page,
}) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, "/");

    const stage = page.getByTestId("landing-product-stage");
    await expect(stage).toBeVisible();
    const layout = await stage.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        minHeight: style.minHeight,
        fitsViewport: rect.left >= 0 && rect.right <= window.innerWidth,
      };
    });

    expect(layout.fitsViewport).toBe(true);
    if (width >= 768) expect(layout.minHeight).not.toBe("0px");
    await expectInterfaceFitsViewport(page);
  }
});

test("데스크톱에서 모바일로 전환해도 랜딩 모션이 화면 폭을 밀어내지 않는다", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "데스크톱 컨텍스트의 런타임 뷰포트 전환만 한 번 검증합니다.",
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await visit(page, "/");
  await page.waitForTimeout(1_000);

  const stage = page.getByTestId("landing-product-stage");
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(900);

  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    scrollX: window.scrollX,
  }));
  const stageBox = await stage.boundingBox();

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.scrollX).toBe(0);
  expect(stageBox).not.toBeNull();
  expect(stageBox!.x).toBeGreaterThanOrEqual(0);
  expect(stageBox!.x + stageBox!.width).toBeLessThanOrEqual(391);
});

test("랜딩 상품 설명은 한국어 어절을 쪼개지 않고 줄바꿈한다", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, "/");

    const report = await page
      .getByTestId("landing-product-description")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          const words = element.textContent?.trim().split(/\s+/) ?? [];
          const textNode = element.firstChild;
          if (!textNode) return { wordBreak: style.wordBreak, splitWords: [] };

          let cursor = 0;
          const splitWords = words.filter((word) => {
            const start = element.textContent?.indexOf(word, cursor) ?? -1;
            cursor = start + word.length;
            if (start < 0) return false;
            const range = document.createRange();
            range.setStart(textNode, start);
            range.setEnd(textNode, start + word.length);
            return range.getClientRects().length > 1;
          });
          return { wordBreak: style.wordBreak, splitWords };
        }),
      );

    expect(report).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ wordBreak: "keep-all", splitWords: [] }),
      ]),
    );
    expect(report.every(({ splitWords }) => splitWords.length === 0)).toBe(
      true,
    );
    await expectInterfaceFitsViewport(page);
  }
});

test("공개 고정 헤더는 스크롤 중에도 콘텐츠보다 위에서 메뉴 가독성을 유지한다", async ({
  page,
}) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, "/");
    await page.evaluate(() => window.scrollTo(0, 620));

    const result = await page
      .locator(".public-navigation-glass")
      .evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const point = document.elementFromPoint(
          rect.left + 16,
          rect.top + rect.height / 2,
        );
        const style = getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          isTopLayer: point?.closest(".public-navigation-glass") === element,
        };
      });

    expect(result.backgroundColor).toMatch(/^rgb\(/);
    expect(result.isTopLayer).toBe(true);
  }
});

test("전문가 소개의 핵심 제목은 모든 공개 폭에서 한 줄로 유지된다", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, "/#mentors");
    const heading = page.getByTestId("landing-mentors-heading");
    await expect(heading).toBeVisible();
    const layout = await heading.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        whiteSpace: style.whiteSpace,
        fitsViewport: rect.left >= 0 && rect.right <= window.innerWidth,
      };
    });
    expect(layout.whiteSpace).toBe("nowrap");
    expect(layout.fitsViewport).toBe(true);
  }
});

test("학생 준비 전 단계는 모바일·태블릿·데스크톱에서 완결된다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of studentPaths) {
      await visit(page, path);
      await expectPrimaryTitle(page);
      await expectInterfaceFitsViewport(page);
    }
  }
});

test("전문가 운영 전 메뉴는 모바일·태블릿·데스크톱에서 완결된다", async ({
  page,
}) => {
  await seedRoleSession(page, "admin");

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of adminPaths) {
      await test.step(`${width}px ${path}`, async () => {
        await visit(page, path);
        await expectPrimaryTitle(page);
        await expectInterfaceFitsViewport(page);
      });
    }
  }
});

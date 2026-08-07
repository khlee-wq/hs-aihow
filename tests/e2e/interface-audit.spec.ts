import { expect, test, type Page } from "@playwright/test";
import { encodeSession, SESSION_COOKIE } from "../../src/lib/session-shared";

const studentPaths = [
  "/dashboard",
  "/applications/demo/essay",
  "/applications/demo/analysis",
  "/applications/demo/practice",
  "/applications/demo/practice/session",
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
  await expect(page.locator("html")).toHaveAttribute(
    "data-app-hydrated",
    "true",
  );
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

async function expectStepNavigationFitsItsContainer(page: Page, label: string) {
  const navigation = page.getByLabel(label);
  await expect(navigation).toBeVisible();

  const layout = await navigation.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      overflowX: style.overflowX,
    };
  });

  // 준비 단계는 순서를 한눈에 비교하는 UI입니다. 작은 화면에서 다음 항목이
  // 옆으로 숨는 방식이 다시 들어오지 않도록, 별도의 가로 스크롤을 금지합니다.
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  expect(layout.overflowX).not.toMatch(/auto|scroll/);
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
      if (path === "/applications/demo/practice") {
        await expect(page.getByTestId("question-practice-intro")).toBeVisible();
        await expect(
          page.getByRole("link", {
            name: /질문 연습 시작하기|\d+번째 질문부터 이어하기/,
          }),
        ).toBeVisible();
        await expect(
          page.getByText("지원 동기", { exact: true }),
        ).toBeVisible();
        await expect(
          page.getByText("탐구 태도", { exact: true }),
        ).toBeVisible();
        await expect(
          page.getByText("협업 경험", { exact: true }),
        ).toBeVisible();
      }
      if (path === "/applications/demo/practice/session") {
        await expect(
          page.getByTestId("student-practice-session-shell"),
        ).toBeVisible();
        await expect(page.getByRole("progressbar")).toBeVisible();
        await expect(
          page.getByRole("button", { name: "답변 저장" }),
        ).toBeVisible();
      }
      if (path === "/applications/demo/mock-interview") {
        await expect(page.getByTestId("mock-interview-intro")).toBeVisible();
        await expect(
          page.getByRole("heading", {
            name: "오늘은 어떤 방식으로 말하기를 연습할까요?",
          }),
        ).toBeVisible();
        await expectStepNavigationFitsItsContainer(page, "모의면접 진행 단계");
      }
      await expectInterfaceFitsViewport(page);
    }
  }
});

test("질문 집중 화면은 움직임 축소 설정에서도 즉시 읽을 수 있다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, "/applications/demo/practice/session");

  const scene = page.getByTestId("question-practice-scene");
  await expect(scene).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "과학 동아리 활동에서 가장 오래 고민했던 한 장면을 설명해 보세요.",
    }),
  ).toBeVisible();
  await expect
    .poll(() =>
      scene.evaluate((element) => {
        const style = getComputedStyle(element);
        return { opacity: style.opacity, transform: style.transform };
      }),
    )
    .toEqual({ opacity: "1", transform: "none" });
  await expectInterfaceFitsViewport(page);
});

test("작성 중인 답변은 자동 보관되고 같은 질문에서 이어진다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, "/applications/demo/practice/session");

  const answer =
    "실험 결과가 예상과 달라 기록 기준을 다시 살펴보던 장면입니다.";
  const session = page.getByTestId("question-practice-scene").locator("..");
  await expect(session).toHaveAttribute("data-progress-ready", "true");
  const answerField = page.getByRole("textbox", {
    name: "이 질문에 대한 내 답변",
  });
  await expect(answerField).toBeEnabled();
  await answerField.fill(answer);
  await expect(answerField).toHaveValue(answer);
  await expect(page.getByRole("status")).toHaveText("임시 저장됨");
  await page.getByRole("link", { name: "저장 후 나가기" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await visit(page, "/applications/demo/practice");
  await expect(
    page.getByRole("link", { name: "1번째 질문부터 이어하기" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "1번째 질문부터 이어하기" }).click();
  await expect(
    page.getByRole("textbox", { name: "이 질문에 대한 내 답변" }),
  ).toHaveValue(answer);
});

test("질문 연습 시작 화면은 데스크톱 한 화면 안에서 완결된다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1680, height: 1050 },
  ]) {
    await page.setViewportSize(viewport);
    await visit(page, "/applications/demo/practice");
    await expect(page.getByTestId("question-practice-intro")).toBeVisible();

    const layout = await page.evaluate(() => {
      const intro = document.querySelector(
        "[data-testid=question-practice-intro]",
      );
      const map = document.querySelector(".practice-intro-map");
      return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        introBottom: intro?.getBoundingClientRect().bottom ?? 0,
        mapBottom: map?.getBoundingClientRect().bottom ?? 0,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    expect(layout.scrollHeight).toBeLessThanOrEqual(layout.innerHeight + 1);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.innerWidth);
    expect(layout.introBottom).toBeGreaterThanOrEqual(layout.innerHeight - 25);
    expect(layout.mapBottom).toBeGreaterThanOrEqual(layout.innerHeight - 50);
  }
});

test("모의면접 시작 화면은 데스크톱 한 화면 안에서 완결된다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1680, height: 1050 },
  ]) {
    await page.setViewportSize(viewport);
    await visit(page, "/applications/demo/mock-interview");
    await expect(page.getByTestId("mock-interview-intro")).toBeVisible();

    const layout = await page.evaluate(() => {
      const intro = document.querySelector(
        "[data-testid=mock-interview-intro]",
      );
      const picker = document.querySelector(".mock-interview-picker");
      return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        introBottom: intro?.getBoundingClientRect().bottom ?? 0,
        pickerBottom: picker?.getBoundingClientRect().bottom ?? 0,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    expect(layout.scrollHeight).toBeLessThanOrEqual(layout.innerHeight + 1);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.innerWidth);
    expect(layout.introBottom).toBeGreaterThanOrEqual(layout.innerHeight - 25);
    expect(layout.pickerBottom).toBeGreaterThanOrEqual(layout.innerHeight - 50);
  }
});

test("학생 핵심 네 화면은 같은 헤더 토큰과 내부 스크롤을 사용한다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const reports = [];

    for (const [path, scrollRegion] of [
      ["/applications/demo/practice", ".practice-intro-stages"],
      ["/applications/demo/mock-interview", ".mock-interview-options"],
      ["/applications/demo/essay", ".workspace-panel-scroll"],
      ["/applications/demo/cheat-sheet", ".workspace-panel-scroll"],
    ]) {
      await visit(page, path);
      reports.push(
        await page.evaluate((selector) => {
          const icon = document.querySelector(".learning-intro-icon")!;
          const title = document.querySelector(".learning-intro-title")!;
          const copy = document.querySelector(".learning-intro-copy")!;
          const region = document.querySelector(selector)!;
          const titleStyle = getComputedStyle(title);
          const copyStyle = getComputedStyle(copy);
          return {
            copyFontSize: copyStyle.fontSize,
            copyLineHeight: copyStyle.lineHeight,
            iconSize: icon.getBoundingClientRect().width,
            pageScrollHeight: document.documentElement.scrollHeight,
            regionOverflowY: getComputedStyle(region).overflowY,
            titleFontSize: titleStyle.fontSize,
            titleLineHeight: titleStyle.lineHeight,
          };
        }, scrollRegion),
      );
    }

    for (const report of reports.slice(1)) {
      expect(report.copyFontSize).toBe(reports[0].copyFontSize);
      expect(report.copyLineHeight).toBe(reports[0].copyLineHeight);
      expect(report.iconSize).toBe(reports[0].iconSize);
      expect(report.titleFontSize).toBe(reports[0].titleFontSize);
      expect(report.titleLineHeight).toBe(reports[0].titleLineHeight);
    }
    for (const report of reports) {
      expect(report.pageScrollHeight).toBeLessThanOrEqual(viewport.height + 1);
      expect(report.regionOverflowY).toBe("auto");
    }
  }
});

test("학생 핵심 작업 화면은 같은 캔버스 여백을 사용한다", async ({ page }) => {
  await seedRoleSession(page, "user");
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const [path, contentSelector] of [
    ["/applications/demo/practice", ".practice-intro-map"],
    ["/applications/demo/mock-interview", ".mock-interview-picker"],
    ["/applications/demo/essay", ".workspace-page-panel"],
    ["/applications/demo/cheat-sheet", "[data-testid=final-note-paper]"],
  ]) {
    await visit(page, path);
    const gutters = await page.evaluate((selector) => {
      const canvas = document.querySelector(".practice-session-canvas")!;
      const content = document.querySelector(selector)!;
      const canvasRect = canvas.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return {
        left: contentRect.left - canvasRect.left,
        right: canvasRect.right - contentRect.right,
      };
    }, contentSelector);

    expect(gutters.left).toBeGreaterThanOrEqual(30);
    expect(gutters.left).toBeLessThanOrEqual(34);
    expect(gutters.right).toBeGreaterThanOrEqual(30);
    expect(gutters.right).toBeLessThanOrEqual(34);
  }
});

test("자소서와 파이널 노트는 데스크톱 한 화면 안에서 완결된다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1680, height: 1050 },
  ]) {
    await page.setViewportSize(viewport);

    for (const path of [
      "/applications/demo/essay",
      "/applications/demo/cheat-sheet",
    ]) {
      await visit(page, path);
      await expectPrimaryTitle(page);
      await expect(page.locator(".learning-intro-icon")).toBeVisible();

      const layout = await page.evaluate(() => {
        const title = document.querySelector(".student-display")!;
        const titleStyle = getComputedStyle(title);
        return {
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth,
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          titleLines:
            title.getBoundingClientRect().height /
            Number.parseFloat(titleStyle.lineHeight),
        };
      });

      expect(layout.scrollHeight).toBeLessThanOrEqual(layout.innerHeight + 1);
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.innerWidth);
      if (viewport.height <= 800) {
        expect(layout.titleLines).toBeLessThanOrEqual(2.1);
      } else {
        expect(layout.titleLines).toBeLessThanOrEqual(2.1);
      }
    }
  }
});

test("파이널 노트는 A4 미리보기에서 규격을 확인한 뒤 저장한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => undefined;
    window.localStorage.setItem("aihow-theme", "dark");
  });
  await seedRoleSession(page, "user");

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await visit(page, "/applications/demo/cheat-sheet");

    const workspacePaper = page.getByTestId("final-note-paper");
    await expect(workspacePaper).toBeVisible();
    const workspaceSurface = await workspacePaper.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--surface").trim(),
    );
    expect(workspaceSurface).not.toBe("#ffffff");

    await page.getByRole("button", { name: "A4 미리보기" }).click();

    const dialog = page.getByRole("dialog", {
      name: "파이널 노트 미리보기",
    });
    const paper = dialog.getByTestId("final-note-paper");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("A4 · 세로 · 1페이지")).toBeVisible();
    await expect(paper).toBeVisible();

    const frame = await paper.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        aspectRatio: rect.width / rect.height,
        background: getComputedStyle(element).backgroundColor,
      };
    });
    expect(frame.aspectRatio).toBeCloseTo(210 / 297, 1);
    expect(frame.background).toBe("rgb(255, 255, 255)");

    await dialog.getByRole("button", { name: "PDF로 저장" }).click();
    await expect(page.getByRole("status")).toContainText(
      "파이널 노트를 저장했어요",
    );
    const pageWidth = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(pageWidth.document).toBeLessThanOrEqual(pageWidth.viewport + 1);
    await dialog.getByRole("button", { name: "닫기" }).click();
    await expectInterfaceFitsViewport(page);
  }
});

test("모바일 하단 메뉴는 이동 뒤 선택 위치를 유리 하이라이트로 이어간다", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "모바일 내비게이션 전용 검사");
  await seedRoleSession(page, "user");
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, "/applications/demo/essay");

  const navigation = page.getByTestId("student-mobile-nav");
  const highlight = navigation.locator(".liquid-nav-highlight");
  await expect(navigation).toBeVisible();
  await expect(highlight).toBeVisible();
  await expect(navigation).toHaveAttribute("data-active-index", "1");

  await navigation.getByRole("link", { name: "질문 연습" }).click();
  await expect(page).toHaveURL(/\/applications\/demo\/practice$/);
  await expect(navigation).toHaveAttribute("data-active-index", "2");
  await expect
    .poll(() => navigation.getAttribute("data-nav-motion"))
    .toBe("idle");

  const visualState = await navigation.evaluate((element) => {
    const marker = element.querySelector(".liquid-nav-highlight");
    return {
      backdropFilter: getComputedStyle(element).backdropFilter,
      markerTransform: marker ? getComputedStyle(marker).transform : "none",
      navigationTransform: getComputedStyle(element).transform,
      viewportFits:
        document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  });
  expect(visualState.backdropFilter).not.toBe("none");
  expect(visualState.markerTransform).not.toBe("none");
  expect(visualState.navigationTransform).toBe("none");
  expect(visualState.viewportFits).toBe(true);
});

test("입시 지도는 상단 메뉴와 같은 작업공간 폭을 유지한다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");
  await page.setViewportSize({ width: 1440, height: 900 });
  await visit(page, "/dashboard");

  const desktopNavigation = page.getByTestId("student-desktop-nav");
  await expect(
    desktopNavigation.getByRole("link", { name: "입시 지도" }),
  ).toBeVisible();

  const closeTour = page.getByRole("button", { name: "투어 닫기" });
  if (await closeTour.isVisible()) await closeTour.click();

  // 로딩용 스켈레톤과 완료 화면의 정보 패널은 구조가 같지만, 실제 캔버스
  // 여백 검수는 서버 스냅샷이 반영된 완료 화면에서만 측정한다.
  await expect(page.getByTestId("admissions-outlook")).toBeVisible();

  const alignment = await page.evaluate(() => {
    const navigation = document.querySelector<HTMLElement>(
      "header.app-navigation > .workspace-wrap",
    );
    const workspace = document.querySelector<HTMLElement>(
      "main > .workspace-wrap",
    );
    if (!navigation || !workspace) return null;
    const navRect = navigation.getBoundingClientRect();
    const workspaceRect = workspace.getBoundingClientRect();
    return {
      leftDifference: Math.abs(navRect.left - workspaceRect.left),
      rightDifference: Math.abs(navRect.right - workspaceRect.right),
    };
  });
  expect(alignment).not.toBeNull();
  expect(alignment?.leftDifference).toBeLessThanOrEqual(1);
  expect(alignment?.rightDifference).toBeLessThanOrEqual(1);

  const canvasDensity = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLElement>(
      "[data-testid=student-dashboard]",
    );
    const admissions = document.querySelector<HTMLElement>(
      "[data-testid=admissions-outlook]",
    );
    if (!canvas || !admissions) return null;
    const canvasRect = canvas.getBoundingClientRect();
    const admissionsRect = admissions.getBoundingClientRect();
    return {
      left: admissionsRect.left - canvasRect.left,
      right: canvasRect.right - admissionsRect.right,
    };
  });
  expect(canvasDensity).not.toBeNull();
  expect(canvasDensity?.left).toBeGreaterThanOrEqual(30);
  expect(canvasDensity?.left).toBeLessThanOrEqual(34);
  expect(canvasDensity?.right).toBeGreaterThanOrEqual(30);
  expect(canvasDensity?.right).toBeLessThanOrEqual(34);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileCloseTour = page.getByRole("button", { name: "투어 닫기" });
  if (await mobileCloseTour.isVisible()) await mobileCloseTour.click();
  const mobileNavigation = page.getByTestId("student-mobile-nav");
  await expect(
    mobileNavigation.getByRole("link", { name: "입시 지도" }),
  ).toHaveText("지도");
  await expectInterfaceFitsViewport(page);
});

test("학생 작업공간은 스크롤 유무와 관계없이 같은 화면 폭을 예약한다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");
  await page.setViewportSize({ width: 1280, height: 800 });

  const viewportWidths: number[] = [];
  for (const path of ["/dashboard", "/applications/demo/practice"]) {
    await visit(page, path);
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      gutter: getComputedStyle(document.documentElement).scrollbarGutter,
      innerWidth: window.innerWidth,
    }));
    expect(layout.gutter).toContain("stable");
    viewportWidths.push(layout.clientWidth);
  }

  expect(viewportWidths[0]).toBe(viewportWidths[1]);
});

test("모의면접 방식 선택은 질문 화면으로 자연스럽게 이어진다", async ({
  page,
}) => {
  await seedRoleSession(page, "user");
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, "/applications/demo/mock-interview");

  const picker = page.getByRole("group", { name: "연습 방식 선택" });
  const panel = picker.getByRole("button", { name: /학교 면접 위원/ });
  await panel.click();
  await expect(panel).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "학교 면접 위원으로 시작하기" })
    .click();

  await expect(page.getByRole("button", { name: "답변 시작" })).toBeVisible();
  await expectStepNavigationFitsItsContainer(page, "모의면접 진행 단계");
  await expectInterfaceFitsViewport(page);
});

test("교사 모바일 메뉴는 하단에 고정되고 여섯 작업 화면을 바로 잇는다", async ({
  page,
}) => {
  await seedRoleSession(page, "admin");

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await visit(page, "/admin/questions");

    const navigation = page.getByTestId("expert-mobile-nav");
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole("link")).toHaveCount(6);
    await expect(navigation).toHaveAttribute("data-active-index", "1");

    const layout = await navigation.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        bottomGap: window.innerHeight - rect.bottom,
        position: getComputedStyle(element).position,
        transform: getComputedStyle(element).transform,
        viewportFits:
          document.documentElement.scrollWidth <= window.innerWidth + 1,
      };
    });
    expect(layout.position).toBe("fixed");
    expect(layout.bottomGap).toBeGreaterThanOrEqual(0);
    expect(layout.bottomGap).toBeLessThanOrEqual(24);
    expect(layout.transform).toBe("none");
    expect(layout.viewportFits).toBe(true);
  }

  const navigation = page.getByTestId("expert-mobile-nav");
  await navigation.getByRole("link", { name: "수업 기준" }).click();
  await expect(page).toHaveURL(/\/admin\/prompts$/);
  await expect(navigation).toHaveAttribute("data-active-index", "2");
  await expect
    .poll(() => navigation.getAttribute("data-nav-motion"))
    .toBe("idle");

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(navigation).toBeHidden();
  await expect(page.getByTestId("expert-desktop-nav")).toBeVisible();
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

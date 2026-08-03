import { expect, test, type Page } from "@playwright/test";

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
  "/admin/reviews",
  "/admin/questions",
  "/admin/prompts",
  "/admin/videos",
  "/admin/schools",
  "/admin/users",
  "/admin/metrics",
  "/settings",
];

async function expectInterfaceFitsViewport(page: Page) {
  await expect(page.locator("main")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
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
          element.parentElement?.closest("main")
            ? [element.parentElement]
            : [],
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
                label: element.getAttribute("aria-label") ?? element.textContent?.trim(),
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
  await expect(page.locator("main").getByRole("heading", { level: 1 }).first()).toBeVisible();
}

async function signUp(page: Page, role: "student" | "expert") {
  await page.goto("/signup");
  if (role === "expert") {
    await page.getByRole("radio", { name: "전문가" }).click();
  }
  await page.getByLabel("이름", { exact: true }).fill(
    role === "student" ? "모바일학생" : "운영전문가",
  );
  await page
    .getByLabel("이메일", { exact: true })
    .fill(`${role}-${Date.now()}@example.com`);
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await page.getByRole("button", { name: "가입하고 시작하기" }).click();
  await expect(page).toHaveURL(role === "student" ? /\/dashboard$/ : /\/admin$/);
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
      await page.goto(path);
      await expectInterfaceFitsViewport(page);
    }
  }

  expect(pageErrors).toEqual([]);
  expect(
    consoleErrors.filter((message) => /hydration|hydrated|server rendered html/i.test(message)),
  ).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("학생 준비 전 단계는 모바일·태블릿·데스크톱에서 완결된다", async ({
  page,
}) => {
  await signUp(page, "student");

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of studentPaths) {
      await page.goto(path);
      await expectPrimaryTitle(page);
      await expectInterfaceFitsViewport(page);
    }
  }
});

test("전문가 운영 전 메뉴는 모바일·태블릿·데스크톱에서 완결된다", async ({
  page,
}) => {
  await signUp(page, "expert");

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of adminPaths) {
      await test.step(`${width}px ${path}`, async () => {
        await page.goto(path);
        await expectPrimaryTitle(page);
        await expectInterfaceFitsViewport(page);
      });
    }
  }
});

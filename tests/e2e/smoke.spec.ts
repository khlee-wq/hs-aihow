import { expect, test, type Page } from "@playwright/test";

async function visit(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-app-hydrated",
    "true",
  );
  const authForm = page.getByTestId("auth-form");
  if ((await authForm.count()) > 0) {
    await expect(authForm).toHaveAttribute("data-hydrated", "true");
  }
}

async function dismissFirstVisitTour(page: Page) {
  const dialog = page.getByRole("dialog", { name: /시작 안내 \d+단계/ });
  const opened = await dialog
    .waitFor({ state: "visible", timeout: 1_500 })
    .then(() => true)
    .catch(() => false);
  if (!opened) return;
  await dialog.getByRole("button", { name: "다시 보지 않기" }).click();
  await expect(dialog).toBeHidden();
}

async function expectPublicThemeToggleRemoved(page: Page) {
  const toggle = page.getByRole("button", { name: /현재 .* 테마/ });
  await expect(toggle).toHaveCount(0);
}

async function submitAuthForm(page: Page) {
  const submit = page.getByRole("button", {
    name: /가입하고 시작하기|내 준비로 들어가기/,
  });
  await submit.evaluate((element) => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    element.scrollIntoView({ block: "center" });
    root.style.scrollBehavior = previous;
  });
  await expect(submit).toBeVisible();
  await expect(submit).toBeEnabled();
  // 기본 버튼은 hover 시 살짝 떠오릅니다. CI의 포인터가 버튼 경계에 걸리면
  // hover 진입·해제가 반복되어 click의 stable 검사가 끝나지 않을 수 있으므로,
  // 실제 키보드 접근 흐름으로 폼 제출을 검증합니다.
  await submit.focus();
  await expect(submit).toBeFocused();
  await submit.press("Enter");
}

test("랜딩의 GSAP 히어로 모션이 오류 없이 준비된다", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await visit(page, "/");
  await expect(
    page.getByRole("heading", {
      name: "자소서가 끝나면, 말할 준비가 시작됩니다.",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("landing-hero-art")).toBeVisible();
  const visibleHeroArt = page.locator("[data-motion-waterfall-art]:visible");
  await expect(visibleHeroArt).toHaveCount(3);
  const productCards = page.locator(
    ".landing-product-stage [data-motion-product-card]",
  );
  await expect(productCards).toHaveCount(3);
  await page.getByTestId("landing-product-stage").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await expect(
    page.locator(".landing-product-stage [data-motion-product-card]").first(),
  ).toBeVisible();
  await page.getByTestId("landing-mentors").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "공다경" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "박영중" })).toBeVisible();
  await page.getByTestId("landing-pricing").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "준비 방식에 맞게 선택하세요" }),
  ).toBeVisible();
  await expect(
    page.getByTestId("landing-pricing").getByRole("link"),
  ).toHaveCount(3);
  expect(
    consoleErrors.filter((message) =>
      /hydration|hydrated|server rendered html/i.test(message),
    ),
  ).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("모바일 상품 카드는 세로 스크롤에 맞춰 가로로 이동한다", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "모바일 전용 가로 스크롤 검증");
  await visit(page, "/");
  const stage = page.locator("[data-motion-product-stage]");
  const track = page.locator("[data-motion-product-track]");
  await expect(stage).toBeVisible();
  await expect(track).toBeVisible();
  await page.waitForTimeout(1_200);

  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollBy(0, 640));
  await page.waitForTimeout(800);

  const transform = await track.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  expect(transform).not.toBe("none");
});

test("브랜드 톤 미리보기가 Iris와 Deep Teal을 즉시 전환한다", async ({
  page,
}) => {
  await visit(page, "/?palette=iris&palettePreview=1");
  await expect(page.getByTestId("brand-palette-preview")).toBeVisible();
  await expect
    .poll(() => page.locator("html").getAttribute("data-brand-palette"))
    .toBe("iris");

  await page.getByRole("button", { name: "브랜드 톤 열기" }).click();
  await page.getByRole("button", { name: /Deep Teal/ }).click();
  await expect
    .poll(() => page.locator("html").getAttribute("data-brand-palette"))
    .toBe("teal");
  await expect(page).toHaveURL(/palette=teal/);
});

test("320px 공개 헤더는 로그인·시작하기를 줄바꿈 없이 정리한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await visit(page, "/");

  const header = page.locator("header").first();
  const startLink = header.getByRole("link", { name: "시작하기" });
  await expect(startLink).toBeVisible();
  await expect(
    header.getByRole("button", { name: /현재 .* 테마/ }),
  ).toBeHidden();
  const layout = await startLink.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const headerRect = element.closest("header")?.getBoundingClientRect();
    return {
      height: rect.height,
      whiteSpace: style.whiteSpace,
      insideHeader: headerRect ? rect.right <= headerRect.right : false,
    };
  });
  expect(layout.whiteSpace).toBe("nowrap");
  expect(layout.height).toBeLessThanOrEqual(40);
  expect(layout.insideHeader).toBe(true);
});

test("공개 화면은 저장된 설정과 무관하게 라이트 테마만 사용한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("aihow-theme", "dark");
  });
  await visit(page, "/");

  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-force-theme",
    "light",
  );
  await expectPublicThemeToggleRemoved(page);
  expect(
    await page.evaluate(() => ({
      colorScheme: document.documentElement.style.colorScheme,
      storedTheme: window.localStorage.getItem("aihow-theme"),
    })),
  ).toEqual({ colorScheme: "light", storedTheme: "dark" });
});

test("학생이 가입하고 준비 화면으로 진입한다", async ({ page }, testInfo) => {
  await visit(page, "/signup?plan=all");
  await expectPublicThemeToggleRemoved(page);
  await page.getByLabel("이름", { exact: true }).fill("김하우");
  await page.getByLabel("이메일", { exact: true }).fill("student@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await submitAuthForm(page);

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "김하우님, 다음은 질문 연습입니다." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "질문 연습 시작하기" }),
  ).toBeVisible();
  await expect(page.getByTestId("student-shell")).toBeVisible();
  await expect(page.getByTestId("student-dashboard")).toBeVisible();
  await expect(page.getByText("AI briefing", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "이번 주 준비 신호" }),
  ).toBeVisible();
  await expect(
    page.locator("[data-testid=student-dashboard] [data-lottie-orbit]"),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "준비 과정" })).toBeVisible();
  await expect(
    page.getByRole("progressbar", { name: "전체 준비 진행률" }),
  ).toBeVisible();
  await expect(page.getByTestId("admissions-outlook")).toBeVisible();
  await expect(page.getByTestId("admissions-insight-deck")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "민사고 상세 해석 보기" }),
  ).toBeVisible();
  await dismissFirstVisitTour(page);
  const detailButton = page.getByRole("button", {
    name: "민사고 상세 해석 보기",
  });
  await detailButton.focus();
  await detailButton.press("Enter");
  await expect(
    page.getByRole("dialog", {
      name: "학교별 해석과 반복 훈련을 한 흐름으로 이어가세요",
    }),
  ).toBeVisible();
  const overlayLayout = await page
    .getByTestId("app-dialog-overlay")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        bodyLocked: getComputedStyle(document.body).overflow === "hidden",
        height: rect.height,
        parent: element.parentElement?.tagName,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        width: rect.width,
      };
    });
  expect(overlayLayout.parent).toBe("BODY");
  expect(overlayLayout.bodyLocked).toBe(true);
  expect(
    Math.abs(overlayLayout.width - overlayLayout.viewportWidth),
  ).toBeLessThan(1);
  expect(
    Math.abs(overlayLayout.height - overlayLayout.viewportHeight),
  ).toBeLessThan(1);
  const closeMembership = page.getByRole("button", { name: "확인했어요" });
  await closeMembership.focus();
  await closeMembership.press("Enter");
  if (testInfo.project.name === "mobile") {
    await expect(page.getByTestId("student-mobile-nav")).toBeVisible();
    await expect(page.getByTestId("student-desktop-nav")).toBeHidden();
    await expect(
      page
        .getByTestId("student-mobile-nav")
        .locator("[data-menu-icon]")
        .first(),
    ).toBeVisible();
    const mobileNavStyle = await page
      .getByTestId("student-mobile-nav")
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          backdropFilter: style.backdropFilter,
          borderRadius: Number.parseFloat(style.borderRadius),
        };
      });
    expect(mobileNavStyle.backdropFilter).not.toBe("none");
    expect(mobileNavStyle.borderRadius).toBeGreaterThanOrEqual(16);
  } else {
    await expect(page.getByTestId("student-desktop-nav")).toBeVisible();
    await expect(page.getByTestId("student-mobile-nav")).toBeHidden();
    await expect(
      page.getByTestId("student-desktop-nav").locator("[data-menu-icon]"),
    ).toHaveCount(0);
    const essayMenu = page
      .getByTestId("student-desktop-nav")
      .getByRole("link", { name: "자소서" });
    await essayMenu.hover();
    await expect
      .poll(() =>
        essayMenu.evaluate((element) => getComputedStyle(element).transform),
      )
      .not.toBe("none");
    await page.setViewportSize({ width: 900, height: 900 });
    await expect(page.getByTestId("student-desktop-nav")).toBeHidden();
    await expect(page.getByTestId("student-mobile-nav")).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 720 });
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const practiceLink = page.getByRole("link", {
    name: "질문 연습 시작하기",
  });
  if (testInfo.project.name === "mobile") await practiceLink.tap();
  else await practiceLink.click();
  await expect(page).toHaveURL(/\/applications\/demo\/practice$/);
  await expect(
    page.getByRole("heading", {
      name: "자소서에서 물어볼 이야기를 함께 찾아볼게요",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "이유를 이어 말할 질문 선택의 이유 잠김",
    }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "이 질문에 대한 내 답변" })
    .fill(
      "실험 결과가 예상과 달랐을 때 기록 기준을 다시 세우고 팀원과 변인을 하나씩 확인했습니다.",
    );
  await page.getByRole("button", { name: "답변 제출" }).click();
  await expect(page.getByRole("status")).toContainText("다음 질문 열림");
  await expect(
    page.getByRole("button", {
      name: "이유를 이어 말할 질문 선택의 이유",
    }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "다음 질문" }).click();
  await expect(
    page.getByRole("heading", {
      name: "여러 해결 방법 중 기록 방식을 다시 점검하기로 한 이유는 무엇인가요?",
    }),
  ).toBeVisible();
  const forbiddenApi = await page.request.get("/api/question-rules");
  expect(forbiddenApi.status()).toBe(403);
  await visit(page, "/applications/demo/not-a-step");
  await expect(
    page.getByRole("heading", { name: "찾으시는 화면이 없어요" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "교사 워크스페이스로 전환" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", {
      name: "수업 기준이 학생의 연습을 이끕니다",
    }),
  ).toBeVisible();
});

test("비로그인 보호 경로는 원래 목적지를 보존해 로그인으로 보낸다", async ({
  page,
}) => {
  await visit(page, "/admin/questions?filter=review");
  await expect(page).toHaveURL(
    /\/login\?next=%2Fadmin%2Fquestions%3Ffilter%3Dreview$/,
  );
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
});

test("로그인 역할은 첫 화면만 정하고 두 작업 공간을 오갈 수 있다", async ({
  page,
}, testInfo) => {
  await visit(page, "/signup");
  await expectPublicThemeToggleRemoved(page);
  await page.getByRole("radio", { name: "교사" }).click();
  await page.getByLabel("이름", { exact: true }).fill("이소장");
  await page.getByLabel("이메일", { exact: true }).fill("expert@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await submitAuthForm(page);

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", {
      name: "수업 기준이 학생의 연습을 이끕니다",
    }),
  ).toBeVisible();
  await dismissFirstVisitTour(page);
  if (testInfo.project.name === "mobile") {
    await expect(page.getByTestId("expert-mobile-nav")).toBeVisible();
    await expect(
      page.getByTestId("expert-mobile-nav").locator("[data-menu-icon]").first(),
    ).toBeVisible();
  } else {
    await expect(page.getByTestId("expert-desktop-nav")).toBeVisible();
    await expect(
      page.getByTestId("expert-desktop-nav").locator("[data-menu-icon]"),
    ).toHaveCount(0);
  }
  await page.getByRole("link", { name: "학생 화면으로 전환" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByTestId("student-dashboard")).toBeVisible();
  await visit(page, "/admin/not-a-section");
  await expect(
    page.getByRole("heading", { name: "찾으시는 화면이 없어요" }),
  ).toBeVisible();
});

test("전문가가 코칭 규칙과 최종 답변을 수정해 승인한다", async ({ page }) => {
  await visit(page, "/signup");
  await page.getByRole("radio", { name: "교사" }).click();
  await page.getByLabel("이름", { exact: true }).fill("김소장");
  await page.getByLabel("이메일", { exact: true }).fill("prompt@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await submitAuthForm(page);
  await expect(page).toHaveURL(/\/admin$/);

  await visit(page, "/admin/prompts");
  await expect(
    page.getByRole("heading", { name: "코칭 설계실" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /04 모의면접/ }).click();
  await expect(
    page.getByRole("heading", { name: "모의면접의 판단 방식을 정합니다" }),
  ).toBeVisible();

  const expertAnswer = page.getByLabel("학생에게 적용할 최종 코칭 답변");
  await expertAnswer.fill("소장님이 직접 수정한 모의면접 코칭 기준입니다.");
  await expect(page.getByText("교사 조정본")).toBeVisible();
  await page.getByRole("button", { name: "승인하고 적용" }).click();
  await expect(page.getByRole("status")).toContainText("승인했습니다");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("운영자가 코칭 레시피를 설정하고 승인한다", async ({ page }) => {
  await visit(page, "/signup");
  await page.getByRole("radio", { name: "교사" }).click();
  await page.getByLabel("이름", { exact: true }).fill("박소장");
  await page.getByLabel("이메일", { exact: true }).fill("review@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await submitAuthForm(page);
  await expect(page).toHaveURL(/\/admin$/);

  await visit(page, "/admin/prompts");
  await expect(
    page.getByRole("heading", { name: "코칭 설계실" }),
  ).toBeVisible();
  await page
    .getByLabel("교사가 입력한 프롬프트")
    .fill("학생의 판단 근거를 먼저 확인하고, 다음 행동을 한 가지 제안합니다.");
  await page.getByRole("button", { name: "승인하고 적용" }).click();
  await expect(page.getByRole("status")).toContainText("승인했습니다");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("전문가가 질문 기준을 생성·수정·삭제한다", async ({ page }, testInfo) => {
  const title = `브라우저 CRUD ${testInfo.project.name} ${Date.now()}`;
  await visit(page, "/signup");
  await page.getByRole("radio", { name: "교사" }).click();
  await page.getByLabel("이름", { exact: true }).fill("이소장");
  await page
    .getByLabel("이메일", { exact: true })
    .fill(`crud-${testInfo.project.name}@example.com`);
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await submitAuthForm(page);
  await expect(page).toHaveURL(/\/admin$/);
  await visit(page, "/admin/questions");

  await page.getByRole("button", { name: "질문 기준 등록" }).click();
  await page.getByLabel("기준 이름").fill(title);
  await page.getByLabel("학교 범위").fill("테스트고");
  await page.getByLabel("질문 유형").fill("실행 검증");
  await page.getByLabel("상태").selectOption("review");
  await page.getByLabel("연결 예시 수").fill("3");
  await page.getByRole("button", { name: "기준 등록", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("저장했습니다");
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  await page.getByRole("button", { name: `${title} 편집` }).click();
  await page.getByLabel("학교 범위").fill("수정고");
  await page.getByRole("button", { name: "변경 저장" }).click();
  await expect(page.getByText(/수정고 · 실행 검증/).first()).toBeVisible();

  await page.getByRole("button", { name: `${title} 편집` }).click();
  await page.getByRole("button", { name: "삭제", exact: true }).click();
  await page.getByRole("button", { name: "정말 삭제" }).click();
  await expect(page.getByRole("status")).toContainText("삭제했습니다");
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
});

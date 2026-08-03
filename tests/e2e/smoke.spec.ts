import { expect, test } from "@playwright/test";

test("랜딩의 GSAP·Lottie 모션이 오류 없이 준비된다", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "자소서가 끝나면, 말할 준비가 시작됩니다.",
    }),
  ).toBeVisible();
  await expect(page.locator("[data-lottie-orbit] svg")).toBeVisible();
  await page.waitForTimeout(1_000);
  const transform = await page
    .locator("[data-motion-float]")
    .evaluate((element) => getComputedStyle(element).transform);
  expect(transform).not.toBe("none");
  expect(
    consoleErrors.filter((message) =>
      /hydration|hydrated|server rendered html/i.test(message),
    ),
  ).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("학생이 가입하고 준비 화면으로 진입한다", async ({ page }, testInfo) => {
  await page.goto("/signup?plan=all");
  await expect(
    page.getByRole("button", { name: /현재 .* 테마/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /현재 .* 테마/ }).locator("svg"),
  ).toHaveCount(0);
  await page.getByLabel("이름", { exact: true }).fill("김하우");
  await page.getByLabel("이메일", { exact: true }).fill("student@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await page.getByRole("button", { name: "가입하고 시작하기" }).click();

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
    page.locator("[data-testid=student-dashboard] [data-lottie-orbit] svg"),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "준비 과정" })).toBeVisible();
  await expect(
    page.getByRole("progressbar", { name: "전체 준비 진행률" }),
  ).toBeVisible();
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
  await page.getByRole("link", { name: "질문 연습 시작하기" }).click();
  await expect(page).toHaveURL(/\/applications\/demo\/practice$/);
  await expect(
    page.getByText("예상 질문 퀘스트", { exact: true }),
  ).toBeVisible();
  const forbiddenApi = await page.request.get("/api/question-rules");
  expect(forbiddenApi.status()).toBe(403);
  await page.goto("/applications/demo/not-a-step");
  await expect(
    page.getByRole("heading", { name: "이 경로는 아직 준비되지 않았어요" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "운영 화면으로 전환" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "좋은 기준이, 좋은 질문을 만듭니다" }),
  ).toBeVisible();
});

test("비로그인 보호 경로는 원래 목적지를 보존해 로그인으로 보낸다", async ({
  page,
}) => {
  await page.goto("/admin/questions?filter=review");
  await expect(page).toHaveURL(
    /\/login\?next=%2Fadmin%2Fquestions%3Ffilter%3Dreview$/,
  );
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
});

test("로그인 역할은 첫 화면만 정하고 두 작업 공간을 오갈 수 있다", async ({
  page,
}, testInfo) => {
  await page.goto("/signup");
  await expect(
    page.getByRole("button", { name: /현재 .* 테마/ }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "전문가" }).click();
  await page.getByLabel("이름", { exact: true }).fill("이소장");
  await page.getByLabel("이메일", { exact: true }).fill("expert@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await page.getByRole("button", { name: "가입하고 시작하기" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "좋은 기준이, 좋은 질문을 만듭니다" }),
  ).toBeVisible();
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
  await page.goto("/admin/not-a-section");
  await expect(
    page.getByRole("heading", { name: "이 경로는 아직 준비되지 않았어요" }),
  ).toBeVisible();
});

test("전문가가 코칭 규칙과 최종 답변을 수정해 승인한다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("radio", { name: "전문가" }).click();
  await page.getByLabel("이름", { exact: true }).fill("김소장");
  await page.getByLabel("이메일", { exact: true }).fill("prompt@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await page.getByRole("button", { name: "가입하고 시작하기" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/prompts");
  await expect(
    page.getByRole("heading", { name: "코칭 설계실" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /04 모의면접/ }).click();
  await expect(
    page.getByRole("heading", { name: "모의면접의 판단 방식을 정합니다" }),
  ).toBeVisible();

  const expertAnswer = page.getByLabel("학생에게 적용할 최종 코칭 답변");
  await expertAnswer.fill("소장님이 직접 수정한 모의면접 코칭 기준입니다.");
  await expect(page.getByText("전문가 수정됨")).toBeVisible();
  await page.getByRole("button", { name: "승인하고 적용" }).click();
  await expect(page.getByRole("status")).toContainText("승인했습니다");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("운영자가 학생 입력과 코칭 답변을 직접 수정해 승인한다", async ({
  page,
}) => {
  await page.goto("/signup");
  await page.getByRole("radio", { name: "전문가" }).click();
  await page.getByLabel("이름", { exact: true }).fill("박소장");
  await page.getByLabel("이메일", { exact: true }).fill("review@example.com");
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await page.getByRole("button", { name: "가입하고 시작하기" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/reviews");
  await expect(
    page.getByRole("heading", { name: "코칭 응답 검수" }),
  ).toBeVisible();
  await page
    .getByLabel("최종 코칭 답변 수정")
    .fill("소장님이 학생의 판단 근거를 중심으로 수정한 답변입니다.");
  await page.getByRole("button", { name: "승인하고 학생에게 적용" }).click();
  await expect(page.getByRole("status")).toContainText("승인했습니다");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("전문가가 질문 기준을 생성·수정·삭제한다", async ({ page }, testInfo) => {
  const title = `브라우저 CRUD ${testInfo.project.name} ${Date.now()}`;
  await page.goto("/signup");
  await page.getByRole("radio", { name: "전문가" }).click();
  await page.getByLabel("이름", { exact: true }).fill("이소장");
  await page
    .getByLabel("이메일", { exact: true })
    .fill(`crud-${testInfo.project.name}@example.com`);
  await page.getByPlaceholder("4자 이상").fill("demo1234");
  await page.getByRole("button", { name: "가입하고 시작하기" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/questions");

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

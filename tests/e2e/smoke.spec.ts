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
  await expect(page.getByRole("heading", { name: "준비 과정" })).toBeVisible();
  await expect(
    page.getByRole("progressbar", { name: "전체 준비 진행률" }),
  ).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await expect(page.getByTestId("student-mobile-nav")).toBeVisible();
    await expect(page.getByTestId("student-desktop-nav")).toBeHidden();
  } else {
    await expect(page.getByTestId("student-desktop-nav")).toBeVisible();
    await expect(page.getByTestId("student-mobile-nav")).toBeHidden();
  }
  const forbiddenApi = await page.request.get("/api/question-rules");
  expect(forbiddenApi.status()).toBe(403);
  await page.goto("/admin/questions");
  await expect(page).toHaveURL(/\/dashboard$/);
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

test("전문가 역할과 학생 라우트 경계를 지킨다", async ({ page }) => {
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
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/admin$/);
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

# highsc-aihow engineering guide

- 사용자 노출 브랜드는 `AIHOW`, 저장소명은 `highsc-aihow`다.
- `src/app`에는 라우트 조립만 두고 제품 로직은 `features`와 `lib`에 둔다.
- UI는 `src/styles/tokens.css`의 의미 토큰을 사용한다. 페이지에서 임의 브랜드 색·radius·shadow를 추가하지 않는다.
- 서버 상태는 TanStack Query, 전역 제품 상태는 Zustand, 폼·일시 UI는 지역 상태로 관리한다.
- 모든 신규 주요 라우트에는 실제 화면 구조를 닮은 `loading.tsx` 또는 Suspense skeleton을 제공한다.
- 학생 원문, 비밀번호, 토큰, API 키와 음성 내용을 로그나 fixture에 저장하지 않는다.
- 모바일 학생 메뉴는 하단 내비게이션을 유지하고, 모든 상태는 색상 외 아이콘·텍스트로도 전달한다.
- `prefers-reduced-motion`, 키보드 포커스와 light/dark/system 테마를 회귀 확인한다.
- 모든 UI 변경은 최소 `320px`, `390px`, `768px`, `900px`, `1280px` 폭에서 잘림·가로 넘침·겹침·터치 영역을 함께 검토한다. 데스크톱만 확인한 변경은 완료로 보지 않는다.
- 문구, 접근성 이름, 내비게이션 노출 조건 또는 사용자 흐름을 바꾸면 같은 변경에서 관련 Playwright E2E 기대값도 갱신한다.
- E2E는 서버 HTML이 보이는 것만으로 상호작용 준비를 판단하지 않는다. 클릭·입력 전에 `data-app-hydrated="true"`를 확인하고, Lottie 같은 외부 라이브러리의 내부 DOM 대신 사용자에게 보이는 역할·컨테이너를 검증한다.
- 반응형 시나리오는 desktop/mobile 프로젝트에서 각각 검증하되, 테스트 안에서 직접 데스크톱→모바일로 전환하는 시나리오는 한 프로젝트에서만 실행해 중복과 경합을 피한다.
- UI 작업 완료 전 `bun run lint`, `bun run typecheck`, `bun run test`, `CI=1 bun run test:e2e`를 실행하고 프로덕션 빌드 기반 E2E 결과를 확인한다.

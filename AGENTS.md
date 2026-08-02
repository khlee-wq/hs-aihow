# highsc-aihow engineering guide

- 사용자 노출 브랜드는 `AIHOW`, 저장소명은 `highsc-aihow`다.
- `src/app`에는 라우트 조립만 두고 제품 로직은 `features`와 `lib`에 둔다.
- UI는 `src/styles/tokens.css`의 의미 토큰을 사용한다. 페이지에서 임의 브랜드 색·radius·shadow를 추가하지 않는다.
- 서버 상태는 TanStack Query, 전역 제품 상태는 Zustand, 폼·일시 UI는 지역 상태로 관리한다.
- 모든 신규 주요 라우트에는 실제 화면 구조를 닮은 `loading.tsx` 또는 Suspense skeleton을 제공한다.
- 학생 원문, 비밀번호, 토큰, API 키와 음성 내용을 로그나 fixture에 저장하지 않는다.
- 모바일 학생 메뉴는 하단 내비게이션을 유지하고, 모든 상태는 색상 외 아이콘·텍스트로도 전달한다.
- `prefers-reduced-motion`, 키보드 포커스와 light/dark/system 테마를 회귀 확인한다.

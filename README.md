# highsc-aihow

AIHOW의 고입 자소서 코칭 및 실전 면접 훈련 웹 플랫폼입니다. iCloud Obsidian의 `AIHOW-Interview` 제품 문서와 `sc-aihow`의 운영 엔지니어링 원칙을 바탕으로 새 UI와 구조로 구현했습니다.

## 실행

```bash
nvm install
nvm use
node --version
bun install
bun dev
```

Node는 `.nvmrc`, `.node-version`, `package.json`, CI에서 모두 22.x로
고정합니다. `bun run release:check`도 잘못된 Node 버전이면 빌드 전에
중단됩니다.

- 공개 화면: `http://localhost:3000`
- 학생 데모: 회원가입에서 `학생·학부모` 선택
- 전문가 데모: 회원가입에서 `전문가` 선택
- 로컬 데모에서는 형식에 맞는 어떤 이메일·4자 이상 비밀번호도 통과합니다.

## 브랜치 운영

- `main`: 두 노트북 결과를 검토한 뒤 합치는 통합·배포 승인 기준
- `codex/company-laptop`: 회사 노트북에서만 개발하고 push하는 트랙
- `codex/personal-laptop`: 개인 노트북에서만 개발하고 push하는 트랙

두 작업 브랜치 사이에서는 필요한 커밋만 PR 또는 `cherry-pick`으로
이관합니다. 회사 노트북 연결이 복구되기 전까지
`codex/company-laptop`은 공통 기준점에서 대기하며 개인 노트북 코드를
임의로 복사하지 않습니다. force push 없이 각 노트북에서 자기 브랜치만
push합니다.

## 구조

- `src/app`: App Router, 역할별 라우트, 로딩·오류 경계
- `src/features`: 랜딩, 인증, 학생 여정, 전문가 운영, 설정
- `src/components`: 토큰 기반 공통 UI와 반응형 App Shell
- `src/stores`: Zustand 기반 영속 데모 진행 상태
- `src/styles/tokens.css`: light/dark semantic design tokens
- `src/lib`: 세션 경계, mock data, 제품 진행률 규칙
- `src/server/repositories`: 데모·Supabase 교체형 저장소 계층
- `supabase/migrations`: RLS가 적용된 배포용 Postgres 스키마

## Supabase · Vercel 연결

현재 `DATA_BACKEND=demo`에서는 별도 계정 없이 CRUD를 검증할 수 있습니다. 연결 시 Supabase CLI로 migration을 적용하고 Vercel의 Preview·Production 환경에 `.env.example`의 공개 Supabase 변수 두 개를 각각 등록한 뒤 `DATA_BACKEND=supabase`로 변경합니다. CRUD는 SSR 사용자 세션과 RLS 정책을 그대로 사용하며 Service Role 키로 우회하지 않습니다.

현재 단계에서는 프로젝트나 계정을 연결하지 않습니다. 저장소 remote가
준비되면 아래 명령부터 이어갈 수 있도록 migration, RLS, 환경변수 검사,
서울 리전 설정만 유지합니다.

```bash
supabase link --project-ref <project-ref>
supabase db push
vercel env pull .env.local
DATA_BACKEND=supabase bun run check:env
```

GitHub Actions는 lint, typecheck, unit test, production build, Chromium E2E를 통과해야 완료됩니다. Vercel은 서울 리전(`icn1`)의 Next.js 프로젝트로 설정되어 있습니다.

## 검증

```bash
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
```

실제 인증·DB·OCR·LLM·음성·결제는 adapter 경계를 유지한 채 다음 단계에서 연결합니다. 현재 데모는 비밀번호, 자소서 원문 또는 음성을 저장하지 않습니다.

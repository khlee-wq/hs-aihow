import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  ChevronRight,
  FileCheck2,
  Fingerprint,
  MessageCircleQuestion,
  Mic2,
  Play,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JourneyOrbit } from "@/components/motion/journey-orbit";

const products = [
  {
    title: "자소서 코칭",
    tag: "글을 다듬는 준비",
    description: "초안의 소재와 논리를 이해하고, 내 언어로 완성해요.",
    features: ["자소서 구조 진단", "핵심 소재 맵", "전문가 영상 가이드"],
    tone: "mint",
    icon: FileCheck2,
  },
  {
    title: "면접 훈련",
    tag: "말로 바꾸는 준비",
    description: "자소서 근거에서 시작한 질문에 답하며 실전 감각을 만들어요.",
    features: ["학교별 예상 질문", "꼬리질문 퀘스트", "음성 모의면접"],
    tone: "blue",
    icon: Mic2,
  },
  {
    title: "통합 패키지",
    tag: "쓰고, 생각하고, 말하기",
    description: "자소서에서 면접 직전 한 장까지 하나의 과정으로 연결해요.",
    features: ["모든 코칭·훈련", "진행 이력 연결", "1페이지 파이널 노트"],
    tone: "coral",
    icon: BookOpenCheck,
  },
];

const journey = [
  {
    icon: FileCheck2,
    title: "자소서 확인",
    text: "업로드한 원문과 추출 결과를 먼저 직접 확인해요.",
  },
  {
    icon: BrainCircuit,
    title: "핵심 분석",
    text: "답변의 근거가 될 소재와 논리 포인트를 찾습니다.",
  },
  {
    icon: MessageCircleQuestion,
    title: "질문 훈련",
    text: "예상 질문부터 꼬리질문까지 한 단계씩 답해요.",
  },
  {
    icon: Mic2,
    title: "실전 연습",
    text: "원하는 면접관 방식으로 말하는 연습을 반복해요.",
  },
  {
    icon: BookOpenCheck,
    title: "파이널 노트",
    text: "면접 직전 볼 핵심 답변을 한 장으로 정리해요.",
  },
];

const mentors = [
  {
    name: "공다경",
    role: "입시 전략 총괄 디렉터",
    image: "/mentors/gong-dakyung.png",
    tags: ["고입 전략", "자소서 구조", "면접 설계"],
    quote: "학생의 고유한 경험이 질문의 근거가 됩니다.",
  },
  {
    name: "박영중",
    role: "AI 커리큘럼 설계 디렉터",
    image: "/mentors/park-youngjoong.png",
    tags: ["질문 설계", "모의면접", "AI 활용 교육"],
    quote: "AI는 정답을 쓰지 않고, 생각을 이끌어냅니다.",
  },
];

const plans = [
  {
    title: "자소서 코칭",
    description: "초안을 읽고, 핵심 소재와 문장 구조를 내 언어로 정리하는 과정",
    features: ["자소서 구조 진단", "핵심 소재 맵", "전문가 영상 가이드"],
    plan: "essay",
  },
  {
    title: "면접 훈련",
    description: "자소서 근거에서 시작해 질문과 답변을 반복하는 실전 과정",
    features: ["학교별 예상 질문", "꼬리질문 퀘스트", "음성 모의면접"],
    plan: "interview",
  },
  {
    title: "통합 패키지",
    description: "자소서부터 면접 직전 한 장의 파이널 노트까지 연결하는 과정",
    features: ["자소서 코칭 전체", "면접 훈련 전체", "진행 이력 연결"],
    plan: "all",
    featured: true,
  },
];

export function LandingPage() {
  return (
    <>
      <section className="landing-hero relative overflow-hidden pb-8 pt-16 sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-28">
        <div className="page-wrap grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="float-in" data-motion-hero data-testid="landing-hero-copy">
            <p className="eyebrow mb-6">AIHOW Interview</p>
            <h1 className="display text-balance">
              자소서가 끝나면,
              <br />
              <span className="text-[var(--brand)]">말할 준비</span>가
              시작됩니다.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              전문가의 기준과 나의 실제 자소서를 연결해, 예상 질문부터 음성
              면접과 한 장의 파이널 노트까지 준비하세요.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className={cn(buttonVariants({ size: "lg" }), "group")}
                href="/signup"
              >
                내 준비 시작하기{" "}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                className={buttonVariants({ variant: "secondary", size: "lg" })}
                href="#journey"
              >
                <Play className="size-4 fill-current" />
                준비 과정 보기
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-[var(--text-secondary)]">
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[var(--success)]" />
                학생이 직접 완성
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[var(--success)]" />
                전문가 기준 기반
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[var(--success)]" />
                자료 보관 상태 확인
              </span>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section
        className="border-y border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] py-8 shadow-[0_18px_50px_color-mix(in_srgb,var(--surface-inverse)_3%,transparent)] backdrop-blur-sm"
        data-motion-reveal
        data-testid="landing-role-strip"
      >
        <div className="page-wrap grid gap-6 text-center sm:grid-cols-3">
          <Role icon={Sparkles} title="AI는" text="근거를 정리하고 질문해요" />
          <Role
            icon={UserRoundCheck}
            title="전문가는"
            text="판단 기준을 설계해요"
          />
          <Role
            icon={Fingerprint}
            title="학생은"
            text="생각하고 직접 완성해요"
          />
        </div>
      </section>

      <section
        id="products"
        className="scroll-mt-24 py-24 lg:py-32"
        data-motion-reveal
      >
        <div className="page-wrap">
          <SectionIntro
            eyebrow="Choose your path"
            title="지금 필요한 준비부터 시작하세요"
            text="각 상품은 독립적으로 사용할 수 있고, 통합 패키지에서는 앞 단계의 결과가 다음 준비로 자연스럽게 이어집니다."
          />
          <div
            className="landing-product-stage mt-12"
            data-motion-product-stage
            data-testid="landing-product-stage"
          >
            <div
              className="landing-product-track grid gap-5 sm:grid-cols-2"
              data-motion-product-track
            >
              {products.map(({ icon: Icon, ...product }, index) => (
                <article
                  key={product.title}
                  data-motion-product-card
                  className={cn(
                    `landing-product-card--${product.tone}`,
                    "landing-product-card relative flex flex-col overflow-hidden",
                    index === 2 &&
                      "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)]",
                  )}
                >
                  <div className="landing-product-art" aria-hidden="true">
                    <Icon className="size-10" strokeWidth={1.65} />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="landing-product-copy">
                  <span className="landing-product-step" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <p className="text-xs font-extrabold text-[var(--text-tertiary)]">
                    {product.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-.04em]">
                    {product.title}
                  </h3>
                  <p
                    className="korean-copy mt-4 min-h-14 text-sm leading-7 text-[var(--text-secondary)]"
                    data-testid="landing-product-description"
                  >
                    {product.description}
                  </p>
                  <ul className="mt-7 grid gap-3">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm font-bold"
                      >
                        <span className="grid size-5 place-items-center rounded-full bg-[var(--mint-soft)]">
                          <Check className="size-3 text-[var(--success)]" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/signup?plan=${index === 0 ? "essay" : index === 1 ? "interview" : "all"}`}
                    className="mt-8 inline-flex items-center gap-1 text-sm font-extrabold text-[var(--brand)]"
                  >
                    이 과정으로 시작하기 <ChevronRight className="size-4" />
                  </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="journey"
        className="journey-stage surface-contrast scroll-mt-24 py-24 lg:py-32"
      >
        <div className="page-wrap">
          <SectionIntro
            eyebrow="One clear journey"
            title="한 화면에, 지금 할 일 하나"
            text="무엇을 물어볼지 고민하는 채팅이 아닙니다. 완료한 결과가 다음 단계의 준비물이 되는 명확한 경로입니다."
            inverse
          />
          <div className="mt-14 grid gap-3 lg:grid-cols-5" data-motion-journey>
            {journey.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                data-motion-item
                className="journey-step relative rounded-[var(--radius-lg)] border border-white/10 p-5"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-black opacity-50">
                    0{index + 1}
                  </span>
                  <Icon className="size-5 text-[var(--mint)]" />
                </div>
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-65">{text}</p>
                {index < journey.length - 1 ? (
                  <ChevronRight className="absolute -right-4 top-1/2 z-10 hidden size-5 opacity-40 lg:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="experts"
        className="scroll-mt-24 overflow-hidden py-24 lg:py-32"
        data-motion-reveal
      >
        <div className="page-wrap grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionIntro
              eyebrow="Human-guided AI"
              title="좋은 질문은, 좋은 기준에서 시작됩니다"
              text="원장·소장·컨설턴트가 학교별 판단 기준과 질문 규칙을 직접 등록하고, AI 결과를 검수합니다."
            />
            <div className="mt-8 grid gap-4">
              <ExpertPoint
                icon={MessageCircleQuestion}
                title="질문 기준과 꼬리질문 규칙"
                text="학교·학년도·전형과 자소서 근거를 함께 연결합니다."
              />
              <ExpertPoint
                icon={ShieldCheck}
                title="승인 상태와 변경 이력"
                text="전문가가 제공 범위를 알고 직접 검수할 수 있습니다."
              />
              <ExpertPoint
                icon={Play}
                title="필요한 순간의 짧은 영상"
                text="긴 강의보다 구체적인 코칭 지점에 가이드를 제공합니다."
              />
            </div>
          </div>
          <div data-motion-parallax>
            <ExpertConsole />
          </div>
        </div>
      </section>

      <section
        id="mentors"
        className="scroll-mt-24 border-y border-[var(--border-soft)] bg-[var(--surface-muted)] py-24 lg:py-32"
        data-testid="landing-mentors"
      >
        <div className="page-wrap">
          <div className="mx-auto max-w-4xl text-center" data-motion-reveal>
            <p className="eyebrow">Program leaders</p>
            <h2
              className="mt-4 whitespace-nowrap text-[clamp(1.125rem,5.5vw,3rem)] font-black leading-[1.08] tracking-[-.035em]"
              data-testid="landing-mentors-heading"
            >
              전문가의 기준이 과정 안에 남습니다
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              두 전문가가 설계한 질문의 기준과 코칭 원칙을 서비스 안에서 이어갑니다.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2" data-motion-drop-group>
            {mentors.map((mentor) => (
              <Card
                key={mentor.name}
                data-motion-drop
                className="surface-interactive flex min-h-72 flex-col p-6 sm:p-7"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={mentor.image}
                    alt={`${mentor.name} ${mentor.role}`}
                    width={72}
                    height={72}
                    className="size-[4.5rem] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-black tracking-[-.04em]">{mentor.name}</h3>
                    <p className="mt-1 text-sm font-bold text-[var(--text-secondary)]">{mentor.role}</p>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {mentor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-extrabold text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <blockquote className="mt-auto pt-8 text-base font-bold leading-7 tracking-[-.02em] text-[var(--text-primary)]">
                  &ldquo;{mentor.quote}&rdquo;
                </blockquote>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 py-24 lg:py-32"
        data-motion-reveal
        data-testid="landing-pricing"
      >
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Plans</p>
            <h2 className="heading-xl mt-4 text-balance">준비 방식에 맞게 선택하세요</h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              자소서와 면접을 각각 시작하거나, 하나의 흐름으로 연결할 수 있습니다.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3" data-motion-drop-group>
            {plans.map((plan) => (
              <Card
                key={plan.title}
                data-motion-drop
                className={cn(
                  "surface-interactive relative flex min-h-[28rem] flex-col p-7",
                  plan.featured && "border-[var(--brand)] shadow-[var(--shadow-brand)]",
                )}
              >
                {plan.featured ? (
                  <span className="absolute right-6 top-6 rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-black text-[var(--brand)]">
                    함께 준비하기
                  </span>
                ) : null}
                <p className="text-sm font-extrabold text-[var(--text-secondary)]">{plan.title}</p>
                <p className="mt-4 min-h-14 text-sm leading-7 text-[var(--text-secondary)]">
                  {plan.description}
                </p>
                <div className="mt-7 rounded-[var(--radius-md)] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="text-xs font-bold text-[var(--text-tertiary)]">출시 전 가격 안내</p>
                  <p className="mt-1 text-sm font-extrabold">구성 확정 후 가장 먼저 안내드립니다.</p>
                </div>
                <ul className="mt-7 grid gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm font-bold">
                      <Check className="size-4 text-[var(--success)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${plan.plan}`}
                  className="mt-auto inline-flex items-center gap-1 pt-8 text-sm font-extrabold text-[var(--brand)]"
                >
                  출시 안내 받기 <ChevronRight className="size-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="page-wrap relative overflow-hidden rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,white_18%,transparent)] bg-[var(--brand)] px-6 py-14 text-center text-[var(--text-on-brand)] shadow-[var(--shadow-brand)] sm:px-12 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[.14em] opacity-65">
            Ready when you are
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-black tracking-[-.05em] sm:text-5xl lg:max-w-none lg:whitespace-nowrap lg:text-[clamp(2.1rem,3.15vw,3.5rem)]">
            면접 직전의 한 장까지, 오늘 첫 질문부터 준비하세요.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 opacity-75">
            데모 단계에서는 어떤 이메일로 가입해도 전체 인터페이스를 바로 확인할
            수 있습니다.
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "mt-8 border-transparent bg-white text-[var(--brand-on-white)] hover:bg-white/90",
            )}
          >
            무료로 둘러보기 <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  inverse?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className={cn("eyebrow", inverse && "text-[var(--mint)]")}>
        {eyebrow}
      </p>
      <h2 className="heading-xl mt-4 text-balance">{title}</h2>
      <p
        className={cn(
          "korean-copy mt-5 text-base leading-8",
          inverse ? "text-white/65" : "text-[var(--text-secondary)]",
        )}
      >
        {text}
      </p>
    </div>
  );
}
function Role({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Icon className="size-5 text-[var(--brand)]" />
      <p className="text-sm">
        <strong>{title}</strong>{" "}
        <span className="text-[var(--text-secondary)]">{text}</span>
      </p>
    </div>
  );
}
function ExpertPoint({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <div
      className="surface-interactive flex gap-4 rounded-[var(--radius-lg)] border border-transparent p-3 hover:border-[var(--border-soft)] hover:bg-[var(--surface-subtle)]"
      data-motion-item
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-extrabold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {text}
        </p>
      </div>
    </div>
  );
}
function HeroPreview() {
  return (
    <div
      className="landing-preview-frame liquid-glass-group relative mx-auto mt-10 w-full max-w-[33rem] p-2 lg:mr-0 lg:mt-0"
      data-motion-float
      data-testid="landing-hero-preview"
    >
      <Card
        variant="glass"
        className="liquid-glass relative overflow-hidden border-0 p-0 shadow-none"
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2 rounded-full bg-[var(--coral)]" />
            <span className="size-2 rounded-full bg-[var(--warning)]" />
            <span className="size-2 rounded-full bg-[var(--mint)]" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-[var(--text-tertiary)]">
            Today&apos;s practice
          </p>
        </div>
        <div className="liquid-glass-section m-2 rounded-[calc(var(--radius-lg)-.3rem)] p-5 sm:m-3 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">오늘의 질문 2/5</p>
              <h3 className="mt-3 text-xl font-black leading-snug">
                지원 학교의 교육 철학과
                <br />내 경험을 연결해 설명해 보세요.
              </h3>
            </div>
            <div
              data-lottie-orbit
              className="liquid-orbit grid size-12 shrink-0 place-items-center rounded-full"
            >
              <JourneyOrbit className="size-12" />
            </div>
          </div>
          <div className="liquid-glass-section mt-6 rounded-[var(--radius-md)] p-4">
            <p className="text-xs font-black text-[var(--brand)]">자소서 근거</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              “과학 동아리에서 결과보다 실험 설계의 과정을 기록했습니다…”
            </p>
          </div>
          <div className="liquid-answer-field mt-4 h-24 rounded-[var(--radius-md)] p-4 text-sm text-[var(--text-tertiary)]">
            내 생각을 먼저 적어 보세요.
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-secondary)]">자동 저장됨</span>
            <span className="rounded-[var(--radius-sm)] bg-[var(--brand)] px-4 py-2.5 text-xs font-black text-[var(--text-on-brand)]">
              답변 저장
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
function ExpertConsole() {
  return (
    <Card className="surface-contrast relative overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black text-[var(--mint)]">
            EXPERT CONSOLE
          </p>
          <h3 className="mt-2 text-xl font-black">질문 기준 검수</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
          검수 대기 12
        </span>
      </div>
      <div className="mt-8 grid gap-3">
        {[
          "지원 동기 · 자소서 근거 연결",
          "협업 경험 · 역할 구체성",
          "탐구 과정 · 실패 이후 수정",
        ].map((item, index) => (
          <div
            key={item}
            className="rounded-[var(--radius-md)] bg-white/[.07] p-4"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-[var(--brand)] text-xs font-black">
                {index + 1}
              </span>
              <p className="text-sm font-bold">{item}</p>
              <span className="ml-auto text-[10px] font-bold text-white/50">
                2027 · 민사고
              </span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--mint)]"
                style={{ width: `${82 - index * 13}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xs">
        <span className="text-white/50">최근 기준 업데이트 8분 전</span>
        <span className="font-black text-[var(--mint)]">운영 화면 보기 →</span>
      </div>
    </Card>
  );
}

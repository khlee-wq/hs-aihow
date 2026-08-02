"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "이름을 2자 이상 입력해 주세요."),
  email: z.email("이메일 형식을 확인해 주세요."),
  password: z.string().min(4, "데모 비밀번호는 4자 이상 입력해 주세요."),
  role: z.enum(["student", "expert"]),
});
type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode, nextPath, plan }: { mode: "login" | "signup"; nextPath?: string; plan?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: mode === "login" ? "김하우" : "", email: mode === "login" ? "student@aihow.kr" : "", password: mode === "login" ? "demo1234" : "", role: "student" },
  });
  const role = useWatch({ control, name: "role" });

  const submit = handleSubmit(async (values) => {
    setServerError("");
    const response = await fetch("/api/auth/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, next: nextPath }) });
    const payload = await response.json() as { redirect?: string; message?: string };
    if (!response.ok || !payload.redirect) { setServerError(payload.message ?? "로그인하지 못했습니다. 다시 시도해 주세요."); return; }
    router.push(payload.redirect);
    router.refresh();
  });

  return (
    <div className="page-wrap grid min-h-[calc(100svh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1fr_30rem] lg:py-16">
      <div className="hidden max-w-xl lg:block">
        <p className="eyebrow">{mode === "signup" ? "Start your journey" : "Welcome back"}</p>
        <h1 className="heading-xl mt-5">{mode === "signup" ? "나의 준비를 한 단계씩 완성해요." : "준비하던 단계에서 바로 이어가세요."}</h1>
        <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">자소서의 근거부터 질문, 음성 연습, 파이널 노트까지 모든 진행 상태가 하나의 여정으로 이어집니다.</p>
        <ul className="mt-8 grid gap-4 text-sm font-bold">{["어떤 이메일이든 데모 가입 가능", "학생·전문가 인터페이스 역할별 확인", "이 기기에 진행 상태 자동 저장"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-[var(--mint-soft)] text-[var(--success)]"><Check className="size-4" /></span>{item}</li>)}</ul>
      </div>
      <div>
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] lg:hidden"><ArrowLeft className="size-4" />홈으로</Link>
        <Card className="p-6 sm:p-8">
          <div><p className="eyebrow">AIHOW Demo</p><h1 className="mt-3 text-2xl font-black tracking-[-.04em]">{mode === "signup" ? "회원가입" : "로그인"}</h1><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{mode === "signup" ? "역할을 선택하면 전체 제품을 바로 둘러볼 수 있어요." : "데모 계정이 미리 채워져 있어 바로 시작할 수 있어요."}</p></div>
          {plan ? <div className="mt-5 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] p-3 text-xs font-bold text-[var(--brand)]">선택한 과정: {plan === "essay" ? "자소서 코칭" : plan === "interview" ? "면접 훈련" : "통합 패키지"}</div> : null}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-1.5" role="radiogroup" aria-label="사용자 역할">
            <RoleButton active={role === "student"} onClick={() => setValue("role", "student")} icon={GraduationCap} label="학생·학부모" />
            <RoleButton active={role === "expert"} onClick={() => setValue("role", "expert")} icon={ShieldCheck} label="전문가" />
          </div>
          <form onSubmit={submit} className="mt-6 grid gap-5">
            <Field label="이름" error={errors.name?.message}><input {...register("name")} className={inputClass} autoComplete="name" placeholder="이름" /></Field>
            <Field label="이메일" error={errors.email?.message}><input {...register("email")} className={inputClass} type="email" autoComplete="email" placeholder="name@example.com" /></Field>
            <Field label="비밀번호" error={errors.password?.message} hint="데모에서는 실제 계정이나 비밀번호를 저장하지 않습니다."><input {...register("password")} className={inputClass} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="4자 이상" /></Field>
            <input type="hidden" {...register("role")} />
            {serverError ? <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--coral-soft)] p-3 text-sm font-bold text-[var(--danger)]">{serverError}</p> : null}
            <Button type="submit" size="lg" full loading={isSubmitting}>{mode === "signup" ? "가입하고 시작하기" : "내 준비로 들어가기"}<Sparkles className="size-4" /></Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">{mode === "signup" ? "이미 계정이 있나요?" : "처음 오셨나요?"} <Link className="font-extrabold text-[var(--brand)]" href={mode === "signup" ? "/login" : "/signup"}>{mode === "signup" ? "로그인" : "회원가입"}</Link></p>
        </Card>
      </div>
    </div>
  );
}

function RoleButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof GraduationCap; label: string }) {
  return <button type="button" role="radio" aria-checked={active} onClick={onClick} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] text-xs font-extrabold transition-colors", active ? "bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]" : "text-[var(--text-secondary)]")}><Icon className="size-4" />{label}</button>;
}

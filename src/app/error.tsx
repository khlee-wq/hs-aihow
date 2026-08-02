"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="grid min-h-[100svh] place-items-center p-6 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-[var(--coral-soft)] text-[var(--danger)]"><AlertTriangle className="size-7" /></span><h1 className="heading-lg mt-6">화면을 불러오지 못했어요</h1><p className="mt-3 text-sm text-[var(--text-secondary)]">작성 중인 로컬 내용은 유지됩니다. 잠시 후 다시 시도해 주세요.</p><Button className="mt-7" onClick={reset}><RotateCcw className="size-4" />다시 시도</Button></div></main>; }

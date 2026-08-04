import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminConsole } from "@/features/admin/admin-console";

export const metadata: Metadata = { title: "교사 워크스페이스" };
const sections = new Set([
  "home",
  "questions",
  "prompts",
  "videos",
  "schools",
  "metrics",
]);

export default async function AdminPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  if ((section?.length ?? 0) > 1) notFound();
  const current = section?.[0] ?? "home";
  // 기존 데모의 개별 결과 검수 링크는 공통 레시피 관리로 자연스럽게 이동합니다.
  if (current === "reviews") redirect("/admin/prompts");
  if (!sections.has(current)) notFound();
  return <AdminConsole section={current} />;
}

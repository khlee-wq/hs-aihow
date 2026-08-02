import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminConsole } from "@/features/admin/admin-console";

export const metadata: Metadata = { title: "전문가 운영" };
const sections = new Set([
  "home",
  "reviews",
  "questions",
  "prompts",
  "videos",
  "schools",
  "users",
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
  if (!sections.has(current)) notFound();
  return <AdminConsole section={current} />;
}

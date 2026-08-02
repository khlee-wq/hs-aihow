import type { Metadata } from "next";
import { AdminConsole } from "@/features/admin/admin-console";

export const metadata: Metadata = { title: "전문가 운영" };
export default async function AdminPage({ params }: { params: Promise<{ section?: string[] }> }) { const { section } = await params; return <AdminConsole section={section?.[0] ?? "home"} />; }

import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsPanel } from "@/features/settings/settings-panel";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "설정" };
export default async function SettingsPage() { const session = await requireSession(); return <AppShell session={session} role={session.role}><SettingsPanel session={session} /></AppShell>; }

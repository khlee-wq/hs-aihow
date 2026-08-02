import { AppShell } from "@/components/layout/app-shell";
import { requireSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) { const session = await requireSession("expert"); return <AppShell session={session} role="expert">{children}</AppShell>; }

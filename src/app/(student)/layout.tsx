import { AppShell } from "@/components/layout/app-shell";
import { requireSession } from "@/lib/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  return (
    <AppShell session={session} role="user">
      {children}
    </AppShell>
  );
}

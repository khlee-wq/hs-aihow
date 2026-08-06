import type { Metadata } from "next";
import { StudentDashboard } from "@/features/student/student-dashboard";
import { requireSession } from "@/lib/session";
import { getStudentDashboardSnapshot } from "@/server/repositories/student-dashboard";

export const metadata: Metadata = { title: "준비 현황" };
export default async function DashboardPage() {
  const [session, snapshot] = await Promise.all([
    requireSession(),
    getStudentDashboardSnapshot(),
  ]);

  return <StudentDashboard name={session.name} snapshot={snapshot} />;
}

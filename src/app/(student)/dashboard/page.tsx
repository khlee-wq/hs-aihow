import type { Metadata } from "next";
import { StudentDashboard } from "@/features/student/student-dashboard";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "오늘의 준비" };
export default async function DashboardPage() { const session = await requireSession("student"); return <StudentDashboard name={session.name} />; }

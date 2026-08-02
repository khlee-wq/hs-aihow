import type { Metadata } from "next";
import { StudentWorkspace } from "@/features/student/student-workspace";

export const metadata: Metadata = { title: "면접 준비" };
export default async function ApplicationStepPage({ params }: { params: Promise<{ applicationId: string; step: string }> }) { const { step } = await params; return <StudentWorkspace step={step} />; }

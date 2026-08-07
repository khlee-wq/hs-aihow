import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPracticeSession } from "@/features/student/question-practice-session";
import { MockInterviewSession } from "@/features/student/student-workspace";

export const metadata: Metadata = { title: "면접 준비" };

export default async function ApplicationSessionPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;

  if (step === "practice") {
    return <QuestionPracticeSession applicationId="demo" />;
  }
  if (step === "mock-interview") {
    return <MockInterviewSession />;
  }

  notFound();
}

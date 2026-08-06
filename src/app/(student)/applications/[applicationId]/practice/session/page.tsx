import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPracticeSession } from "@/features/student/question-practice-session";

export const metadata: Metadata = { title: "질문 연습" };

export default async function QuestionPracticeSessionPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  if (applicationId !== "demo") notFound();

  return <QuestionPracticeSession applicationId={applicationId} />;
}

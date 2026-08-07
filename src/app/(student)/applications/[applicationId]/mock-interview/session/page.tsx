import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MockInterviewSession } from "@/features/student/student-workspace";

export const metadata: Metadata = { title: "모의면접" };

export default async function MockInterviewSessionPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  if (applicationId !== "demo") notFound();

  return <MockInterviewSession />;
}

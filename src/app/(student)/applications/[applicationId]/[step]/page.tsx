import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { StudentWorkspace } from "@/features/student/student-workspace";
import { journeySteps } from "@/lib/mock-data";
import type { JourneyStep } from "@/stores/app-store";

export const metadata: Metadata = { title: "면접 준비" };
export default async function ApplicationStepPage({
  params,
}: {
  params: Promise<{ applicationId: string; step: string }>;
}) {
  const { applicationId, step } = await params;
  if (applicationId !== "demo") notFound();
  if (step === "analysis") redirect("/applications/demo/practice");
  if (!journeySteps.some((item) => item.id === step)) notFound();
  return <StudentWorkspace step={step as JourneyStep} />;
}

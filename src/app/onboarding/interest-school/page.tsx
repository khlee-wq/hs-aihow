import { InterestSchoolOnboarding } from "@/features/student/interest-school-onboarding";
import { requireSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function InterestSchoolOnboardingPage() {
  const session = await requireSession();
  if (session.role !== "user") redirect("/admin");

  return <InterestSchoolOnboarding />;
}

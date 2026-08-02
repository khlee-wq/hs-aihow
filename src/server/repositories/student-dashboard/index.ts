import "server-only";

import {
  dashboardSnapshot,
  type DashboardSnapshot,
} from "@/features/student/dashboard-model";

export async function getStudentDashboardSnapshot(): Promise<DashboardSnapshot> {
  return dashboardSnapshot;
}

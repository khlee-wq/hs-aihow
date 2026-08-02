import "server-only";

import {
  dashboardSnapshot,
  dashboardSnapshotSchema,
  type DashboardSnapshot,
} from "@/features/student/dashboard-model";

export async function getStudentDashboardSnapshot(): Promise<DashboardSnapshot | null> {
  const record: unknown = dashboardSnapshot;
  if (record === null) return null;
  return dashboardSnapshotSchema.parse(record);
}

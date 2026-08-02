export const SESSION_COOKIE = "aihow_demo_session";

export type UserRole = "student" | "expert";

export type DemoSession = {
  name: string;
  email: string;
  role: UserRole;
};

export function encodeSession(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value?: string): DemoSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<DemoSession>;
    if (!parsed.email || !parsed.name || (parsed.role !== "student" && parsed.role !== "expert")) return null;
    return parsed as DemoSession;
  } catch {
    return null;
  }
}

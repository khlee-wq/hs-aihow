import type { UserRole } from "@/lib/session-shared";

export const ONBOARDING_VERSION = "2026-08-start-guide-v1";

export type OnboardingPreference = {
  onboardingVersion: string;
  completedAt: string | null;
  dismissedUntil: string | null;
  neverShowAgain: boolean;
};

const keyFor = (role: UserRole) => `aihow:onboarding-preference:v1:${role}`;

const emptyPreference = (): OnboardingPreference => ({
  onboardingVersion: ONBOARDING_VERSION,
  completedAt: null,
  dismissedUntil: null,
  neverShowAgain: false,
});

export function loadOnboardingPreference(role: UserRole): OnboardingPreference {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(keyFor(role)) ?? "null") as Partial<OnboardingPreference> | null;
    if (!parsed || typeof parsed !== "object") return emptyPreference();
    return { ...emptyPreference(), ...parsed };
  } catch {
    return emptyPreference();
  }
}

export function saveOnboardingPreference(
  role: UserRole,
  patch: Partial<OnboardingPreference>,
) {
  const next = { ...loadOnboardingPreference(role), ...patch };
  window.localStorage.setItem(keyFor(role), JSON.stringify(next));
  return next;
}

export function shouldShowOnboarding(preference: OnboardingPreference) {
  if (preference.onboardingVersion !== ONBOARDING_VERSION) return true;
  if (preference.neverShowAgain) return false;
  if (preference.dismissedUntil && new Date(preference.dismissedUntil) > new Date()) return false;
  return preference.completedAt === null;
}

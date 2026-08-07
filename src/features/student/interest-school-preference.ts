"use client";

import {
  interestSchools,
  type InterestSchool,
} from "./interest-school-directory";

const STORAGE_KEY = "aihow:interest-school:v1";

export function loadInterestSchoolPreference(): InterestSchool | null {
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    return interestSchools.find((school) => school.id === id) ?? null;
  } catch {
    return null;
  }
}

export function saveInterestSchoolPreference(school: InterestSchool) {
  window.localStorage.setItem(STORAGE_KEY, school.id);
}

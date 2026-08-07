import { describe, expect, it } from "vitest";
import { deriveProgress } from "./mock-data";

describe("deriveProgress", () => {
  it("중복 단계를 한 번만 계산한다", () => expect(deriveProgress(["essay", "essay", "practice"])).toBe(50));
  it("전체 완료를 100으로 계산한다", () => expect(deriveProgress(["essay", "practice", "mock-interview", "cheat-sheet"])).toBe(100));
});

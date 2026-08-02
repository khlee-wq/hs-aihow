import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./utils";

describe("safeInternalPath", () => {
  it("내부 경로만 허용한다", () => expect(safeInternalPath("/dashboard?tab=1", "/")).toBe("/dashboard?tab=1"));
  it.each(["https://bad.example", "//bad.example", "javascript:alert(1)"])("외부 이동 %s를 차단한다", (value) => expect(safeInternalPath(value, "/dashboard")).toBe("/dashboard"));
});

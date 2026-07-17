import { describe, expect, it } from "vitest";
import { validateUploadedFile } from "@/lib/platform/security/file-validation";

describe("platform/security/file-validation", () => {
  it("accepts a normal-sized document", () => {
    expect(validateUploadedFile({ name: "engagement-letter.pdf", size: 2 * 1024 * 1024 })).toEqual({ valid: true });
  });

  it("rejects an empty file", () => {
    const result = validateUploadedFile({ name: "empty.pdf", size: 0 });
    expect(result.valid).toBe(false);
  });

  it("rejects a file over the size limit", () => {
    const result = validateUploadedFile({ name: "huge.zip", size: 51 * 1024 * 1024 });
    expect(result.valid).toBe(false);
  });

  it("rejects a blocked executable extension", () => {
    const result = validateUploadedFile({ name: "installer.exe", size: 1024 });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain("exe");
  });
});

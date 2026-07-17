import { describe, expect, it } from "vitest";
import { formatBytes, formatCurrency, formatMinutes, initials } from "@/lib/format";

describe("lib/format", () => {
  it("formats currency in INR with no decimals", () => {
    expect(formatCurrency(150000)).toBe("₹1,50,000");
  });

  it("formats bytes into human-readable units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats minutes into hours/minutes", () => {
    expect(formatMinutes(45)).toBe("45m");
    expect(formatMinutes(60)).toBe("1h");
    expect(formatMinutes(90)).toBe("1h 30m");
  });

  it("derives initials from a full name", () => {
    expect(initials("Arjun Mehta")).toBe("AM");
    expect(initials("Cher")).toBe("C");
  });
});

import { describe, expect, it } from "vitest";
import { supportsSpecialCharacterPath } from "../../src/shared/services/vault-rules";

describe("special and long path handling", () => {
  it("accepts path with special characters", () => {
    expect(supportsSpecialCharacterPath("D:/crm-vaults/ACME [Pilot] #2026")).toBe(true);
  });

  it("accepts long path", () => {
    const longPath = "D:/" + "nested/".repeat(25) + "crm-vault";
    expect(supportsSpecialCharacterPath(longPath)).toBe(true);
  });
});

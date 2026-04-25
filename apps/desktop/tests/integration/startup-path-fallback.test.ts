import { describe, expect, it } from "vitest";
import { resolveStartupMode } from "../../src/app/bootstrap/startup";

describe("startup fallback", () => {
  it("falls back to selection when path unavailable", () => {
    const result = resolveStartupMode(
      { settingsVersion: 1, updatedAt: new Date().toISOString(), lastOpenedVaultPath: "D:/crm" },
      false
    );
    expect(result.mode).toBe("selection");
  });
});

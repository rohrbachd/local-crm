import { describe, expect, it } from "vitest";
import { resolveStartupMode } from "../../src/app/bootstrap/startup";

describe("startup auto-open", () => {
  it("auto-opens when path exists and is accessible", () => {
    const result = resolveStartupMode(
      { settingsVersion: 1, updatedAt: new Date().toISOString(), lastOpenedVaultPath: "D:/crm" },
      true
    );
    expect(result.mode).toBe("auto-open");
  });
});

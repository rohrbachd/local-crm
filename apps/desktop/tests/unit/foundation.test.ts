import { describe, expect, it } from "vitest";
import { LOG_RETENTION_DAYS, VAULT_REQUIRED_DIRECTORIES } from "../../src/shared/constants/vault";
import { validateAppSettings, validateStructuredLogEvent, validateVaultConfig } from "../../src/shared/domain/validators";

describe("foundation constants and validators", () => {
  it("contains required vault directories", () => {
    expect(VAULT_REQUIRED_DIRECTORIES).toContain("config");
    expect(LOG_RETENTION_DAYS).toBeGreaterThanOrEqual(7);
  });

  it("validates vault config artifact", () => {
    const value = {
      schemaVersion: 1,
      vaultId: "vault_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    expect(validateVaultConfig(value)).toBe(true);
  });

  it("validates app settings", () => {
    const value = { settingsVersion: 1, updatedAt: new Date().toISOString() };
    expect(validateAppSettings(value)).toBe(true);
  });

  it("validates structured log schema", () => {
    const event = {
      level: "error",
      code: "SETTINGS_RESET",
      timestamp: new Date().toISOString(),
      message: "message"
    };
    expect(validateStructuredLogEvent(event)).toBe(true);
  });
});

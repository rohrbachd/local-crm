import type { AppSessionSettings, StructuredLogEvent, VaultConfigurationArtifact } from "./vault-model";

export function isIsoTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function validateVaultConfig(input: unknown): input is VaultConfigurationArtifact {
  if (!input || typeof input !== "object") return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.schemaVersion === "number" &&
    typeof value.vaultId === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isIsoTimestamp(value.createdAt) &&
    isIsoTimestamp(value.updatedAt)
  );
}

export function validateAppSettings(input: unknown): input is AppSessionSettings {
  if (!input || typeof input !== "object") return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.settingsVersion === "number" &&
    typeof value.updatedAt === "string" &&
    isIsoTimestamp(value.updatedAt) &&
    (value.lastOpenedVaultPath === undefined || typeof value.lastOpenedVaultPath === "string")
  );
}

export function validateStructuredLogEvent(input: unknown): input is StructuredLogEvent {
  if (!input || typeof input !== "object") return false;
  const value = input as Record<string, unknown>;
  return (
    (value.level === "info" || value.level === "warn" || value.level === "error") &&
    typeof value.code === "string" &&
    typeof value.timestamp === "string" &&
    isIsoTimestamp(value.timestamp) &&
    typeof value.message === "string"
  );
}

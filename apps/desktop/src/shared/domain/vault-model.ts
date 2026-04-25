export type VaultStatus = "uninitialized" | "initializing" | "ready" | "invalid";

export type CrmVault = {
  vaultPath: string;
  status: VaultStatus;
  isCompatible: boolean;
  createdAt?: string;
  lastValidatedAt: string;
  validationIssues?: string[];
};

export type VaultConfigurationArtifact = {
  schemaVersion: number;
  vaultId: string;
  vaultName?: string;
  createdAt: string;
  updatedAt: string;
};

export type AppSessionSettings = {
  settingsVersion: number;
  lastOpenedVaultPath?: string;
  updatedAt: string;
  integrityState?: "valid" | "reset";
};

export type DashboardSnapshot = {
  activeVaultPath: string;
  companyCount: number;
  contactCount: number;
  taskIntegrationStatus: "not_configured" | "configured" | "unavailable";
  capturedAt: string;
};

export type StructuredLogEvent = {
  level: "info" | "warn" | "error";
  code: string;
  timestamp: string;
  message: string;
};

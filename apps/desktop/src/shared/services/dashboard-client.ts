import type { DashboardSnapshot } from "../domain/vault-model";

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  return {
    activeVaultPath: "",
    companyCount: 0,
    contactCount: 0,
    taskIntegrationStatus: "not_configured",
    capturedAt: new Date().toISOString()
  };
}

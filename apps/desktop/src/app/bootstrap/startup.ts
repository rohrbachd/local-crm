import type { AppSessionSettings } from "../../shared/domain/vault-model";

export type StartupResult =
  | { mode: "auto-open"; vaultPath: string }
  | { mode: "selection"; reason: string };

export function resolveStartupMode(settings: AppSessionSettings, vaultAccessible: boolean): StartupResult {
  if (settings.lastOpenedVaultPath && vaultAccessible) {
    return { mode: "auto-open", vaultPath: settings.lastOpenedVaultPath };
  }
  return { mode: "selection", reason: "Vault unavailable or settings reset" };
}

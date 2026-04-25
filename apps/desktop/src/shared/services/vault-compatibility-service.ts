import * as path from "node:path";
import { VAULT_CONFIG_FILE, VAULT_REQUIRED_DIRECTORIES } from "../constants/vault";
import type { FilesystemAdapter } from "./filesystem-adapter";
import { validateVaultConfig } from "../domain/validators";

export async function validateVaultCompatibility(fs: FilesystemAdapter, vaultPath: string): Promise<{ isCompatible: boolean; issues: string[] }> {
  const issues: string[] = [];

  for (const dir of VAULT_REQUIRED_DIRECTORIES) {
    const full = path.join(vaultPath, dir);
    if (!(await fs.fileExists(full))) {
      issues.push(`Missing required directory: ${dir}`);
    }
  }

  const configPath = path.join(vaultPath, VAULT_CONFIG_FILE);
  if (!(await fs.fileExists(configPath))) {
    issues.push("Missing vault config artifact");
  } else {
    try {
      const raw = await fs.readFile(configPath);
      const parsed = JSON.parse(raw);
      if (!validateVaultConfig(parsed)) {
        issues.push("Invalid vault config artifact schema");
      }
    } catch {
      issues.push("Vault config artifact is unreadable");
    }
  }

  return { isCompatible: issues.length === 0, issues };
}

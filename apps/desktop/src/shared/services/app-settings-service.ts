import * as path from "node:path";
import { APP_SETTINGS_FILE } from "../constants/vault";
import type { AppSessionSettings } from "../domain/vault-model";
import { validateAppSettings } from "../domain/validators";
import type { FilesystemAdapter } from "./filesystem-adapter";
import { logEvent } from "./local-log-service";

function defaults(): AppSessionSettings {
  return {
    settingsVersion: 1,
    updatedAt: new Date().toISOString(),
    integrityState: "reset"
  };
}

export async function loadAppSettings(fs: FilesystemAdapter, appDataPath: string): Promise<AppSessionSettings> {
  const settingsPath = path.join(appDataPath, APP_SETTINGS_FILE);
  const exists = await fs.fileExists(settingsPath);

  if (!exists) {
    const value = defaults();
    await fs.writeFile(settingsPath, JSON.stringify(value, null, 2));
    return value;
  }

  try {
    const raw = await fs.readFile(settingsPath);
    const parsed = JSON.parse(raw);
    if (!validateAppSettings(parsed)) throw new Error("schema");
    return { ...parsed, integrityState: "valid" };
  } catch {
    const value = defaults();
    await fs.writeFile(settingsPath, JSON.stringify(value, null, 2));
    await logEvent(fs, appDataPath, {
      level: "error",
      code: "SETTINGS_RESET",
      timestamp: new Date().toISOString(),
      message: "App settings were invalid and reset to defaults"
    });
    return value;
  }
}

export async function saveAppSettings(fs: FilesystemAdapter, appDataPath: string, input: Partial<AppSessionSettings>): Promise<AppSessionSettings> {
  const next: AppSessionSettings = {
    settingsVersion: 1,
    updatedAt: new Date().toISOString(),
    integrityState: "valid",
    ...input
  };
  const settingsPath = path.join(appDataPath, APP_SETTINGS_FILE);
  await fs.writeFile(settingsPath, JSON.stringify(next, null, 2));
  return next;
}

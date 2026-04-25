import type { AppSessionSettings } from "../domain/vault-model";

let state: AppSessionSettings = {
  settingsVersion: 1,
  updatedAt: new Date().toISOString(),
  integrityState: "valid"
};

export function getSessionState(): AppSessionSettings {
  return state;
}

export function setLastOpenedVaultPath(path: string): AppSessionSettings {
  state = {
    ...state,
    lastOpenedVaultPath: path,
    updatedAt: new Date().toISOString(),
    integrityState: "valid"
  };
  return state;
}

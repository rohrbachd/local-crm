export type InitializeVaultRequest = {
  vaultPath: string;
  confirmWrite: boolean;
  allowNonEmptyFolder?: boolean;
};

export type OpenVaultRequest = {
  vaultPath: string;
};

export type OpenPolicy = {
  blockOpen: boolean;
  canInitializeInstead: boolean;
};

export function buildInitializeRequest(vaultPath: string, confirmWrite: boolean, allowNonEmptyFolder = false): InitializeVaultRequest {
  return { vaultPath, confirmWrite, allowNonEmptyFolder };
}

export function buildOpenRequest(vaultPath: string): OpenVaultRequest {
  return { vaultPath };
}

export function classifyOpenResponse(statusCode: number): OpenPolicy {
  if (statusCode === 409) {
    return { blockOpen: true, canInitializeInstead: true };
  }
  return { blockOpen: false, canInitializeInstead: false };
}

export interface VaultCommandAdapter {
  initialize(input: InitializeVaultRequest): Promise<unknown>;
  open(input: OpenVaultRequest): Promise<unknown>;
}

export class VaultClient {
  constructor(private readonly adapter: VaultCommandAdapter) {}

  initializeVault(input: InitializeVaultRequest): Promise<unknown> {
    return this.adapter.initialize(input);
  }

  openVault(input: OpenVaultRequest): Promise<unknown> {
    return this.adapter.open(input);
  }
}

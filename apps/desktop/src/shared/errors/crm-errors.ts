export class CrmError extends Error {
  constructor(
    public readonly type: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "CrmError";
  }
}

export class VaultNotWritableError extends CrmError {
  constructor(path: string) {
    super("VaultNotWritable", `Vault path is not writable: ${path}`, { path });
  }
}

export class FileAccessDeniedError extends CrmError {
  constructor(path: string) {
    super("FileAccessDenied", `Access denied for path: ${path}`, { path });
  }
}

export class InvalidSettingsError extends CrmError {
  constructor(reason: string) {
    super("InvalidSettings", `App settings invalid: ${reason}`, { reason });
  }
}

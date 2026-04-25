export const VAULT_REQUIRED_DIRECTORIES = [
  "companies",
  "contacts",
  "leads",
  "interactions",
  "attachments",
  "config",
  "indexes"
] as const;

export const VAULT_CONFIG_FILE = "config/crm-config.json";
export const APP_SETTINGS_FILE = "app-settings.json";
export const APP_LOG_FILE = "local-crm.log";
export const LOG_RETENTION_DAYS = 7;

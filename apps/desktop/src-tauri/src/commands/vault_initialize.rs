use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize)]
pub struct InitializeVaultRequest {
    pub vault_path: String,
    pub confirm_write: bool,
    pub allow_non_empty_folder: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct VaultStatusResponse {
    pub vault_path: String,
    pub status: String,
    pub is_compatible: bool,
    pub last_validated_at: String,
    pub validation_issues: Vec<String>,
}

fn now_iso() -> String {
    chrono::Utc::now().to_rfc3339()
}

#[tauri::command]
pub async fn initialize_vault(request: InitializeVaultRequest) -> Result<VaultStatusResponse, String> {
    let base = Path::new(&request.vault_path);
    if !base.exists() {
        fs::create_dir_all(base).map_err(|e| format!("Failed to create base folder: {e}"))?;
    }

    let entries = fs::read_dir(base).map_err(|e| format!("Failed to read vault path: {e}"))?;
    let non_empty = entries.count() > 0;
    if non_empty && !request.confirm_write && request.allow_non_empty_folder.unwrap_or(false) {
        return Err("Explicit confirmation required for non-empty folder".to_string());
    }

    let required = [
        "companies",
        "contacts",
        "leads",
        "interactions",
        "attachments",
        "config",
        "indexes",
    ];

    for rel in required {
        let dir = base.join(rel);
        fs::create_dir_all(dir).map_err(|e| format!("Failed to create required directory: {e}"))?;
    }

    let config_path = base.join("config").join("crm-config.json");
    if !config_path.exists() {
        let cfg = serde_json::json!({
            "schemaVersion": 1,
            "vaultId": format!("vault_{}", uuid::Uuid::new_v4()),
            "createdAt": now_iso(),
            "updatedAt": now_iso()
        });
        fs::write(config_path, serde_json::to_string_pretty(&cfg).unwrap())
            .map_err(|e| format!("Failed to write vault config: {e}"))?;
    }

    Ok(VaultStatusResponse {
        vault_path: request.vault_path,
        status: "ready".to_string(),
        is_compatible: true,
        last_validated_at: now_iso(),
        validation_issues: vec![],
    })
}

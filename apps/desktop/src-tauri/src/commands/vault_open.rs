use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize)]
pub struct OpenVaultRequest {
    pub vault_path: String,
}

#[derive(Debug, Serialize)]
pub struct CompatibilityWarningResponse {
    pub code: String,
    pub message: String,
    pub can_initialize_instead: bool,
}

#[derive(Debug, Serialize)]
pub struct VaultOpenResponse {
    pub vault_path: String,
    pub status: String,
    pub is_compatible: bool,
    pub last_validated_at: String,
    pub validation_issues: Vec<String>,
}

fn now_iso() -> String {
    chrono::Utc::now().to_rfc3339()
}

fn required_dirs() -> [&'static str; 7] {
    [
        "companies",
        "contacts",
        "leads",
        "interactions",
        "attachments",
        "config",
        "indexes",
    ]
}

#[tauri::command]
pub async fn open_vault(request: OpenVaultRequest) -> Result<VaultOpenResponse, CompatibilityWarningResponse> {
    let base = Path::new(&request.vault_path);
    let mut issues: Vec<String> = Vec::new();

    if !base.exists() {
        issues.push("Vault path does not exist".to_string());
    } else {
        for rel in required_dirs() {
            let dir = base.join(rel);
            if !dir.exists() {
                issues.push(format!("Missing required directory: {rel}"));
            }
        }

        let config = base.join("config").join("crm-config.json");
        if !config.exists() {
            issues.push("Missing vault config artifact".to_string());
        } else {
            let raw = fs::read_to_string(config);
            if raw.is_err() {
                issues.push("Unreadable vault config artifact".to_string());
            } else if serde_json::from_str::<serde_json::Value>(&raw.unwrap()).is_err() {
                issues.push("Invalid vault config artifact".to_string());
            }
        }
    }

    if !issues.is_empty() {
        return Err(CompatibilityWarningResponse {
            code: "INCOMPATIBLE_FOLDER".to_string(),
            message: issues.join("; "),
            can_initialize_instead: true,
        });
    }

    Ok(VaultOpenResponse {
        vault_path: request.vault_path,
        status: "ready".to_string(),
        is_compatible: true,
        last_validated_at: now_iso(),
        validation_issues: vec![],
    })
}

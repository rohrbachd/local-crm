use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ActiveVaultResult {
    pub mode: String,
    pub vault_path: Option<String>,
    pub reason: Option<String>,
}

#[tauri::command]
pub async fn resolve_active_vault() -> Result<ActiveVaultResult, String> {
    Ok(ActiveVaultResult {
        mode: "selection".to_string(),
        vault_path: None,
        reason: Some("No persisted valid vault".to_string()),
    })
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppSettings {
    pub settings_version: u32,
    pub updated_at: String,
    pub integrity_state: String,
    pub last_opened_vault_path: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AppSettingsUpdate {
    pub last_opened_vault_path: Option<String>,
}

#[tauri::command]
pub async fn get_app_settings() -> Result<AppSettings, String> {
    Ok(AppSettings {
        settings_version: 1,
        updated_at: chrono::Utc::now().to_rfc3339(),
        integrity_state: "valid".to_string(),
        last_opened_vault_path: None,
    })
}

#[tauri::command]
pub async fn set_app_settings(payload: AppSettingsUpdate) -> Result<AppSettings, String> {
    Ok(AppSettings {
        settings_version: 1,
        updated_at: chrono::Utc::now().to_rfc3339(),
        integrity_state: "valid".to_string(),
        last_opened_vault_path: payload.last_opened_vault_path,
    })
}

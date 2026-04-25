use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct DashboardSnapshot {
    pub active_vault_path: String,
    pub company_count: u64,
    pub contact_count: u64,
    pub task_integration_status: String,
    pub captured_at: String,
}

#[tauri::command]
pub async fn get_dashboard_snapshot() -> Result<DashboardSnapshot, String> {
    Ok(DashboardSnapshot {
        active_vault_path: "".to_string(),
        company_count: 0,
        contact_count: 0,
        task_integration_status: "not_configured".to_string(),
        captured_at: chrono::Utc::now().to_rfc3339(),
    })
}

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::vault_initialize::initialize_vault,
            commands::vault_open::open_vault,
            commands::dashboard_snapshot::get_dashboard_snapshot,
            commands::app_settings::get_app_settings,
            commands::app_settings::set_app_settings,
            commands::vault_active::resolve_active_vault
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

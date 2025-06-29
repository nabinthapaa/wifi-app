mod commands;

use commands::{check_already_connected_network, get_available_networks_with_security_type};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_available_networks_with_security_type,
            check_already_connected_network,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

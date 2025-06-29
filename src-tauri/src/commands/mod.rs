use std::process::Command;

mod parser;

#[tauri::command]
pub fn get_available_networks_with_security_type() -> Result<Vec<parser::WifiNetwork>, String> {
    let networks = Command::new("nmcli")
        .args([
            "-f",
            "SSID,SSID-HEX,FREQ,SIGNAL,SECURITY",
            "device",
            "wifi",
            "list",
        ])
        .output();
    let mut wifi = Vec::new();
    match networks {
        Ok(results) => {
            let networks = results.stdout;
            let networks = String::from_utf8_lossy(&networks).into_owned();
            wifi = parser::parse_wifi_result(networks);
        }
        Err(_) => eprintln!("Something went wrong"),
    }
    Ok(wifi)
}

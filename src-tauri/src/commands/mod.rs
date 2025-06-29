use std::{collections::HashSet, process::Command};

use serde::Serialize;

mod parser;

#[derive(Debug, Serialize, Clone)]
pub struct Reponse {
    message: String,
    success: bool,
}

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

#[tauri::command]
pub fn check_already_connected_network(name: String) -> Result<Reponse, String> {
    let saved_networks = Command::new("nmcli")
        .args(["-f", "NAME", "connection"])
        .output();

    let mut networks_set = HashSet::new();
    match saved_networks {
        Ok(result) => {
            let networks = String::from_utf8_lossy(&result.stdout);
            for line in networks.lines() {
                let trimmed = line.trim();
                if trimmed.is_empty() || trimmed == "NAME" {
                    continue;
                }

                if let Some(first) = trimmed.split_whitespace().next() {
                    networks_set.insert(first.to_string());
                }
            }
        }
        Err(_) => eprintln!("Error getting saved networks"),
    }

    if networks_set.contains(&name) {
        let connection = Command::new("nmcli")
            .args(["connection", "up", name.as_str()])
            .output()
            .map_err(|e| format!("Failed to connect to '{}': {}", name, e))?;

        if connection.status.success() {
            let message = format!("Successfully connected to '{}'", name);
            Ok(Reponse {
                message,
                success: true,
            })
        } else {
            let err = String::from_utf8_lossy(&connection.stderr);
            Err(format!("nmcli connection error: {}", err))
        }
    } else {
        let message = format!("Network '{}' is not saved. Skipping connection.", name);
        Ok(Reponse {
            message,
            success: false,
        })
    }
}

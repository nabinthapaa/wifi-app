use std::{collections::HashSet, process::Command};

use serde::Serialize;

mod parser;

#[derive(Debug, Serialize, Clone)]
pub struct Response {
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
pub fn check_already_connected_network(name: String) -> Result<Response, String> {
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
        up_connection(name)
    } else {
        let message = format!("Network '{}' is not saved. Skipping connection.", name);
        Ok(Response {
            message,
            success: false,
        })
    }
}

fn up_connection(name: String) -> Result<Response, String> {
    let up_output = Command::new("nmcli")
        .args(["connection", "up", &name])
        .output()
        .unwrap();

    if up_output.status.success() {
        Ok(Response {
            message: format!("Successfully connected to {}", name),
            success: true,
        })
    } else {
        Ok(Response {
            message: format!("Invalid password or failed to connect to {}", name),
            success: false,
        })
    }
}

#[tauri::command]
pub fn connect_with_password(
    name: String,
    password: String,
    security: String,
) -> Result<Response, String> {
    let up = Command::new("nmcli")
        .args(["device", "wifi", "connect", &name, "password", &password])
        .output();
    let error = "802-11-wireless-security.key-mgmt";

    match up {
        Ok(output) => {
            if output.status.success() {
                Ok(Response {
                    message: "Connected Successfully".to_string(),
                    success: true,
                })
            } else {
                let error_message = String::from_utf8_lossy(&output.stderr);
                if format!("{}", error_message).contains(error) {
                    let mgmt_key = parser::map_security_to_key_mgmt(&security);
                    let result = Command::new("nmcli")
                        .args([
                            "connection",
                            "add",
                            "type",
                            "wifi",
                            "ifname",
                            "*",
                            "con-name",
                            &name,
                            "ssid",
                            &name,
                            "wifi-sec.key-mgmt",
                            mgmt_key,
                            "wifi-sec.psk",
                            &password,
                        ])
                        .output()
                        .unwrap();

                    if !result.status.success() {
                        return Ok(Response {
                            message: format!("Failed to create connection for {}", name),
                            success: false,
                        });
                    }
                    return up_connection(name);
                }
                Err(format!("Failed to connect: {}", error_message))
            }
        }

        Err(e) => Ok(Response {
            message: format!("Failed to execute nmcli: {}", e),
            success: false,
        }),
    }
}

#[tauri::command]
pub fn remove_wifi_network(ssid: String) -> Result<Response, String> {
    let remove_status = Command::new("nmcli")
        .args(["connection", "delete", "id", &ssid])
        .output()
        .unwrap();

    if remove_status.status.success() {
        return Ok(Response {
            message: "Wifi removed Successfully".to_string(),
            success: true,
        });
    }

    Ok(Response {
        message: "Couldn't remove wifi".to_string(),
        success: false,
    })
}

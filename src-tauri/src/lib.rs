use std::{env, process::Command};

use serde::Serialize;
use ts_rs::TS;

#[allow(non_camel_case_types)]
#[allow(non_snake_case)]
#[allow(non_upper_case_globals)]
#[allow(dead_code)]
#[allow(improper_ctypes)]
mod bindings {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

#[derive(Debug, Serialize, Clone, TS)]
#[ts(export, export_to = "../../src/nmcli.d.ts")]
struct WifiNetwork {
    id: String,
    ssid: String,
    security: String,
    frequency: f32,
    signal: i16,
}

fn parse_wifi_result(results: String) -> Vec<WifiNetwork> {
    let mut networks = Vec::new();
    let mut i = 0;
    for line in results.lines() {
        if i == 0 {
            i = 1;
            continue;
        }

        let trimmed = line.trim();

        if trimmed.is_empty() || trimmed.contains("--") {
            continue;
        }

        let parts: Vec<&str> = trimmed.split_whitespace().collect();
        if parts.len() < 2 {
            continue;
        };

        let ssid = parts[0].to_string();
        let id = parts[1].to_string();
        let mut frequency: f32 = 0.0;
        match parts[2].parse() {
            Ok(value) => frequency = value,
            Err(error) => eprintln!("{:?}", error),
        }
        let signal = parts[4].parse().unwrap();
        let security = parts[5..]
            .iter()
            .map(|&s| s.to_string())
            .collect::<Vec<String>>()
            .join("/");

        networks.push(WifiNetwork {
            ssid,
            security,
            id,
            frequency: format!("{:.2}", frequency / 1000.0).parse().unwrap(),
            signal,
        });
    }
    networks[1..].to_vec()
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_available_networks_with_security_type() -> Result<Vec<WifiNetwork>, String> {
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
            wifi = parse_wifi_result(networks);
        }
        Err(_) => eprintln!("Something went wrong"),
    }
    Ok(wifi)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![
            get_available_networks_with_security_type
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

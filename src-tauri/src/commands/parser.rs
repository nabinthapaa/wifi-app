use serde::Serialize;
use ts_rs::TS;

#[derive(Debug, Serialize, Clone, TS)]
#[ts(export, export_to = "../../src/nmcli.d.ts")]
pub struct WifiNetwork {
    id: String,
    ssid: String,
    security: String,
    frequency: f32,
    signal: i16,
}

pub fn parse_wifi_result(results: String) -> Vec<WifiNetwork> {
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

        let signal = parts[4]
            .parse()
            .unwrap_or_else(|_| panic!("Error Parsing signal {:?}", parts[4]));

        let security = parts[5..]
            .iter()
            .map(|&s| s.to_string())
            .collect::<Vec<String>>()
            .join("/");

        networks.push(WifiNetwork {
            ssid,
            security,
            id,
            frequency: format!("{:.2}", frequency / 1000.0)
                .parse()
                .unwrap_or_else(|_| panic!("Error parsing frquency: {:?}", frequency)),
            signal,
        });
    }

    networks[1..].to_vec()
}

pub fn map_security_to_key_mgmt(security: &str) -> &'static str {
    let sec = security.to_lowercase();

    if sec.contains("wpa3") {
        "sae"
    } else if sec.contains("wpa2") && sec.contains("802.1x") {
        "wpa-eap"
    } else if sec.contains("wpa") || sec.contains("wpa2") {
        "wpa-psk"
    } else if sec.trim().is_empty() || sec == "--" || sec == "none" {
        "none"
    } else {
        "wpa-psk"
    }
}

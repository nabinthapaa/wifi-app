// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    std::env::set_var("GDK_BACKEND", "x11");
    std::env::set_var("__NV_DISABLE_EXPLICIT_SYNC", "1");
    std::env::set_var("NM_SECRET_AGENT", "no");
    wifi_lib::run();
}

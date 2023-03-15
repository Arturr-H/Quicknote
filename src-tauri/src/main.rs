/* Prevents additional console window on Windows in release, DO NOT REMOVE!! */
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/* Modules */
mod titlebar;

/* Imports */
use tauri::Manager;
use titlebar::WindowExt;

/* Main */
fn main() {
    tauri::Builder::default()

        /* Port functions to JavaScript */
        // .invoke_handler(tauri::generate_handler![command_name])

        /* Hide titlebar */
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.open_devtools();
            window.set_transparent_titlebar(true, false);
            Ok(())
        })

        /* Run */
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

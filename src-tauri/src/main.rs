/* Prevents additional console window on Windows in release, DO NOT REMOVE!! */
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(dead_code, unused_imports, unused_variables)]

/* Modules */
mod titlebar;
mod project;

/* Imports */
use std::{ path::{ Path, PathBuf }, io::Read };
use tauri::{ Manager, State };
use titlebar::WindowExt;
use project::{ EditorContent, Project };
use bincode;
use dirs;
use serde_json;
use uuid;

/* Constants */
const DATA_FOLDER: &'static str = ".quicknote-data";

/* Structs */
struct Global {
    home_dir: PathBuf
}

/* Save project (will replace if exists) */
#[tauri::command]
async fn save_project(data: String, global: State<'_, Global>) -> Result<(), String> {
    /* Decode data */
    let data: Project = match serde_json::from_str(&data) {
        Ok(e) => e,
        Err(_) => return Err("Couldn't parse from string".into())
    };

    /* Save */
    std::fs::write(
        global.home_dir.join(data.id()),
        bincode::serialize(&data).unwrap_or(Vec::new())
    ).ok();

    Ok(())
}

/* Get all projects (listing) */
#[tauri::command]
async fn get_projects(global: State<'_, Global>) -> Result<Vec<Project>, ()> {
    let mut res: Vec<Project> = Vec::new();

    for project in std::fs::read_dir(&global.home_dir).unwrap() {
        let s = match match &project {
            Ok(e) => e,
            Err(_) => continue
        }.file_name().to_str() {
            Some(e) => e,
            None => continue
        }.to_string();

        res.push(
            match Project::from_id(
                &global.home_dir,
                &s
            ) {
                Some(e) => e,
                None => continue,
            }
        )
    }

    Ok(res)
}

/* Get project */
#[tauri::command]
async fn get_project(id: String, global: State<'_, Global>) -> Result<Project, ()> {
    let path = global.home_dir.join(id);
    println!("Getting project {path:?}");

    /* Open file */
    let buf = match std::fs::read(path) {
        Ok(e) => e,
        Err(_) => return Err(())
    };

    /* Deserialize */
    let content = match bincode::deserialize::<Project>(&buf) {
        Ok(e) => e,
        Err(_) => return Err(())
    };

    Ok(content)
}

/* Create project with default config */
#[tauri::command]
async fn create_project(global: State<'_, Global>) -> Result<String, ()> {
    let id = uuid::Uuid::new_v4().as_hyphenated().to_string();

    /* Save */
    std::fs::write(
        global.home_dir.join(&id),
        bincode::serialize(&Project::blank(id.to_string())).unwrap_or(Vec::new())
    ).ok();

    Ok(id)
}
#[tauri::command]
async fn delete_project(id: String, global: State<'_, Global>) -> Result<(), ()> {

    /* Save */
    std::fs::remove_file(
        global.home_dir.join(&id)
    ).ok();

    Ok(())
}

/* Main */
fn main() {
    let home_dir = dirs::home_dir().unwrap().join(DATA_FOLDER);

    /* Create content directory if not exist */
    if !Path::new(&home_dir).exists() {
        std::fs::create_dir(&home_dir).unwrap();
    };

    tauri::Builder::default()

        /* Port functions to JavaScript */
        .invoke_handler(tauri::generate_handler![
            create_project, save_project, get_projects, get_project, delete_project
        ])

        /* Hide titlebar */
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.open_devtools();
            window.set_transparent_titlebar(true, false);
            Ok(())
        })

        /* Make home dir a global variable */
        .manage(Global { home_dir })

        /* Run */
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

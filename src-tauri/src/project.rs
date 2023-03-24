/* Imports */
use std::{
    fs::File, io::Read, path::PathBuf,
    time::{ SystemTime, UNIX_EPOCH, Duration }
};
use bincode;
use serde::{ self, Deserialize, Serialize };

/// This is just a link to a project
#[derive(Serialize, Deserialize, Debug)]
pub struct Project {
    /// Will be used for the path
    id: String,

    /// Title of project
    title: String,

    /// Date of creation (unix in ms)
    date: usize,

    /// Editor content
    content: Vec<EditorContent>
}

/* Method implementations */
impl Project {
    /* Convert project from id */
    pub fn from_id(home_dir: &PathBuf, id: &String) -> Option<Self> {

        /* Load file */
        let buf = match std::fs::read(home_dir.join(id)) {
            Ok(e) => e,
            Err(_) => return None
        };

        /* Encode file */
        let content = bincode::deserialize::<Project>(&buf).ok()?;

        Some(content)
    }

    /* Create blank project */
    pub fn blank(id: String) -> Self {
        Self { id, title: String::from(""), date: unix_time_ms(), content: vec![] }
    }

    /* Getters */
    pub fn id(&self) -> &String { &self.id }
    pub fn title(&self) -> &String { &self.title }
    pub fn date(&self) -> &usize { &self.date }
    pub fn content(&self) -> &Vec<EditorContent> { &self.content }
}

/* Project data */
#[derive(Serialize, Deserialize, Debug)]
pub struct EditorContent {
    content: String,
    id: String,

    #[serde(rename = "type")]
    type_: String
}
impl EditorContent {
    /* Constructor */
    pub fn new(content: String, id: String, type_: String) -> Self {
        Self { content, id, type_ }
    }
    
}

fn unix_time_ms() -> usize {
    let now = SystemTime::now();
    let since_epoch = now.duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    since_epoch.as_millis() as usize
}

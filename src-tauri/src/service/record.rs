use std::fs;
use std::io::ErrorKind;
use std::thread;
use std::time::Duration;

use serde_json::json;
use homedir::get_my_home;

use bson::doc;
use uuid::Uuid;

use super::model::{RecordPayload, SmRecordPayload, NewRecordPayload};
use super::utils::{read_bson_files, remove_bson_file_by_uuid, read_bson_file, write_bson_to_file};

#[tauri::command]
pub fn init_directory() -> String {
    thread::sleep(Duration::from_secs(3));

    let mut home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    home_dir.push("Diary");

    match fs::create_dir(home_dir) {
        Err(ref e) if e.kind() == ErrorKind::AlreadyExists => {
            format!("success")
        }
        Err(_) => {
            format!("failed")
        }
        Ok(_) => {
            format!("success")
        }
    }
}

#[tauri::command]
pub fn get_all_records() -> String {
    let result = read_bson_files();
    let mut records = Vec::with_capacity(result.as_ref().unwrap().len());

    let binding = result.unwrap();
    binding.iter().for_each(
        |value| {
            records.push(
                SmRecordPayload{
                    id: value.get_str("id").unwrap(), 
                    name: value.get_str("name").unwrap(),
                    date: value.get_str("date").unwrap()
                }
            )
        }
    );
    let serialize_response = json!(records).to_string();

    serialize_response
}

#[tauri::command]
pub fn get_record(uuid: &str) -> String {
    let document = read_bson_file(uuid);

    match document {
        Ok(doc) => {
            if doc.is_empty() {
                "file_not_found".to_owned()
            } else {
                json!(doc).to_string()
            }
        },
        Err(_) => "error".to_owned(),
    }
}

#[tauri::command]
pub fn put_record(payload: RecordPayload) -> String {
    let document;

    let home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    let _work_dir = home_dir.join("Diary");

    if payload.text == "--undefiend--" {
        document = doc!{
            "name": payload.name,
            "text": "",
            "date": payload.date
        };
    } else {
        document = doc!{
            "name": payload.name,
            "text": payload.text,
            "date": payload.date
        };
    };

    write_bson_to_file(
        format!("{}/{}.bson", _work_dir.to_str().unwrap(), payload.id).as_str(),
        &payload.id, document
    ).unwrap();

    "success".to_owned()
}

#[tauri::command]
pub fn delete_record(uuid: &str) -> String {
    println!("{}", uuid);
    let home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    let _work_dir = home_dir.join("Diary");

    remove_bson_file_by_uuid(uuid).unwrap();

    "success".to_owned()
}

#[tauri::command]
pub fn add_record(payload: NewRecordPayload) -> String {
    let home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    let _work_dir = home_dir.join("Diary");

    let id = Uuid::new_v4().to_string();

    let document = doc!{
        "name": payload.name,
        "text": payload.text,
        "date": payload.date
    };

    write_bson_to_file(
        format!("{}/{}.bson", _work_dir.to_str().unwrap(), id).as_str(), 
        &id, document
        
    ).unwrap();

    id
}

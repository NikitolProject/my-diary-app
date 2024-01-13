use std::fs;
use std::io::Read;
use std::error::Error;

use bson::{Bson, Document, doc};
use homedir::get_my_home;

pub fn read_bson_files() -> Result<Vec<Document>, Box<dyn Error>> {
    let mut documents = Vec::new();
    let home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    let entries = home_dir.join("Diary").read_dir()?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.extension() == Some(&std::ffi::OsStr::new("bson")) {
            let mut file = fs::File::open(path)?;
            let mut buf = Vec::new();
            file.read_to_end(&mut buf)?;
            let document = Document::from_reader(&mut &buf[..])?;
            documents.push(document);
        }
    }

    Ok(documents)
}

pub fn read_bson_file(uuid: &str) -> Result<Document, Box<dyn Error>> {
    let mut document = doc! {};
    let home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    let entries = home_dir.join("Diary").read_dir()?;

    for entry in entries {
        let entry = entry?;
        let mut path = entry.path();
        if path.is_file() && path.extension() == Some(&std::ffi::OsStr::new("bson")) 
            && path.as_mut_os_str().to_str().unwrap() == &format!("{}/Diary/{}.bson", home_dir.as_os_str().to_str().unwrap(), uuid) {
            let mut file = fs::File::open(path)?;
            let mut buf = Vec::new();
            file.read_to_end(&mut buf)?;
            document = Document::from_reader(&mut &buf[..])?;
        }
    }
 
    Ok(document)
}

pub fn remove_bson_file_by_uuid(uuid: &str) -> Result<bool, Box<dyn Error>> {
    let home_dir = get_my_home().expect("Failed to get the home directory").unwrap();
    let entries = home_dir.join("Diary").read_dir()?;

    for entry in entries {
        let entry = entry?;
        let mut path = entry.path();

        if path.is_file() 
            && path.extension() == Some(&std::ffi::OsStr::new("bson")) 
            && path.as_mut_os_string().to_str().unwrap().to_owned() == format!(
                "{}/Diary/{}.bson", home_dir.as_os_str().to_str().unwrap(), uuid) {
            fs::remove_file(path).unwrap();
            return Ok(true);
        }
    }

    Ok(false)
}

pub fn write_bson_to_file(path: &str, id: &str, mut doc: Document) -> std::io::Result<()> {
    let mut buf = Vec::new();
    doc.insert("id", id.to_owned());
    let bson = bson::to_bson(&doc).unwrap();
    if let Bson::Document(document) = bson {
        document.to_writer(&mut buf).unwrap();
    }
    let _ = fs::write(path, buf);
    Ok(())
}


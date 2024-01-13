use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct RecordPayload<'a> {
    pub id: &'a str,
    pub name: &'a str,
    pub text: &'a str,
    pub date: &'a str
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SmRecordPayload<'a> {
    pub id: &'a str,
    pub name: &'a str,
    pub date: &'a str
}

#[derive(Clone, Serialize, Deserialize)]
pub struct NewRecordPayload<'a> {
    pub name: &'a str,
    pub text: &'a str,
    pub date: &'a str
}
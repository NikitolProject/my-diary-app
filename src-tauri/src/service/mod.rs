pub mod model;
pub mod record;
pub mod utils;

pub use record::{
    init_directory, 
    get_all_records,
    get_record,
    put_record, 
    delete_record, 
    add_record
};

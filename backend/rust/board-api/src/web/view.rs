use chrono::{DateTime, Utc};

use crate::entity::post::Model;

pub struct PostView {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub author: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Model> for PostView {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            title: model.title,
            content: model.content,
            author: model.author,
            created_at: format_datetime(model.created_at),
            updated_at: format_datetime(model.updated_at),
        }
    }
}

fn format_datetime(value: DateTime<Utc>) -> String {
    value.format("%Y-%m-%d %H:%M UTC").to_string()
}

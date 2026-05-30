use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::entity::post::Model;

#[derive(Debug, Deserialize)]
pub struct CreatePostRequest {
    pub title: String,
    pub content: String,
    pub author: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePostRequest {
    pub title: Option<String>,
    pub content: Option<String>,
    pub author: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct PostResponse {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub author: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<Model> for PostResponse {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            title: model.title,
            content: model.content,
            author: model.author,
            created_at: model.created_at,
            updated_at: model.updated_at,
        }
    }
}

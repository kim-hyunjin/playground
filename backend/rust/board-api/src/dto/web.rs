use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct PostForm {
    pub title: String,
    pub content: String,
    pub author: String,
}

impl PostForm {
    pub fn into_create_request(self) -> crate::dto::post::CreatePostRequest {
        crate::dto::post::CreatePostRequest {
            title: self.title,
            content: self.content,
            author: self.author,
        }
    }

    pub fn into_update_request(self) -> crate::dto::post::UpdatePostRequest {
        crate::dto::post::UpdatePostRequest {
            title: Some(self.title),
            content: Some(self.content),
            author: Some(self.author),
        }
    }
}

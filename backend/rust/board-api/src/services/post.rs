use chrono::Utc;
use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set};

use crate::{
    dto::post::{CreatePostRequest, UpdatePostRequest},
    entity::post::{self, Entity as PostEntity},
    error::{AppError, AppResult},
    state::AppState,
};

pub async fn list_posts(state: &AppState) -> AppResult<Vec<post::Model>> {
    PostEntity::find()
        .order_by_desc(post::Column::Id)
        .all(&state.db)
        .await
        .map_err(AppError::from)
}

pub async fn get_post(state: &AppState, id: i32) -> AppResult<post::Model> {
    find_post_by_id(state, id).await
}

pub async fn create_post(state: &AppState, payload: CreatePostRequest) -> AppResult<post::Model> {
    validate_create(&payload)?;

    let now = Utc::now();
    let active_model = post::ActiveModel {
        title: Set(payload.title.trim().to_owned()),
        content: Set(payload.content.trim().to_owned()),
        author: Set(payload.author.trim().to_owned()),
        created_at: Set(now),
        updated_at: Set(now),
        ..Default::default()
    };

    active_model.insert(&state.db).await.map_err(AppError::from)
}

pub async fn update_post(
    state: &AppState,
    id: i32,
    payload: UpdatePostRequest,
) -> AppResult<post::Model> {
    if payload.title.is_none() && payload.content.is_none() && payload.author.is_none() {
        return Err(AppError::Validation(
            "at least one field must be provided".to_string(),
        ));
    }

    let existing = find_post_by_id(state, id).await?;
    let mut active_model: post::ActiveModel = existing.into();

    if let Some(title) = payload.title {
        let trimmed = title.trim();
        if trimmed.is_empty() {
            return Err(AppError::Validation("title cannot be empty".to_string()));
        }
        active_model.title = Set(trimmed.to_owned());
    }

    if let Some(content) = payload.content {
        let trimmed = content.trim();
        if trimmed.is_empty() {
            return Err(AppError::Validation("content cannot be empty".to_string()));
        }
        active_model.content = Set(trimmed.to_owned());
    }

    if let Some(author) = payload.author {
        let trimmed = author.trim();
        if trimmed.is_empty() {
            return Err(AppError::Validation("author cannot be empty".to_string()));
        }
        active_model.author = Set(trimmed.to_owned());
    }

    active_model.updated_at = Set(Utc::now());
    active_model.update(&state.db).await.map_err(AppError::from)
}

pub async fn delete_post(state: &AppState, id: i32) -> AppResult<post::Model> {
    let post = find_post_by_id(state, id).await?;
    let active_model: post::ActiveModel = post.clone().into();
    active_model.delete(&state.db).await?;
    Ok(post)
}

async fn find_post_by_id(state: &AppState, id: i32) -> AppResult<post::Model> {
    PostEntity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or(AppError::NotFound)
}

fn validate_create(payload: &CreatePostRequest) -> AppResult<()> {
    if payload.title.trim().is_empty() {
        return Err(AppError::Validation("title is required".to_string()));
    }
    if payload.content.trim().is_empty() {
        return Err(AppError::Validation("content is required".to_string()));
    }
    if payload.author.trim().is_empty() {
        return Err(AppError::Validation("author is required".to_string()));
    }
    Ok(())
}

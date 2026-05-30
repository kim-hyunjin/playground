use axum::{
    extract::{Path, State},
    Json,
};
use chrono::Utc;
use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set};

use crate::{
    dto::post::{CreatePostRequest, PostResponse, UpdatePostRequest},
    entity::post::{self, Entity as PostEntity},
    error::{AppError, AppResult},
    state::AppState,
};

pub async fn list_posts(
    State(state): State<AppState>,
) -> AppResult<Json<Vec<PostResponse>>> {
    let posts = PostEntity::find()
        .order_by_desc(post::Column::Id)
        .all(&state.db)
        .await?
        .into_iter()
        .map(PostResponse::from)
        .collect();

    Ok(Json(posts))
}

pub async fn get_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> AppResult<Json<PostResponse>> {
    let post = find_post_by_id(&state, id).await?;
    Ok(Json(PostResponse::from(post)))
}

pub async fn create_post(
    State(state): State<AppState>,
    Json(payload): Json<CreatePostRequest>,
) -> AppResult<Json<PostResponse>> {
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

    let created = active_model.insert(&state.db).await?;
    Ok(Json(PostResponse::from(created)))
}

pub async fn update_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdatePostRequest>,
) -> AppResult<Json<PostResponse>> {
    if payload.title.is_none() && payload.content.is_none() && payload.author.is_none() {
        return Err(AppError::Validation(
            "at least one field must be provided".to_string(),
        ));
    }

    let existing = find_post_by_id(&state, id).await?;
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
    let updated = active_model.update(&state.db).await?;
    Ok(Json(PostResponse::from(updated)))
}

pub async fn delete_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> AppResult<Json<PostResponse>> {
    let post = find_post_by_id(&state, id).await?;
    let response = PostResponse::from(post.clone());
    let active_model: post::ActiveModel = post.into();
    active_model.delete(&state.db).await?;
    Ok(Json(response))
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

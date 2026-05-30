use axum::{
    extract::{Path, State},
    Json,
};

use crate::{
    dto::post::{CreatePostRequest, PostResponse, UpdatePostRequest},
    error::AppResult,
    services::post as post_service,
    state::AppState,
};

pub async fn list_posts(
    State(state): State<AppState>,
) -> AppResult<Json<Vec<PostResponse>>> {
    let posts = post_service::list_posts(&state)
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
    let post = post_service::get_post(&state, id).await?;
    Ok(Json(PostResponse::from(post)))
}

pub async fn create_post(
    State(state): State<AppState>,
    Json(payload): Json<CreatePostRequest>,
) -> AppResult<Json<PostResponse>> {
    let created = post_service::create_post(&state, payload).await?;
    Ok(Json(PostResponse::from(created)))
}

pub async fn update_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdatePostRequest>,
) -> AppResult<Json<PostResponse>> {
    let updated = post_service::update_post(&state, id, payload).await?;
    Ok(Json(PostResponse::from(updated)))
}

pub async fn delete_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> AppResult<Json<PostResponse>> {
    let post = post_service::delete_post(&state, id).await?;
    Ok(Json(PostResponse::from(post)))
}

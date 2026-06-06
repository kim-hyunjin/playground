pub mod post;
pub mod web;

use axum::{routing::get, Router};

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .merge(web::router())
        .route("/health", get(health))
        .route(
            "/api/posts",
            get(post::list_posts).post(post::create_post),
        )
        .route(
            "/api/posts/:id",
            get(post::get_post)
                .put(post::update_post)
                .delete(post::delete_post),
        )
}

async fn health() -> &'static str {
    "ok"
}

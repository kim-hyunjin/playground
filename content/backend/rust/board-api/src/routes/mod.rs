pub mod post;

use axum::{routing::get, Router};

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
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

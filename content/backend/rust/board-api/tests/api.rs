use axum::{
    body::Body,
    http::{Request, StatusCode},
    Router,
};
use board_api::{db, routes, state::AppState};
use http_body_util::BodyExt;
use sea_orm::DatabaseConnection;
use serde_json::{json, Value};
use tower::ServiceExt;

async fn test_app() -> Router {
    let db: DatabaseConnection = db::connect("sqlite::memory:")
        .await
        .expect("in-memory database");
    db::init_schema(&db)
        .await
        .expect("schema initialization");

    Router::new()
        .merge(routes::router())
        .with_state(AppState { db })
}

async fn read_json(response: axum::response::Response) -> Value {
    let body = response.into_body().collect().await.unwrap().to_bytes();
    serde_json::from_slice(&body).unwrap_or(Value::Null)
}

#[tokio::test]
async fn crud_flow() {
    let app = test_app().await;

    let create = app
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/posts")
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "title": "Hello",
                        "content": "First post",
                        "author": "rustacean"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(create.status(), StatusCode::OK);
    let created = read_json(create).await;
    let id = created["id"].as_i64().expect("post id");
    assert_eq!(created["title"], "Hello");

    let list = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/posts")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(list.status(), StatusCode::OK);
    let posts = read_json(list).await;
    assert_eq!(posts.as_array().map(|items| items.len()), Some(1));

    let update = app
        .clone()
        .oneshot(
            Request::builder()
                .method("PUT")
                .uri(format!("/api/posts/{id}"))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({ "title": "Updated title" }).to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(update.status(), StatusCode::OK);
    let updated = read_json(update).await;
    assert_eq!(updated["title"], "Updated title");

    let delete = app
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri(format!("/api/posts/{id}"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(delete.status(), StatusCode::OK);

    let missing = app
        .oneshot(
            Request::builder()
                .uri(format!("/api/posts/{id}"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(missing.status(), StatusCode::NOT_FOUND);
}

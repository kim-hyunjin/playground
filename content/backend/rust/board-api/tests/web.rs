use axum::{
    body::Body,
    http::{Request, StatusCode},
    Router,
};
use board_api::{db, routes, state::AppState};
use http_body_util::BodyExt;
use sea_orm::DatabaseConnection;
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

async fn read_body(response: axum::response::Response) -> String {
    let body = response.into_body().collect().await.unwrap().to_bytes();
    String::from_utf8_lossy(&body).into_owned()
}

#[tokio::test]
async fn html_board_flow() {
    let app = test_app().await;

    let list = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(list.status(), StatusCode::OK);
    let list_html = read_body(list).await;
    assert!(list_html.contains("Board"));
    assert!(list_html.contains("아직 게시글이 없습니다"));

    let create = app
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/posts")
                .header("content-type", "application/x-www-form-urlencoded")
                .body(Body::from(
                    "title=Hello&author=rustacean&content=First+post+body",
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(create.status(), StatusCode::SEE_OTHER);
    let location = create
        .headers()
        .get("location")
        .and_then(|value| value.to_str().ok())
        .expect("redirect location");
    assert!(location.starts_with("/posts/"));

    let detail = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(location)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(detail.status(), StatusCode::OK);
    let detail_html = read_body(detail).await;
    assert!(detail_html.contains("Hello"));
    assert!(detail_html.contains("First post body"));

    let list_after = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let list_after_html = read_body(list_after).await;
    assert!(list_after_html.contains("Hello"));
    assert!(!list_after_html.contains("아직 게시글이 없습니다"));
}

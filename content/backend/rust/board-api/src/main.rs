use board_api::{db, routes, state::AppState};
use std::net::SocketAddr;

use axum::Router;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "board_api=debug,tower_http=debug,sqlx=warn".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://board.db?mode=rwc".to_string());
    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = std::env::var("PORT")
        .ok()
        .and_then(|value| value.parse().ok())
        .unwrap_or(3000u16);

    let db = db::connect(&database_url)
        .await
        .expect("failed to connect to database");
    db::init_schema(&db)
        .await
        .expect("failed to initialize database schema");

    let state = AppState { db };
    let app = Router::new()
        .merge(routes::router())
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let addr = SocketAddr::from((
        host.parse::<std::net::IpAddr>().expect("invalid HOST"),
        port,
    ));
    tracing::info!(%addr, "board-api listening");

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind address");
    axum::serve(listener, app)
        .await
        .expect("server error");
}

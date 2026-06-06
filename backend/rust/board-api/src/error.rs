use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use sea_orm::DbErr;
use serde_json::json;
use thiserror::Error;

use crate::web::render_error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("resource not found")]
    NotFound,
    #[error("validation error: {0}")]
    Validation(String),
    #[error(transparent)]
    Database(#[from] DbErr),
}

impl AppError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::Validation(_) => StatusCode::BAD_REQUEST,
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn client_message(&self) -> String {
        match self {
            AppError::NotFound => "요청한 게시글을 찾을 수 없습니다.".to_string(),
            AppError::Validation(message) => message.clone(),
            AppError::Database(_) => "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.".to_string(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = self.status_code();
        (status, Json(json!({ "error": self.to_string() }))).into_response()
    }
}

/// HTML 페이지 라우트용 에러 응답
pub struct WebError(pub AppError);

impl From<AppError> for WebError {
    fn from(value: AppError) -> Self {
        Self(value)
    }
}

impl IntoResponse for WebError {
    fn into_response(self) -> Response {
        let status = self.0.status_code();
        let html = render_error(status.as_u16(), self.0.client_message());
        (status, html).into_response()
    }
}

pub type AppResult<T> = Result<T, AppError>;
pub type WebResult<T> = Result<T, WebError>;

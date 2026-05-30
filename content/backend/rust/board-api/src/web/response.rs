use askama::Template;
use axum::response::Html;

use super::templates::{ErrorTemplate, LayoutTemplate};

pub fn render_error(status: u16, message: impl Into<String>) -> Html<String> {
    let message = message.into();
    let body = ErrorTemplate {
        status,
        message: message.clone(),
    };
    let body_html = body
        .render()
        .unwrap_or_else(|_| format!("<p>{message}</p>"));
    let page = LayoutTemplate {
        title: "오류",
        body: &body_html,
    };
    Html(page.render().unwrap_or_else(|_| {
        format!("<h1>{status}</h1><p>{message}</p>")
    }))
}

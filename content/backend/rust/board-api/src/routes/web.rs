use askama::Template;
use axum::{
    extract::{Path, State},
    response::{Html, IntoResponse, Redirect, Response},
    Form,
};
use axum::routing::{get, post};

use crate::{
    dto::web::PostForm,
    error::{AppError, WebError, WebResult},
    services::post as post_service,
    state::AppState,
    web::{
        templates::{DetailTemplate, FormTemplate, LayoutTemplate, ListTemplate},
        view::PostView,
    },
};

pub fn router() -> axum::Router<AppState> {
    axum::Router::new()
        .route("/", get(list_page))
        .route("/posts/new", get(new_post_form))
        .route("/posts", post(create_post))
        .route("/posts/:id", get(show_post))
        .route("/posts/:id/edit", get(edit_post_form).post(update_post))
        .route("/posts/:id/delete", post(delete_post))
}

async fn list_page(State(state): State<AppState>) -> WebResult<Html<String>> {
    let posts = post_service::list_posts(&state)
        .await?
        .into_iter()
        .map(PostView::from)
        .collect();

    Ok(render_page("게시판", ListTemplate { posts })?)
}

async fn show_post(State(state): State<AppState>, Path(id): Path<i32>) -> WebResult<Html<String>> {
    let post = post_service::get_post(&state, id).await?;
    let view = PostView::from(post);
    let page_title = view.title.clone();
    Ok(render_page(&page_title, DetailTemplate { post: view })?)
}

async fn new_post_form() -> WebResult<Html<String>> {
    Ok(render_page(
        "글쓰기",
        FormTemplate {
            heading: "새 글".to_string(),
            action: "/posts".to_string(),
            submit_label: "등록".to_string(),
            title: String::new(),
            content: String::new(),
            author: String::new(),
            error: None,
        },
    )?)
}

async fn create_post(
    State(state): State<AppState>,
    Form(form): Form<PostForm>,
) -> Result<Response, WebError> {
    let title = form.title.clone();
    let content = form.content.clone();
    let author = form.author.clone();

    match post_service::create_post(&state, form.into_create_request()).await {
        Ok(post) => Ok(Redirect::to(&format!("/posts/{}", post.id)).into_response()),
        Err(AppError::Validation(message)) => Ok(render_form_with_error(
            FormTemplate {
                heading: "새 글".to_string(),
                action: "/posts".to_string(),
                submit_label: "등록".to_string(),
                title,
                content,
                author,
                error: None,
            },
            message,
            "글쓰기",
        )?
        .into_response()),
        Err(err) => Err(WebError(err)),
    }
}

async fn edit_post_form(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> WebResult<Html<String>> {
    let post = post_service::get_post(&state, id).await?;
    Ok(render_page(
        "글 수정",
        FormTemplate {
            heading: "글 수정".to_string(),
            action: format!("/posts/{id}/edit"),
            submit_label: "저장".to_string(),
            title: post.title,
            content: post.content,
            author: post.author,
            error: None,
        },
    )?)
}

async fn update_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Form(form): Form<PostForm>,
) -> Result<Response, WebError> {
    let title = form.title.clone();
    let content = form.content.clone();
    let author = form.author.clone();

    match post_service::update_post(&state, id, form.into_update_request()).await {
        Ok(_) => Ok(Redirect::to(&format!("/posts/{id}")).into_response()),
        Err(AppError::Validation(message)) => Ok(render_form_with_error(
            FormTemplate {
                heading: "글 수정".to_string(),
                action: format!("/posts/{id}/edit"),
                submit_label: "저장".to_string(),
                title,
                content,
                author,
                error: None,
            },
            message,
            "글 수정",
        )?
        .into_response()),
        Err(err) => Err(WebError(err)),
    }
}

async fn delete_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> WebResult<Redirect> {
    post_service::delete_post(&state, id).await?;
    Ok(Redirect::to("/"))
}

fn render_page(title: &str, body: impl Template) -> Result<Html<String>, AppError> {
    let body_html = body
        .render()
        .map_err(|err| AppError::Validation(format!("template error: {err}")))?;
    let page = LayoutTemplate {
        title,
        body: &body_html,
    };
    let html = page
        .render()
        .map_err(|err| AppError::Validation(format!("template error: {err}")))?;
    Ok(Html(html))
}

fn render_form_with_error(
    mut form: FormTemplate,
    message: String,
    page_title: &str,
) -> Result<Html<String>, AppError> {
    form.error = Some(message);
    render_page(page_title, form)
}

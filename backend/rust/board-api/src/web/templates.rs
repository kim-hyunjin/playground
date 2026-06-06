use askama::Template;

use super::view::PostView;

#[derive(Template)]
#[template(path = "layout.html")]
pub struct LayoutTemplate<'a> {
    pub title: &'a str,
    pub body: &'a str,
}

#[derive(Template)]
#[template(path = "list.html")]
pub struct ListTemplate {
    pub posts: Vec<PostView>,
}

#[derive(Template)]
#[template(path = "detail.html")]
pub struct DetailTemplate {
    pub post: PostView,
}

#[derive(Template)]
#[template(path = "form.html")]
pub struct FormTemplate {
    pub heading: String,
    pub action: String,
    pub submit_label: String,
    pub title: String,
    pub content: String,
    pub author: String,
    pub error: Option<String>,
}

#[derive(Template)]
#[template(path = "error.html")]
pub struct ErrorTemplate {
    pub status: u16,
    pub message: String,
}

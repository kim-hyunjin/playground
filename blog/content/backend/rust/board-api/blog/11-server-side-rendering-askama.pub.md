---
title: "[Rust] Askama으로 HTML 게시판 만들기"
date: 2026-05-31
category: Backend
tags: [Rust, Askama, SSR, HTML]
summary: "templates, web/templates.rs, PostView, routes/web.rs의 Form·Redirect·검증 실패 시 폼 재표시를 설명합니다."
---

브라우저용 게시판은 JSON 대신 **HTML**을 반환합니다. `board-api`는 **Askama**로 Rust struct와 `.html` 템플릿을 컴파일 타임에 묶습니다 (Jinja2/Thymeleaf, Django template과 유사).

## Rust를 처음 접한다면 — SSR이란

**SSR(Server-Side Rendering)** — 서버가 HTML 문자열을 완성해서 브라우저에 보냅니다. React SPA처럼 브라우저가 JSON을 받아 화면을 그리는 방식이 아닙니다.

- **장점** — JavaScript 없이도 동작, SEO·첫 화면이 단순.
- **이 프로젝트** — 폼 제출 → 서버 검증 → 리다이렉트 또는 에러 HTML. 전형적인 “클래식” 웹 앱 흐름입니다.

## askama.toml

프로젝트 루트 `askama.toml`이 템플릿 디렉터리를 `templates/`로 지정합니다. `#[template(path = "list.html")]`는 그 기준 상대 경로입니다.

## templates.rs — 템플릿 struct

```rust
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
```

`derive(Template)` — 빌드 시 HTML을 Rust 코드로 컴파일. 런타임에 파일을 찾지 않아 배포가 단순합니다.

## PostView (`web/view.rs`)

```rust
pub struct PostView {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub author: String,
    pub created_at: String,
    pub updated_at: String,
}
```

`PostResponse`와 달리 날짜는 **미리 포맷한 문자열**입니다.

```rust
fn format_datetime(value: DateTime<Utc>) -> String {
    value.format("%Y-%m-%d %H:%M UTC").to_string()
}
```

템플릿은 Rust 문법을 모르므로, 표시용 값은 뷰에서 문자열로 만듭니다.

## layout.html + list.html

`layout.html` — 공통 헤더·CSS, `{{ body|safe }}`에 각 페이지 본문 삽입.

`list.html`:

```jinja
{% if posts.is_empty() %}
<p class="empty">아직 게시글이 없습니다. 첫 글을 작성해 보세요.</p>
{% else %}
{% for post in posts %}
<article class="card">
  <h2><a href="/posts/{{ post.id }}">{{ post.title }}</a></h2>
  <p class="meta">{{ post.author }} · {{ post.created_at }}</p>
</article>
{% endfor %}
{% endif %}
```

## render_page — 레이아웃 감싸기

```rust
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
```

1. `list.html` 등 **본문** 렌더
2. `layout.html`에 `body`로 넣어 **전체 페이지** 렌더
3. `Html(String)` — Axum이 `text/html` 응답

## list_page

```rust
async fn list_page(State(state): State<AppState>) -> WebResult<Html<String>> {
    let posts = post_service::list_posts(&state)
        .await?
        .into_iter()
        .map(PostView::from)
        .collect();

    Ok(render_page("게시판", ListTemplate { posts })?)
}
```

REST `list_posts`와 동일 서비스, `PostView` + 템플릿만 다릅니다.

## Form, Redirect, 검증 실패

**생성 성공:**

```rust
Ok(Redirect::to(&format!("/posts/{}", post.id)).into_response())
```

303 See Other — 브라우저가 상세 페이지로 이동 (POST-Redirect-GET 패턴).

**검증 실패:**

```rust
Err(AppError::Validation(message)) => Ok(render_form_with_error(
    FormTemplate { /* 사용자가 입력한 title, content, author 유지 */ },
    message,
    "글쓰기",
)?)
```

`render_form_with_error`는 `form.error = Some(message)` 후 다시 `render_page`합니다. `form.html`의 `{% if let Some(error) = error %}` 블록이 알림을 표시합니다.

**삭제:**

```rust
async fn delete_post(...) -> WebResult<Redirect> {
    post_service::delete_post(&state, id).await?;
    Ok(Redirect::to("/"))
}
```

HTML 폼은 `method="post"`로 `/posts/:id/delete`를 호출합니다 (REST DELETE와 다른 URL).

## detail.html / form.html (요지)

- **detail** — 제목·작성자·본문·수정/삭제 링크
- **form** — `action`, `submit_label`, 입력 필드, `error` 알림

## 실습: 브라우저 흐름

1. `cargo run` 후 `http://127.0.0.1:3000` — 빈 목록 문구
2. 글쓰기 → 등록 → 상세 URL로 리다이렉트
3. 제목 비우고 등록 → 폼에 에러 메시지·입력값 유지

## 헷갈리기 쉬운 점

- **`{{ body|safe }}`** — 이미 HTML 조각인 본문을 **이스케이프하지 않고** 넣습니다. 사용자 입력을 `body`에 직접 넣으면 XSS 위험이 있습니다. 이 프로젝트는 Askama가 필드 값을 기본 이스케이프하고, `safe`는 **우리가 만든 템플릿 조각**에만 씁니다.
- **POST-Redirect-GET** — 폼 POST 후 새로고침 시 재전송을 막기 위해 303으로 GET 상세로 보냅니다.
- **삭제가 `POST /posts/:id/delete`** — HTML form은 예전부터 GET/POST만 쓰는 경우가 많아, RESTful DELETE 대신 POST 라우트를 둔 것입니다.

## 심화: Askama vs 런타임 템플릿

| | Askama (컴파일 타임) | 런타임 템플릿 (파일 로드) |
|---|---------------------|---------------------------|
| 오타/필드명 오류 | **컴파일 시** 발견 | 런타임 에러 |
| 배포 | HTML이 바이너리에 포함 | 템플릿 파일 경로 관리 필요 |
| 유연성 | 템플릿 변경 시 **재컴파일** | hot reload 가능 |

`LayoutTemplate<'a>`의 **수명 `'a`** — `body`가 렌더된 `String`의 참조를 잠깐 빌려 레이아웃에 넣습니다. 렌더 순서가 `render_page`에 고정되어 있어 안전합니다.

## 정리

| 요소 | 역할 |
|------|------|
| Askama `Template` | HTML 생성 |
| `PostView` | 표시용 데이터 |
| `render_page` | 레이아웃 |
| `Form` / `Redirect` | 폼·PRG |
| `match Validation` | 폼 재표시 |

다음 글에서는 **통합 테스트**로 위 흐름을 자동 검증하는 방법을 봅니다.

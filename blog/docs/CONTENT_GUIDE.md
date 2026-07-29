# 콘텐츠 작성 가이드

## Markdown과 MDX

게시 글은 `content/` 아래에서 카테고리 경로를 유지하고 `.pub.md` 또는 `.pub.mdx`로 저장한다. 파일 이름은 소문자 kebab-case를 사용한다. `.pub` 접미사는 게시 대상을 구분하는 현재 콘텐츠 규칙이다.

폴더 구조는 사이트의 주제 계층으로 그대로 사용된다. 예를 들어
`content/backend/backend-engineering/asynchronous-processing/example.pub.md`는
`Backend / Backend Engineering / Asynchronous Processing` breadcrumb와 다음 주제
페이지에 표시된다.

```text
/categories/backend/
/categories/backend/backend-engineering/
/categories/backend/backend-engineering/asynchronous-processing/
```

상위 주제 페이지에는 바로 아래의 하위 주제와 그 폴더에 직접 들어 있는 글만
표시된다. 글을 다른 폴더로 옮기면 주제 breadcrumb와 주제 페이지 URL도 함께
바뀐다. 폴더명은 kebab-case를 사용하고, 화면 표시 이름을 다듬어야 할 때는
`src/lib/topics.ts`의 `TOPIC_LABELS`에 전체 폴더 경로를 등록한다.

```yaml
---
title: 글 제목
date: 2026-07-27
category: Backend
categories:
  - Backend
  - Database
tags:
  - database
  - postgresql
summary: 글 목록과 검색 결과에 표시할 한 문장 요약
draft: false
---
```

`title`, `date`, `category`, `tags`, `summary`는 필수다. `categories`, `description`, `draft`, `updated`, `canonical`은 선택할 수 있다. MDX도 같은 frontmatter와 경로 규칙을 따른다. MDX에서는 저장소의 검토된 로컬 Astro 컴포넌트만 정적 import하고 `<script>`, 원격 import, 사용자 입력을 실행하는 표현식은 사용하지 않는다.

`category`와 `categories`는 RSS 등 글 메타데이터로 유지한다. 사이트의 탐색
계층은 frontmatter가 아니라 실제 폴더 경로를 기준으로 생성된다.

레이아웃이 frontmatter의 `title`을 문서 제목으로 렌더링하므로 본문에는 H1(`#`)
을 다시 쓰지 않는다. 본문 섹션은 H2(`##`)부터 시작한다. `pnpm verify:content`는
원본 Markdown/MDX와 Notebook 변환 결과에 남은 본문 H1을 오류로 처리한다.

## 링크와 이미지

내부 글 링크는 가능하면 저장소의 `.pub.md` 또는 `.pub.mdx` 원본을 기준으로 작성한다. `public/`의 에셋을 직접 연결할 때는 배포 base가 빠지지 않도록 공용 URL helper 또는 `import.meta.env.BASE_URL`을 사용한다. Astro가 처리할 이미지는 `src/assets/`에 두고 import한다.

## Notebook

`.pub.ipynb`는 저장된 셀 출력까지 게시한다. 빌드 과정은 셀을 실행하지 않는다.
변환기는 Markdown 셀에서 처음 만나는 H1을 생성 문서의 frontmatter `title`로
사용하지만 본문의 헤딩을 제거하거나 단계를 바꾸지 않는다. 따라서 Notebook
본문도 H2부터 작성해야 하며, 남은 H1은 `pnpm verify:content`가 오류로 보고한다.
Markdown 셀에 H1이 없으면 `.pub.ipynb` 파일명을 공백으로 풀어 제목으로 사용한다.

```bash
cd blog
pnpm convert:notebooks
pnpm verify:content
```

변환 결과인 `src/content/generated/`와 `public/notebook-assets/`는 직접 수정하지 않는다. 신뢰할 수 없는 Notebook을 추가하기 전에 저장된 HTML과 이미지 출력을 검토한다.

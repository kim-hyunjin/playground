# 콘텐츠 작성 가이드

## Markdown과 MDX

게시 글은 `content/` 아래에서 카테고리 경로를 유지하고 `.pub.md` 또는 `.pub.mdx`로 저장한다. 파일 이름은 소문자 kebab-case를 사용한다. `.pub` 접미사는 게시 대상을 구분하는 현재 콘텐츠 규칙이다.

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

## 링크와 이미지

내부 글 링크는 가능하면 저장소의 `.pub.md` 또는 `.pub.mdx` 원본을 기준으로 작성한다. `public/`의 에셋을 직접 연결할 때는 배포 base가 빠지지 않도록 공용 URL helper 또는 `import.meta.env.BASE_URL`을 사용한다. Astro가 처리할 이미지는 `src/assets/`에 두고 import한다.

## Notebook

`.pub.ipynb`는 저장된 셀 출력까지 게시한다. 빌드 과정은 셀을 실행하지 않는다.

```bash
cd blog
corepack pnpm convert:notebooks
corepack pnpm verify:content
```

변환 결과인 `src/content/generated/`와 `public/notebook-assets/`는 직접 수정하지 않는다. 신뢰할 수 없는 Notebook을 추가하기 전에 저장된 HTML과 이미지 출력을 검토한다.

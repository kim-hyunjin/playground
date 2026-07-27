---
name: doc-to-blog
description: Convert technical documentation, README files, study notes, or existing Markdown into a publish-ready post for this repository's Astro blog. Use when Codex needs to publish, rewrite, or move source material into blog/content as a .pub.md or .pub.mdx article with valid frontmatter, topic-folder navigation, preserved code and links, and project validation.
---

# doc-to-blog

Convert source documentation into an Astro blog post without losing technical detail.

## Inspect the project

1. Read the source document completely.
2. Read `blog/docs/CONTENT_GUIDE.md`, `blog/src/content.config.ts`, and one or two nearby posts before editing. Treat those files as the current source of truth.
3. Inspect `blog/content/` and `blog/src/lib/topics.ts` to choose an existing topic hierarchy when possible.

## Choose the output

- Write normal articles as `blog/content/<topic-path>/<slug>.pub.md`.
- Use `.pub.mdx` only when the article genuinely needs a reviewed local Astro component.
- Use lowercase kebab-case for every new folder and filename.
- Treat the folder path as navigation data: it determines the topic pages and breadcrumbs. Frontmatter `category` and `categories` do not determine navigation.
- Reuse the closest existing topic path. If a new folder needs a display name that title-casing cannot produce, add its full path to `TOPIC_LABELS` in `blog/src/lib/topics.ts`.
- If the input is already under `blog/content/`, edit or rename it in place. If it is elsewhere, create the blog post and preserve the source unless the user explicitly asks to move or remove it.
- Never edit generated Notebook output under `blog/src/content/generated/` or `blog/public/notebook-assets/`.

The post URL is derived from the full path below `blog/content/` and retains the `.pub` suffix. Moving a post therefore changes both its URL and its topic hierarchy.

## Write frontmatter

Include all required fields and use the user's requested values when supplied:

```yaml
---
title: "글 제목"
date: 2026-07-27
category: "Backend"
categories:
  - "Backend"
  - "Database"
tags:
  - "database"
  - "postgresql"
summary: "글 목록과 검색 결과에 표시할 220자 이하의 한 문장 요약"
draft: false
---
```

- `title`: Use a clear, specific article title.
- `date`: Preserve an explicit publication date; otherwise use today's local date in `YYYY-MM-DD` form.
- `category`: Use one broad technical domain as display metadata.
- `categories`: Optionally record readable metadata labels. Do not use it as a substitute for the folder hierarchy.
- `tags`: Add 3–5 useful tags, with at least one required by the schema.
- `summary`: Write one non-empty sentence no longer than 220 characters.
- `draft`: Default to `false` unless the user asks for a draft.
- Add `description`, `updated`, or `canonical` only when the source or user provides a reason.

Do not add migration-only or generated fields such as `sourcePath`, `sourceModified`, or `generator` to ordinary Markdown and MDX posts.

## Convert the body

- Preserve technical claims, caveats, commands, code samples, tables, diagrams, and citations. Do not invent results or silently omit difficult sections.
- Improve ordering, transitions, and headings only where it makes the document easier to read.
- Do not repeat the title as a body-level `#` heading; `PostLayout.astro` already renders the frontmatter title. Start with an introduction or `##` section.
- Use `##` and `###` for the table-of-contents hierarchy.
- Keep fenced code language identifiers accurate. Preserve Mermaid diagrams as fenced `mermaid` blocks.
- Preserve valid external links and verify local links and image references after moving the content.
- Link to another post with its repository source path, including `.pub.md` or `.pub.mdx`, when a relative source link is practical.
- Follow the content guide for images and MDX safety. Do not introduce remote imports, executable user input, or unreviewed components.

## Validate

From `blog/`, run:

```bash
pnpm check
pnpm build
```

Fix frontmatter, schema, rendering, asset, and internal-link failures caused by the new post. Do not commit or publish unless the user asks.

Report the final file path, selected topic hierarchy, notable content changes, and validation result.

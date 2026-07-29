# hyunjin.log

Astro 기반 정적 기술 블로그다. Markdown, MDX, Jupyter Notebook으로 작성한 글을
`https://kim-hyunjin.github.io/playground/`에 게시한다.

이 문서의 명령은 별도 설명이 없으면 `blog/` 디렉터리에서 실행한다.

## 처음 설치

```bash
pnpm install --frozen-lockfile
```

Node와 pnpm의 특정 버전은 고정하지 않는다. 프로젝트 의존성 설치와 명령 실행이
가능한 현재 버전을 사용하면 된다.

## 새 글 추가

게시 가능한 원본 파일은 모두 `content/` 아래에 둔다.

```text
content/
├── backend/database/indexes-storage/b-tree.pub.md
├── frontend/react/component-basics.pub.mdx
└── ai/deeplearning-master/model-training.pub.ipynb
```

- Markdown: `content/**/*.pub.md`
- MDX: `content/**/*.pub.mdx`
- Notebook: `content/**/*.pub.ipynb`

파일과 폴더 이름은 소문자 kebab-case를 사용한다. `.pub`은 게시 대상으로 인식하기
위한 접미사이므로 제거하지 않는다.

Markdown과 MDX에는 다음 frontmatter가 필요하다.

```yaml
---
title: "PostgreSQL 비동기 커밋 이해하기"
date: 2026-07-27
category: "Backend"
categories:
  - "Backend"
  - "Database"
tags:
  - "postgresql"
  - "transaction"
summary: "비동기 커밋의 동작 방식과 데이터 손실 가능성, 적용 기준을 정리합니다."
draft: false
---
```

필수 필드는 `title`, `date`, `category`, `tags`, `summary`다. `tags`에는 항목이
하나 이상 있어야 하며 `summary`는 220자를 넘을 수 없다. `categories`,
`description`, `draft`, `updated`, `canonical`은 선택 사항이다.

페이지 레이아웃이 frontmatter의 `title`을 `<h1>`으로 출력하므로 새 글 본문에서는
같은 제목을 `#`으로 반복하지 않아도 된다. 본문 목차에는 `##`, `###` 제목이
사용된다.

`draft: true`인 글과 현재보다 미래의 `date`를 가진 글은 빌드 시 스키마 검사는
받지만 글 목록, 실제 페이지, RSS와 sitemap에는 공개되지 않는다.

더 자세한 Markdown, MDX, 이미지 및 보안 규칙은
[`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md)를 따른다.

## 주제와 카테고리 추가

사이트의 탐색 계층은 frontmatter가 아니라 `content/`의 실제 폴더 구조로 만든다.

```text
content/backend/backend-engineering/asynchronous-processing/example.pub.md
        └────────────── 주제 경로 ─────────────────────┘
```

위 글은 다음 주제 페이지와 breadcrumb에 자동으로 포함된다.

```text
/playground/categories/backend/
/playground/categories/backend/backend-engineering/
/playground/categories/backend/backend-engineering/asynchronous-processing/
```

새 주제를 추가할 때는 원하는 위치에 kebab-case 폴더를 만들고 글을 넣으면 된다.
별도의 카테고리 설정 파일이나 index 문서는 필요하지 않다.

화면에 표시할 이름을 다듬어야 한다면 `src/lib/topics.ts`의 `TOPIC_LABELS`에 전체
폴더 경로를 등록한다. 예를 들어 `backend/message-queue`를 `Message Queue`로
표시할 수 있다. 새 최상위 주제의 메뉴 순서를 직접 지정하려면 같은 파일의
`TOPIC_ORDER`에도 경로를 추가한다. 등록되지 않은 주제는 이름순으로 정렬된다.

frontmatter의 `category`와 `categories`는 RSS 등의 글 메타데이터다. 폴더를 대신할
수 없으며 주제 페이지나 breadcrumb를 만들지 않는다. 태그는 `tags` 배열에
추가하기만 하면 태그 목록과 태그별 페이지가 자동으로 만들어진다.

## URL을 정하는 규칙

글 URL은 `content/` 아래의 전체 경로에서 만들어지며 `.pub` 접미사를 유지한다.

```text
content/backend/database/example.pub.md
→ /playground/backend/database/example.pub/
```

파일이나 상위 폴더의 이름을 바꾸면 공개 URL도 바뀐다. 이전 URL을 보존하거나
redirect하는 검사는 없으므로, 이미 공유한 글을 이동하거나 이름을 바꿀 때는 링크가
깨져도 괜찮은지 먼저 판단한다.

다른 글로 연결할 때는 가능하면 저장소 원본을 기준으로 상대 링크를 작성한다.

```markdown
[B-Tree 정리](./b-tree.pub.md)
```

이미지나 내부 링크를 추가하거나 글을 이동한 뒤에는 반드시 전체 build로 배포
경로의 `/playground/` base와 링크 유효성을 확인한다.

## Notebook 추가

`.pub.ipynb`는 저장되어 있는 Markdown 셀, 코드 셀과 셀 출력을 정적 HTML로
변환한다. 빌드가 Notebook 셀을 실행하지 않으므로 게시할 출력은 Notebook 자체에
미리 저장해야 한다. 신뢰할 수 없는 Notebook은 저장된 HTML과 이미지 출력을 먼저
검토한다.

Notebook의 `metadata.title`을 우선 사용하고, 없으면 Markdown 셀의 첫 H1 또는
파일명 순으로 생성 문서의 frontmatter `title`을 결정한다. 변환기가 본문 헤딩을
제거하거나 단계를 바꾸지는 않으며, 본문에 남은 H1은 콘텐츠 검증에서 오류로
처리된다.

```bash
pnpm convert:notebooks
pnpm verify:content
```

변환 결과인 `src/content/generated/`와 `public/notebook-assets/`는 직접 수정하지
않는다. 원본 `.pub.ipynb`를 수정한 뒤 변환 명령을 다시 실행한다.

## 개발과 검증

```bash
pnpm dev                   # Notebook 변환 후 개발 서버 실행
pnpm check                 # Notebook 변환, Astro 검사, 콘텐츠 검증
pnpm test                  # URL과 콘텐츠 계약 단위 테스트
pnpm build                 # 전체 검사, 테스트, 정적 빌드와 링크 검사
pnpm preview               # build된 /playground/ 사이트 미리 보기
pnpm run publish:dry-run   # 실제 게시 없이 publish의 전체 로컬 게이트 실행
```

새 글 하나를 작성하는 동안에는 `pnpm dev`를 사용하고, 작업을 마치기 전에는
`pnpm build`까지 통과시키는 것을 기본으로 한다. `preview`는 기존 `dist/`를
보여주므로 먼저 `pnpm build`가 필요하다.

`publish:dry-run`은 실제 publish와 같은 전체 build를 수행하지만 `gh-pages`
브랜치를 만들거나 원격 저장소에 push하지 않는다. 수정 중인 작업 트리에서도
실행할 수 있다.

## 빌드할 때 자동으로 만들어지는 것

새 글이나 주제를 추가해도 다음 파일과 페이지를 직접 관리할 필요가 없다.

- 최근 글, 주제, breadcrumb와 태그 페이지
- Pagefind 검색 인덱스
- `/playground/rss.xml`
- 사람이 보는 `/playground/sitemap/`
- 검색엔진용 `/playground/sitemap-index.xml`과 XML sitemap
- `robots.txt`, `404.html`, `.nojekyll`

이 결과물은 `pnpm build`가 `dist/`에 새로 만든다. `dist/`를 직접 수정하거나
커밋하지 않는다.

## 배포

배포할 글과 코드 변경을 PR로 `main`에 병합한 뒤, 최신 `main`이 체크아웃된
작업 트리에서 실행한다.

```bash
git pull --ff-only origin main
cd blog
pnpm install --frozen-lockfile
pnpm run publish
```

의존성이 이미 최신이면 install은 생략할 수 있다. 반드시 `pnpm publish`가 아니라
`pnpm run publish`를 사용한다.

publish 스크립트는 다음 작업을 수행한다.

1. `blog/` 작업 트리가 깨끗한지 확인한다.
2. 전체 check, test, build와 산출물 검사를 다시 실행한다.
3. 원격 `gh-pages` 브랜치를 가져온다.
4. `dist/`의 내용만 `gh-pages` 브랜치 루트에 게시한다.
5. 배포 commit 메시지에 source commit SHA를 기록한다.

스크립트는 현재 브랜치가 `main`인지 검사하지 않는다. PR을 병합한 뒤 최신
`main`으로 이동했는지 직접 확인해야 한다. force 또는 orphan history 재작성은
사용하지 않는다.

## 새 글 체크리스트

- 파일과 폴더 이름이 kebab-case이며 `.pub.md`, `.pub.mdx` 또는 `.pub.ipynb`인가?
- 글을 표시할 주제 폴더를 올바르게 선택했는가?
- 필수 frontmatter와 220자 이하의 `summary`가 있는가?
- 코드, 이미지와 내부 링크가 실제 경로에서 동작하는가?
- Notebook 생성 결과나 `dist/`를 직접 수정하지 않았는가?
- `pnpm build`가 통과하는가?
- 배포 전 변경을 commit하고 PR을 `main`에 병합했는가?

## 롤백

배포 후 치명적인 문제가 있으면 Git 이력에서 마지막 정상 source commit과
`gh-pages` commit을 복구하고, 원인과 누락 검사를 기록한 뒤 다시 배포한다.

# hyunjin.log

Astro 기반 정적 기술 블로그다. `https://kim-hyunjin.github.io/playground/`에 Markdown, MDX, Jupyter Notebook을 게시한다.

## 환경과 설치

- Node.js 22.22.3 (`.nvmrc`)
- pnpm 11.17.0 (`packageManager`)

```bash
corepack pnpm install --frozen-lockfile
```

## 개발과 검증

```bash
corepack pnpm dev          # Notebook 변환 후 개발 서버
corepack pnpm check        # Astro 타입·콘텐츠 스키마 검사
corepack pnpm test         # URL·콘텐츠 계약 단위 테스트
corepack pnpm build        # 전체 검사, 정적 빌드, Pagefind, 링크 검사
corepack pnpm preview      # /playground/ production preview
```

`build`가 만드는 `dist/`에는 `.nojekyll`, Pagefind 인덱스, RSS, sitemap, robots와 404가 모두 포함된다. 필수 산출물, 내부 링크, canonical URL 또는 `/playground/` base가 올바르지 않으면 실패한다.

## 글 작성

- Markdown: `content/**/*.pub.md`
- MDX: `content/**/*.pub.mdx`
- Notebook: `content/**/*.pub.ipynb`

`content/`의 폴더 구조는 주제 페이지와 글 breadcrumb로 그대로 이어진다. 필수 frontmatter, 폴더 계층, MDX/Notebook 보안 규칙은 [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md)를 따른다. Notebook 변환 결과인 `src/content/generated/`와 `public/notebook-assets/`는 직접 수정하지 않는다.

## 배포

먼저 모든 `blog/` 변경을 commit한 뒤 단일 명령으로 배포한다.

```bash
corepack pnpm publish
```

publish는 고정된 도구 버전과 깨끗한 `blog/` 작업 트리를 확인하고 전체 build를 다시 수행한 다음 `dist/`의 내용만 `gh-pages` 브랜치 루트에 게시한다. force/orphan history 재작성은 사용하지 않으며 source commit SHA를 배포 commit 메시지에 기록한다. 배포 전 로컬 게이트만 확인하려면 `corepack pnpm publish:dry-run`을 사용한다.

## 롤백

이전 빌드 시스템은 제거되었다. 배포 후 치명적인 문제가 있으면 Git 이력에서 마지막 정상 source commit과 `gh-pages` commit을 복구하고, 원인과 누락 검사를 기록한 뒤 다시 배포한다.

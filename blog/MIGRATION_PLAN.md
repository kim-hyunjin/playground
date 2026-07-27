# MkDocs에서 Astro로 마이그레이션 계획

> 마이그레이션 대상은 정적 사이트 프레임워크인 **Astro(AstroJS)** 로 확정한다.

## 1. 목표와 완료 조건

### 목표

- 기존 글과 URL을 잃지 않고 MkDocs 기반 블로그를 Astro 기반 정적 사이트로 전환한다.
- Markdown 글 130개와 Jupyter Notebook 글 21개를 계속 게시할 수 있게 한다.
- 현재의 카테고리 탐색, 검색, 코드 강조, Mermaid, 다크 모드, 반응형 화면을 유지하거나 개선한다.
- 일반 Markdown과 함께 MDX를 지원해 글 안에서 승인된 Astro 컴포넌트를 사용할 수 있게 한다.
- 스타일링에는 적용 가능 여부를 먼저 검증한 뒤 **구현 시점의 최신 안정 버전 Tailwind CSS**를 사용한다.
- GitHub Pages의 프로젝트 사이트 경로(`/playground/`)에서도 에셋과 내부 링크가 정상 동작하게 한다.
- 콘텐츠 스키마와 빌드 검증을 도입해 잘못된 frontmatter가 배포 단계까지 가지 않게 한다.

### 완료 조건

- 모든 게시 대상 문서가 경고 없이 빌드되고, 이전 공개 URL은 동일한 페이지 또는 리다이렉트로 연결된다.
- 홈, 카테고리, 글 상세, 태그, 검색, 404 페이지가 모바일과 데스크톱에서 동작한다.
- 코드 블록, 표, 이미지, 각주, Mermaid, 목차, Notebook 출력이 대표 샘플에서 시각적으로 검증된다.
- `.mdx` 문서가 Markdown과 같은 스키마·URL 규칙으로 빌드되고, 허용된 컴포넌트를 정상 렌더링한다.
- 프로덕션 빌드에서 깨진 내부 링크와 누락된 정적 에셋이 없다.
- 로컬 publish 명령이 검증·빌드·검색 인덱싱 후 `gh-pages` 브랜치에 결과물만 배포한다.
- 전환 후 운영 절차가 `README.md`에 반영되고 MkDocs/Python 의존성을 제거할 수 있다.

## 2. 현재 상태 기준선

현재 저장소를 기준으로 다음 항목을 마이그레이션 범위로 잡는다.

| 영역 | 현재 상태 | Astro에서의 대응 |
| --- | --- | --- |
| 콘텐츠 | `content/**/*.pub.md` 130개 | Content Collections + glob loader |
| MDX | 현재 게시 문서는 Markdown 중심 | 공식 `@astrojs/mdx` 통합과 `.pub.mdx` 게시 규칙 추가 |
| Notebook | `content/**/*.pub.ipynb` 21개 | 빌드 전 Markdown 변환 후 생성 컬렉션에 포함 |
| 홈 | `content/index.md` | `src/pages/index.astro` 또는 별도 페이지 컬렉션 |
| 메타데이터 | 모든 Markdown에 `title`, `date`, `category`, `tags`, `summary` 존재 | Zod 스키마로 필수 필드 검증 |
| 분류 | 경로 기반 대분류와 `category`/`categories` 혼용 | 단일 정규화 규칙을 정하고 호환 필드는 과도기에 유지 |
| 테마 | Material for MkDocs 커스텀 CSS/override | 최신 안정 Tailwind CSS 우선, 부적합할 때만 scoped CSS/CSS 변수 사용 |
| Markdown 기능 | PyMdown, Mermaid, 코드 강조, 목차 | remark/rehype 플러그인과 Astro 컴포넌트로 대체 |
| 검색 | MkDocs search | 정적 검색 인덱스(Pagefind 권장) |
| 배포 | `mkdocs gh-deploy` 스크립트 | 로컬 빌드 후 `gh-pages` 브랜치에 `dist/` 게시 |
| 공개 경로 | `https://kim-hyunjin.github.io/playground/` | `site: 'https://kim-hyunjin.github.io'`, `base: '/playground'`를 명시 |

구현 전에는 현재 MkDocs 결과물을 한 번 빌드해 다음 기준 자료를 보관한다.

1. 생성된 전체 URL 목록과 HTTP 상태
2. 대표 페이지 스크린샷(홈, 카테고리, Markdown 글, Mermaid 글, Notebook 글)
3. Lighthouse 결과와 빌드 시간
4. 게시 문서 수, 제목, 날짜, 카테고리, 태그의 스냅샷
5. 내부 링크 및 이미지 경로 검사 결과

## 3. 제안 아키텍처

```text
blog/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   └── assets/
├── scripts/
│   ├── convert-notebooks.*
│   └── verify-content.*
├── src/
│   ├── assets/
│   ├── components/
│   ├── content.config.ts
│   ├── content/
│   │   ├── posts/          # 기존 .pub.md 및 새 .pub.mdx
│   │   └── generated/      # Notebook 변환 산출물, 직접 수정 금지
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [...slug].astro
│   │   ├── categories/[category]/[page].astro
│   │   ├── tags/[tag]/[page].astro
│   │   └── 404.astro
│   └── styles/
└── tests/
```

### 주요 설계 결정

1. **정적 출력 유지**: 서버 런타임 없이 `output: 'static'`으로 GitHub Pages에 배포한다.
2. **콘텐츠 우선 전환**: 글 본문을 한꺼번에 수정하지 않고 Astro가 기존 형식을 읽도록 어댑터를 둔다.
3. **URL 우선 보존**: MkDocs 빌드에서 추출한 URL 매니페스트를 기준으로 Astro 경로를 생성한다. 새 URL 체계가 필요하면 동일 배포에서 정적 리다이렉트 페이지와 canonical URL을 제공한다.
4. **타입이 있는 frontmatter**: `title`, `date`, `category`, `tags`, `summary`는 필수, `categories`, `description`, `draft`, `updated`는 선택으로 시작한다. 날짜는 문자열 입력을 `Date`로 변환한다.
5. **base 경로 중앙화**: 링크와 에셋에서 `/playground/`를 문자열로 반복하지 않고 Astro의 `BASE_URL` 또는 URL helper를 사용한다.
6. **생성물 분리**: Notebook 변환 결과는 원본과 분리하고 스크립트로 항상 재현 가능하게 만든다.
7. **MDX는 명시적으로 사용**: 공식 `@astrojs/mdx` 통합을 사용하고 `.pub.mdx`만 게시 대상으로 포함한다. MDX도 Markdown과 동일한 frontmatter 스키마, draft, slug 및 링크 검사를 통과해야 한다.
8. **Tailwind CSS 최신 안정 버전 우선**: 구현을 시작할 때 Astro와 Tailwind CSS의 공식 문서에서 권장하는 현재 통합 방식과 호환성을 확인한다. 사용할 수 있다면 당시의 최신 안정 버전을 설치하고 lockfile에 고정하며, 구형 통합 패키지나 과거 버전을 새로 도입하지 않는다. Astro/MDX 호환성, GitHub Pages 빌드 또는 접근성 요구를 충족하지 못할 때만 사유를 ADR에 남기고 scoped CSS와 CSS 변수로 대체한다.
9. **로컬 branch 배포 유지**: 기존 `mkdocs gh-deploy`와 비슷하게 개발자 PC에서 검증과 빌드를 마친 뒤 `blog/dist/` 내용만 `gh-pages` 브랜치 루트에 push한다. 저장소 Settings → Pages의 Source는 **Deploy from a branch**, branch는 `gh-pages`, directory는 `/(root)`로 설정한다.
10. **MkDocs URL 형태 보존**: GitHub Pages는 서버 측 rewrite나 임의의 `301/302` 규칙을 지원하지 않으므로 기존 경로를 Astro의 정적 HTML 출력 경로로 그대로 생성하는 것을 우선한다. 불가피한 변경만 meta refresh/canonical이 포함된 정적 redirect HTML로 처리하며 이를 HTTP redirect로 간주하지 않는다.

## 4. GitHub Pages 배포 가능성 검토

### 결론

현재 계획은 아래 조건을 구현하면 `https://kim-hyunjin.github.io/playground/`에 **서버 런타임 없이 배포 가능**하다. 이 개인 블로그의 현재 운영 방식에서는 GitHub Actions보다 로컬에서 빌드해 `gh-pages` 브랜치에 올리는 방식이 단계가 적고 이해하기 쉽다. 의존성과 캐시가 이미 있는 개발자 PC에서는 빌드도 일반적으로 더 빠르게 시작된다. Astro의 정적 출력, MDX, Tailwind CSS와 Pagefind 결과를 `blog/dist/` 하나로 완성한 다음 그 디렉터리의 내용만 게시한다.

단, “더 심플하다”는 것은 운영자가 한 명이고 동일한 PC에서 배포한다는 전제다. 로컬 Node/pnpm 버전 차이, 검증 누락, 인증 만료, 커밋하지 않은 글 배포 가능성은 Actions보다 취약하다. 따라서 단일 `publish` 스크립트가 모든 preflight를 강제하고, 수동으로 `gh-pages` 브랜치를 편집하거나 `dist/` 일부만 push하는 것은 금지한다.

### 필수 Astro 설정

구현 시점의 Astro 스키마로 다시 확인하되 의미상 다음 설정을 유지한다.

```js
export default defineConfig({
  site: 'https://kim-hyunjin.github.io',
  base: '/playground',
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'always',
});
```

- `site`에는 origin만, `base`에는 저장소 경로만 둬 canonical/sitemap에서 경로가 중복되지 않게 한다.
- 현재 MkDocs의 디렉터리형 `.../index.html` URL을 유지하기 위해 `build.format`과 trailing slash 정책을 URL 기준선과 비교해 확정한다.
- 내부 링크, navigation, 404의 홈 링크, 정적 public asset, Mermaid, Pagefind UI/worker 경로는 `import.meta.env.BASE_URL` 또는 하나의 URL helper로 만든다.
- Astro가 번들링하는 `src/` asset은 import를 사용하고, `public/` asset을 `/assets/...`처럼 origin-root 절대 경로로 참조하지 않는다.
- 향후 custom domain을 쓰면 `site`와 `base` 정책이 달라지므로 별도 배포 변경으로 처리한다.

### 로컬 publish 계약

`blog/package.json`의 `publish` 또는 `blog/scripts/publish.sh` 하나만 공식 배포 진입점으로 제공한다. 구현에는 검증된 최신 안정 `gh-pages` CLI를 개발 의존성으로 고정하고, 전역 설치나 개발자의 임의 Git 명령에 의존하지 않는다.

```text
blog 변경이 모두 commit됐는지 확인
→ 고정된 Node/pnpm 버전과 frozen lockfile 확인
→ Astro check/test
→ clean Astro build
→ blog/dist/ 대상 Pagefind index 생성
→ blog/dist/.nojekyll 생성
→ dist 필수 파일·링크·base-path 검사
→ gh-pages CLI로 dist/ 내용만 gh-pages 브랜치 루트에 push
→ 실제 배포 URL smoke test
```

- `build` 명령은 **Astro build → Pagefind index 생성 → `.nojekyll` 생성**까지 포함해 배포 가능한 `dist/`를 항상 완성한다.
- `publish`는 `build`와 배포 전 검사를 다시 실행하므로 이전 빌드의 오래된 파일을 올릴 수 없어야 한다.
- 배포 전에 최소한 `blog/` 범위의 tracked 변경과 staged 변경이 없는지 확인한다. 소스 commit SHA를 배포 commit 메시지에 포함해 어떤 소스가 배포됐는지 추적한다.
- `gh-pages` CLI에는 `blog/dist/`만 전달하고 dotfile을 포함해 `.nojekyll`도 게시한다. `dist/` 자체 디렉터리가 아니라 그 **내용**이 branch 루트에 놓여야 한다.
- `gh-pages` branch history를 유지해 직전 정상 배포 commit으로 되돌릴 수 있게 한다. 자동 force/orphan 재작성은 기본값으로 사용하지 않는다.
- publish 중간에 실패하면 push하지 않고 종료하며, push 성공 전에는 현재 production을 변경하지 않는다.
- GitHub 인증은 개인 PC의 Git credential 또는 `gh auth`를 사용하되 토큰을 스크립트, remote URL, `.env` 또는 로그에 기록하지 않는다.
- GitHub Actions는 필수 배포 구성에서 제외한다. 여러 사람이 배포하거나 PC별 재현성 문제가 생길 때 PR build 검증부터 선택적으로 추가한다.

### Pages에서 특히 확인할 항목

1. **기존 URL:** MkDocs가 만든 URL 매니페스트와 `blog/dist/` 파일 경로를 일대일 비교한다. GitHub Pages에서는 `_redirects`, rewrite, 서버 redirect에 의존하지 않는다.
2. **404:** branch 루트에 `404.html`이 있어야 하며, 해당 페이지의 CSS·홈 링크도 `/playground/` base를 사용해야 한다.
3. **Jekyll 우회:** `gh-pages` branch 루트에 `.nojekyll`을 포함해 GitHub의 Jekyll 처리를 건너뛴다. Pagefind 및 underscore로 시작하는 asset도 push 결과에 실제 포함됐는지 검사한다.
4. **canonical/sitemap/RSS:** 모든 절대 URL이 `https://kim-hyunjin.github.io/playground/`로 시작하고 `/playground/playground/` 중복이 없는지 검사한다.
5. **클라이언트 요청:** 검색 worker, Mermaid 관련 asset, 동적 import와 fetch 요청을 배포 URL에서 검사한다. 로컬 `/` preview 성공만으로 통과시키지 않는다.
6. **단일 배포자:** 동시에 두 PC에서 publish하지 않는다. 시작 전에 remote `gh-pages`를 갱신하고 push 경합이 발생하면 강제로 덮어쓰지 말고 다시 빌드한다.

### 배포 승인 게이트

다음 항목이 모두 통과하기 전에는 기존 MkDocs publish 경로를 폐기하지 않는다.

- [ ] `blog/dist/index.html`, `blog/dist/404.html`, `blog/dist/.nojekyll`, 검색 인덱스가 존재한다.
- [ ] 임시 base-path HTTP 서버에서 `/playground/`로 홈, 글, CSS/JS, 검색, 404 링크를 검증한다.
- [ ] 기존 URL 매니페스트의 100%가 Astro `dist/`의 정적 파일에 대응한다.
- [ ] 생성된 HTML/CSS/JS에 의도하지 않은 `href="/` 또는 `src="/` origin-root 경로가 없다.
- [ ] sitemap/RSS/canonical의 origin과 base가 정확하다.
- [ ] publish가 깨끗한 `blog/` 소스, 고정 버전, frozen lockfile과 전체 검사를 강제한다.
- [ ] `gh-pages` branch 루트에 `dist/`의 내용과 `.nojekyll`만 게시됐는지 확인한다.
- [ ] 실제 Pages 배포 후 대표 URL, 새로고침, deep link, 검색 및 브라우저 콘솔을 smoke test한다.

## 5. 기능 대응표와 사전 검증 항목

| MkDocs 기능 | Astro 후보 | 확인할 사항 |
| --- | --- | --- |
| Material 레이아웃 | Astro layout/component | 헤더, 사이드바, 이전/다음 글, 모바일 내비게이션 |
| `navigation.tabs/sections` | 경로·메타데이터로 메뉴 생성 | 정렬 기준과 단일 글 폴더 표시 방식 |
| `search` | Pagefind | 한국어 검색 품질, base 경로, 로컬 build 인덱싱 순서 |
| Pygments highlight | Astro/Shiki | 언어 alias, 줄 강조, 줄 번호, 복사 버튼 |
| `toc` permalink | remark/rehype slug + autolink | 한글 heading slug가 기존 앵커와 같은지 |
| Mermaid fence | Mermaid 클라이언트 초기화 또는 빌드 시 SVG | 다크 모드, CSP, 긴 다이어그램 |
| admonition/details | remark plugin 또는 커스텀 directive | 기존 문법의 실제 사용량을 재조사한 뒤 결정 |
| `mkdocs-jupyter` | nbconvert 계열 전처리 | 실행하지 않음, 출력/수식/이미지 보존, 신뢰할 수 없는 HTML 제거 |
| `awesome-pages` | 컬렉션 정렬 유틸리티 | 파일명 접두사와 폴더 순서 보존 |
| `extra_css`/override | 전역 CSS + 컴포넌트 | 현재 색상, 폰트, 다크 모드 토큰 이식 |
| Markdown + 컴포넌트 | 공식 `@astrojs/mdx` | `.pub.mdx` 필터, 컴포넌트 허용 범위, Markdown과 동일한 frontmatter/URL |
| Material 커스텀 스타일 | 최신 안정 Tailwind CSS | 공식 권장 통합, content 감지, typography, 다크 모드, MDX class 처리 |

플러그인은 Astro 버전을 확정한 날의 공식 문서와 유지보수 상태를 확인한 뒤 고정한다. 특히 Markdown/MDX 플러그인 조합은 같은 AST를 여러 번 변경할 수 있으므로, 대표 문서 fixture로 순서까지 테스트한다. `@astrojs/mdx`와 Tailwind CSS도 구현 시점의 최신 안정 버전 및 공식 권장 통합 방식을 확인하고 lockfile로 재현성을 확보한다.

## 6. 단계별 실행 계획

### 0단계 — 기준선과 의사결정 고정 (0.5~1일)

- [ ] Node.js 버전과 패키지 관리자(`pnpm` 권장)를 정하고 버전을 고정한다.
- [ ] Astro, 공식 `@astrojs/mdx`, Tailwind CSS의 최신 안정 버전과 공식 호환 방식을 확인해 ADR에 기록한다.
- [ ] 현재 MkDocs 프로덕션 빌드를 보관하고 URL/콘텐츠 매니페스트를 생성한다.
- [ ] 저장소 Pages Source를 `gh-pages` branch의 `/(root)`로 설정하고 로컬 publish 방식을 확정한다.
- [ ] 기존 URL 유지 여부, Notebook 출력 보존 수준, 검색 요구사항을 ADR로 기록한다.

**게이트:** 게시 URL과 콘텐츠 개수가 자동 생성된 기준선 파일에 저장되어야 다음 단계로 간다.

### 1단계 — Astro 골격과 로컬 빌드 구축 (1일)

- [ ] `blog/`에 최소 Astro TypeScript 프로젝트를 만들고 `site`/`base`를 설정한다.
- [ ] 공식 `@astrojs/mdx`를 구성하고 최소 `.pub.mdx` fixture가 빌드되는지 확인한다.
- [ ] 사용할 수 있다면 구현 시점의 최신 안정 Tailwind CSS를 공식 권장 방식으로 구성하고, 버전을 lockfile에 고정한다.
- [ ] `dev`, `build`, `preview`, `check`, `test`, `lint` 스크립트를 정의한다.
- [ ] 공통 HTML head, SEO 기본값, canonical, Open Graph, sitemap, RSS를 구성한다.
- [ ] `check`, `test`, clean build, Pagefind, `.nojekyll`, link/base 검사를 하나의 로컬 build 명령으로 묶는다.
- [ ] `blog/` working directory, frozen lockfile, `blog/dist/` 입력만 허용하는 publish 스크립트를 테스트한다.
- [ ] 이 단계에서는 `gh-pages`에 push하지 않고 완성된 `dist/`를 로컬 preview한다.

**게이트:** 빈 사이트가 `/playground/` base 경로로 빌드되고 `dist/`를 로컬 preview에서 열 수 있어야 한다.

### 2단계 — Markdown/MDX 콘텐츠 수집과 스키마 도입 (1~2일)

- [ ] glob loader가 `.pub.md`와 `.pub.mdx`만 게시 대상으로 읽도록 설정한다.
- [ ] frontmatter 스키마와 category/tag 정규화 함수를 작성한다.
- [ ] MDX가 Markdown과 같은 스키마, slug, draft, canonical 및 링크 검사를 사용하게 한다.
- [ ] MDX에서 사용할 공용 컴포넌트 목록과 import 규칙을 문서화하고 임의 script 및 신뢰할 수 없는 동적 표현식을 금지한다.
- [ ] `draft` 기본값, 미래 날짜 처리, 중복 slug, 중복 canonical을 검증한다.
- [ ] 디렉터리 경로에서 안정적인 slug를 만들되 `.pub`이 기존 URL에 포함되는지는 URL 기준선으로 결정한다.
- [ ] Markdown 130개가 모두 로드되는 콘텐츠 개수 테스트를 추가한다.
- [ ] Markdown과 MDX의 heading, 코드 블록, Mermaid 및 remark/rehype 결과가 동등한지 fixture로 비교한다.
- [ ] 원본 링크를 바꾸지 않고 렌더링한 뒤 깨진 링크 보고서를 만든다.

**게이트:** 스키마 오류 0건, 누락 글 0건, 중복 출력 경로 0건이어야 한다.

### 3단계 — Notebook 파이프라인 (1~2일)

- [ ] `.pub.ipynb` 21개를 실행하지 않고 Markdown/HTML로 변환하는 스크립트를 만든다.
- [ ] 코드 셀, stdout, 표, 수식, SVG/PNG 출력을 대표 Notebook으로 검증한다.
- [ ] embedded image는 안정적인 해시 이름으로 생성하고 base 경로를 적용한다.
- [ ] 원본 경로·수정 시각·변환기 버전을 생성 frontmatter에 기록한다.
- [ ] 생성 디렉터리를 삭제한 뒤 같은 결과가 나오는 재현성 테스트를 추가한다.
- [ ] raw HTML과 script 출력은 sanitize 정책을 적용한다.

**게이트:** Notebook 21개의 변환 및 페이지 빌드가 모두 성공하고, 변환 과정에서 셀을 실행하지 않아야 한다.

### 4단계 — Tailwind CSS 기반 페이지와 디자인 이식 (2~4일)

- [ ] 기존 override와 `kami.css`에서 색상/간격/다크 모드 토큰을 추출한다.
- [ ] Tailwind CSS theme token으로 색상, 간격, typography, breakpoint를 옮기고 공통 패턴은 Astro 컴포넌트로 만든다.
- [ ] Tailwind CSS의 클래스 감지가 `.astro`, `.md`, `.mdx`와 생성된 Notebook 콘텐츠를 빠짐없이 포함하는지 production build에서 확인한다.
- [ ] prose 스타일은 Markdown, MDX 및 Notebook 모두에 같은 본문 규칙을 적용하고 코드·표·수식의 기존 디자인을 보존한다.
- [ ] 홈, 글 목록, 카테고리, 태그, 글 상세, 404를 구현한다.
- [ ] 경로 계층과 메타데이터를 사용해 데스크톱/모바일 내비게이션을 생성한다.
- [ ] 목차, 이전/다음 글, 읽기 시간, 코드 복사, heading anchor를 추가한다.
- [ ] Mermaid와 Markdown 확장 기능을 구현하고 light/dark 전환을 확인한다.
- [ ] 키보드 탐색, focus 상태, landmark, 대비, reduced motion을 검증한다.

**게이트:** 기준 스크린샷의 대표 페이지가 기능적으로 동등하고 접근성 검사에 중대 오류가 없어야 한다.

### 5단계 — 검색, SEO, 성능 (1~2일)

- [ ] 빌드 후 Pagefind 인덱스를 생성하고 한국어 제목/본문/태그 검색을 확인한다.
- [ ] sitemap, RSS, robots, canonical, Open Graph 메타데이터를 검증한다.
- [ ] draft와 생성 중간 파일이 검색·sitemap·RSS에 포함되지 않게 한다.
- [ ] 이미지 크기와 loading 정책, 폰트 로딩, client JavaScript 사용량을 점검한다.
- [ ] Lighthouse와 빌드 크기를 기준선과 비교하고 회귀 예산을 설정한다.

**게이트:** 주요 검색어 fixture가 기대 글을 찾고, canonical/sitemap URL이 모두 `/playground/` 배포 주소를 가리켜야 한다.

### 6단계 — 병렬 검증과 전환 (1~2일 + 관찰 기간)

- [ ] MkDocs와 Astro를 같은 commit에서 각각 빌드한다.
- [ ] URL 매니페스트를 `blog/dist/`와 비교하고 각 기존 URL에 대응하는 정적 HTML이 있는지 확인한다.
- [ ] HTML 비교는 구조적 지표(제목, heading, 코드 블록, 이미지, 내부 링크)로 수행한다.
- [ ] publish 스크립트가 소스 상태와 도구 버전을 검증한 뒤 Astro build → Pagefind → `.nojekyll` → 검사 순서로 실행되는지 확인한다.
- [ ] preview한 `blog/dist/` 내용만 `gh-pages` branch 루트에 배포한다.
- [ ] GitHub Pages 설정을 `gh-pages`/`(root)`로 전환해 branch 배포를 활성화한다.
- [ ] 배포 직후 404, 검색, sitemap, RSS, 브라우저 콘솔 오류를 점검한다.
- [ ] 최소 한 번의 정상 배포가 확인될 때까지 MkDocs 설정과 마지막 정상 `gh-pages` commit을 유지한다.

**게이트:** 기존 URL 100%가 유효하고 게시 글 151개가 모두 접근 가능해야 전환을 완료한다.

### 7단계 — 정리와 운영 문서화 (0.5~1일)

- [x] `README.md`의 작성, 미리보기, 빌드, 배포 명령을 Node 기반으로 바꾼다.
- [x] MkDocs 전용 `pyproject.toml`, `requirements.txt`, `uv.lock`, 설정과 스크립트를 제거한다.
- [x] 더 이상 사용하지 않는 override/CSS를 삭제하되 이식된 스타일과 비교한다.
- [x] 글 작성 규칙, 허용 frontmatter, 이미지 규칙, Notebook 변환 방법을 문서화한다.
- [ ] 의존성 업데이트와 링크 검사를 주기적으로 실행하도록 자동화한다.

## 7. 테스트 전략

### 자동 검사

- **콘텐츠 계약:** Markdown 130개 + Notebook 21개, 필수 메타데이터, 허용 category, 날짜, 중복 slug를 검사한다.
- **MDX 계약:** `.pub.mdx`만 노출되는지, frontmatter/slug가 Markdown과 같은지, 승인된 컴포넌트와 플러그인이 정상 렌더링되는지 검사한다.
- **스타일 빌드:** 최신 안정 Tailwind CSS 구성과 production class 생성 결과를 검사하고 `.astro`/`.mdx`의 동적 클래스 누락을 방지한다.
- **단위 테스트:** slug, URL join, category/tag 정규화, 읽기 시간 계산을 검사한다.
- **빌드 테스트:** 루트가 아닌 `base`에서 production build가 성공하는지 검사한다.
- **배포 산출물 테스트:** `blog/dist/`의 `.nojekyll`, 필수 파일, Pagefind 출력, origin-root asset 경로, canonical/sitemap/RSS base 중복을 검사한다.
- **publish 테스트:** dry-run 또는 임시 remote로 `dist/` 내용만 branch 루트에 들어가고 소스 SHA가 기록되는지 검사한다.
- **링크 테스트:** 생성된 HTML의 내부 링크, heading fragment, 이미지, CSS/JS를 검사한다.
- **브라우저 테스트:** 홈 → 카테고리 → 글, 검색 → 글, 다크 모드, 모바일 메뉴의 핵심 흐름을 검사한다.
- **접근성 테스트:** 핵심 템플릿에 axe 계열 검사와 키보드 수동 검사를 적용한다.
- **시각 회귀:** 대표 Markdown/Notebook/Mermaid 페이지를 light/dark 및 모바일/데스크톱으로 비교한다.

### 대표 fixture

최소한 다음 특성을 각각 포함하는 글을 고정 fixture로 선택한다.

- 한글 제목과 깊은 heading 구조
- 긴 코드 블록과 여러 프로그래밍 언어
- Mermaid 다이어그램
- Astro 컴포넌트, JSX 표현식과 frontmatter를 사용하는 MDX
- 표, 각주, 인라인 코드, 외부/내부 링크
- 수식과 이미지 출력이 있는 Notebook
- 긴 카테고리 경로와 파일명 숫자 접두사

## 8. 위험과 완화책

| 위험 | 영향 | 완화책 |
| --- | --- | --- |
| MkDocs와 Astro의 slug 규칙 차이 | 기존 링크와 heading fragment가 404 | 현재 빌드에서 URL/anchor를 추출하고 호환 slug 함수 또는 리다이렉트 사용 |
| 프로젝트 base 경로 누락 | CSS, 이미지, 검색 worker가 깨짐 | URL helper 중앙화 및 `/playground/` preview E2E 테스트 |
| `site`와 `base` 중복 | canonical/sitemap이 `/playground/playground/` 생성 | origin과 repository path를 분리하고 생성 결과 검사 |
| 잘못된 publish 경로 | `gh-pages/dist/` 아래에 들어가 사이트가 비어 보임 | `blog/dist/`의 내용만 branch 루트에 게시하는 통합 테스트 |
| Pagefind 생성 순서 오류 | 페이지는 열리지만 검색 asset이 404 | 로컬 build에서 Astro 다음 인덱싱 순서를 고정하고 publish 전 파일 검사 |
| `.nojekyll` 누락 | underscore asset이 Jekyll 처리에서 누락될 수 있음 | build마다 `dist/.nojekyll` 생성 및 branch 결과 검사 |
| 로컬 환경 차이 | PC에 따라 다른 결과가 배포됨 | Node/pnpm/의존성 버전 고정, frozen lockfile, clean build 강제 |
| 미커밋 소스 배포 | production과 source branch가 대응하지 않음 | `blog/` clean check와 source SHA 배포 메시지 강제 |
| 동시 로컬 배포 | 늦은 push가 최신 사이트를 덮어씀 | 단일 배포자 원칙, remote 갱신, non-force push |
| 서버 redirect 의존 | GitHub Pages에서 이전 URL 404 | 기존 정적 경로 보존, 불가피할 때만 정적 redirect HTML 사용 |
| PyMdown 문법 차이 | admonition, tab, code annotation 손실 | 사용 문법 inventory + fixture + 필요한 문법만 변환 플러그인 구현 |
| Markdown과 MDX 처리 차이 | 같은 글 형식의 목차·코드·링크가 다르게 출력 | 공통 remark/rehype 구성과 교차 fixture 테스트 사용 |
| MDX의 실행 가능한 표현식 | 신뢰할 수 없는 콘텐츠가 빌드 또는 브라우저 코드 실행 | 저장소 기여자만 작성하고 허용 컴포넌트/import 규칙 및 review 적용 |
| Tailwind CSS 클래스 감지 누락 | production에서 MDX/동적 스타일이 사라짐 | 정적 클래스·명시적 매핑 사용 및 빌드 결과 시각 회귀 테스트 |
| 최신 Tailwind CSS와 Astro 비호환 | 빌드 실패 또는 구형 통합에 고착 | 공식 호환 방식을 먼저 검증하고 불가 시 ADR과 scoped CSS fallback 사용 |
| Notebook 출력 차이/용량 증가 | 레이아웃 깨짐, 느린 페이지 | 실행 금지, 출력 sanitize, 큰 이미지는 최적화하고 크기 예산 설정 |
| `category`와 `categories` 불일치 | 탐색 중복/누락 | canonical category 규칙과 정규화 보고서를 먼저 작성 |
| 생성 콘텐츠의 source control 혼선 | 불필요한 diff 또는 CI 불일치 | 생성물 커밋 여부를 명시하고 clean build 재현성 검사 |
| 검색의 한국어 품질 저하 | 글 발견성 저하 | 실제 검색어 fixture로 평가하고 부족하면 tokenizer/대체 도구 비교 |
| 한 번에 교체하는 배포 | 장애 시 복구 지연 | MkDocs 산출물 보관, publish 명령 분리, 즉시 되돌릴 branch commit 준비 |

## 9. 롤백 계획

1. 전환 직전의 MkDocs 빌드 산출물과 마지막 정상 배포 commit SHA를 기록한다.
2. Astro publish 스크립트와 기존 MkDocs publish 스크립트의 이름을 분리하고 전환 후에는 하나만 사용한다.
3. 전환 후 치명적인 404, 에셋 장애, 콘텐츠 누락이 발견되면 기록해 둔 마지막 정상 `gh-pages` commit을 branch에 복구한다.
4. 새 글이 Astro 전환 이후 추가됐다면 원본 콘텐츠는 공통으로 유지해 MkDocs에서도 빌드 가능한지 확인하거나, 롤백 전에 해당 글만 호환 형식으로 보정한다.
5. 장애 원인과 누락된 자동 검사를 기록한 뒤 Astro preview에서 게이트를 다시 통과할 때 재전환한다.

## 10. 권장 작업 단위(PR 순서)

1. **PR 1 — Inventory/ADR:** URL·콘텐츠 기준선, 결정 기록, 검사 스크립트
2. **PR 2 — Astro foundation:** 프로젝트 골격, MDX, 최신 안정 Tailwind CSS, base 경로, 로컬 build
3. **PR 3 — Markdown/MDX:** 컬렉션 스키마, 기존 Markdown 및 MDX 렌더링, URL 호환
4. **PR 4 — Notebook:** 비실행 변환 파이프라인과 출력 테스트
5. **PR 5 — UI:** 레이아웃, 내비게이션, 테마, Markdown 기능
6. **PR 6 — Discovery:** 검색, RSS, sitemap, SEO, 성능 개선
7. **PR 7 — Cutover:** URL 비교, 로컬 `gh-pages` publish, rollback 준비
8. **PR 8 — Cleanup:** MkDocs/Python 제거 및 운영 문서 갱신

각 PR은 독립적으로 빌드 가능해야 하며, 콘텐츠 원본 이동과 배포 전환을 같은 PR에 섞지 않는다. 이렇게 하면 URL 또는 렌더링 문제가 생겼을 때 변경 범위를 빠르게 되돌릴 수 있다.

## 11. 구현 시작 전 확인할 질문

- 현재 공개된 `.pub` 포함 URL을 그대로 유지해야 하는가, 아니면 리다이렉트와 함께 정리할 것인가?
- Notebook은 저장된 출력까지 그대로 보여야 하는가, 코드와 Markdown 셀만 보여도 되는가?
- 검색은 완전한 클라이언트 정적 검색이면 충분한가?
- 카테고리 순서는 디렉터리/파일명, frontmatter, 별도 설정 중 무엇을 기준으로 할 것인가?
- 전환 과정에서 디자인을 그대로 복제할지, Astro에 맞춰 함께 개편할지?
- MDX에서 허용할 Astro 컴포넌트와 JSX 사용 범위는 어디까지인가?

이 질문에 답한 뒤 0단계 ADR을 승인하면, 예상 구현 기간은 단독 작업 기준 약 **8~13일**이며 콘텐츠 예외 처리와 디자인 개편 범위에 따라 달라질 수 있다.

# ADR 0001: MkDocs에서 Astro로 전환

- 상태: 승인
- 날짜: 2026-07-27

## 결정

- Node.js 22.22.3과 pnpm 11.17.0을 고정한다.
- Astro 7.1.3의 정적 출력, 공식 `@astrojs/mdx` 7.0.3, Tailwind CSS 4.3.3의 공식 Vite 플러그인을 사용한다.
- 공개 주소는 `https://kim-hyunjin.github.io/playground/`이며 기존 MkDocs의 `.pub/` 포함 디렉터리 URL을 그대로 생성한다.
- `.pub.md`와 `.pub.mdx`만 Markdown 컬렉션에 포함하고 동일한 스키마와 URL 규칙을 적용한다.
- Notebook 21개는 셀을 실행하지 않고 저장된 Markdown, 코드, HTML, PNG, 텍스트 출력을 정적 Markdown과 해시 에셋으로 변환한다. HTML 출력은 script와 이벤트 속성을 제거한다.
- Pagefind 1.5.2로 빌드 후 정적 검색 인덱스를 만들고 `/playground/` base URL을 브라우저 설정에 전달한다.
- 배포는 검증된 `dist/` 내용만 로컬에서 `gh-pages` 브랜치 루트로 게시한다. 이 마이그레이션 작업에서는 실제 push를 수행하지 않는다.

## 근거

현재 MkDocs 기준선은 Markdown 130개, Notebook 21개, HTML URL 153개다. GitHub Pages는 서버 rewrite를 제공하지 않으므로 기존 정적 경로를 직접 생성하는 것이 링크 보존에 가장 확실하다. Astro 5.2 이상에서는 Tailwind CSS 4의 Vite 플러그인이 공식 권장 방식이며, 과거 `@astrojs/tailwind` 통합은 사용하지 않는다.

## 운영 규칙

- `content/` 원본은 마이그레이션 중 이동하거나 대량 수정하지 않는다.
- 생성 Notebook 콘텐츠와 에셋은 직접 수정하지 않고 `pnpm convert:notebooks`로 재생성한다.
- MDX는 저장소 기여자가 작성한 로컬 컴포넌트만 import하며 원격 코드, inline script, 임의 DOM 주입을 허용하지 않는다.
- 전환 전 산출물에서 추출한 URL 기준선은 `baseline/legacy-urls.json`으로 보존한다.
- 2026-07-27 사용자 지시에 따라 첫 production 배포 전에 MkDocs/Python 빌드 시스템을 제거했다. 롤백은 source와 `gh-pages` Git 이력을 사용한다.

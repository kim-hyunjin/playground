# Astro 마이그레이션 상태

기준일: 2026-07-27

## 완료

- Node.js, pnpm, Astro, MDX, Tailwind CSS 4 버전 고정과 ADR
- Markdown 130개와 Notebook 21개를 build에서 검증
- `.pub.md`/`.pub.mdx` 공통 스키마와 정적 글 경로 생성
- Notebook 비실행 변환, HTML sanitize, PNG 해시 에셋, 재생성 가능한 출력
- 홈, 카테고리, 태그, 글 상세, 검색, 404, RSS, sitemap, robots
- 반응형 내비게이션, light/dark 테마, 목차, 이전/다음 글, 읽기 시간, 코드 복사, Mermaid
- Pagefind 한국어 인덱스와 `/playground/` base 경로
- `.nojekyll`, canonical, 내부 링크와 에셋 검증
- commit 상태와 도구 버전을 강제하는 로컬 `gh-pages` publish 명령
- 데스크톱/모바일 브라우저 smoke test
- MkDocs/Python 설정, 의존성, override, shell wrapper와 로컬 산출물 제거

## production 전환 게이트

- [x] 변경사항을 source branch에 commit
- [ ] GitHub Pages Source가 `gh-pages` / `/(root)`인지 확인
- [ ] `corepack pnpm publish` 실행
- [ ] 실제 Pages에서 홈, deep link, Notebook, Mermaid, 검색, 404, RSS 확인
- [ ] 정상 배포 commit SHA와 롤백 SHA 기록
- [x] MkDocs/Python 의존성과 override 제거

사용자 요청에 따라 첫 production 배포 전에 이전 빌드 시스템을 정리했다. 롤백은 저장소의 source/`gh-pages` Git 이력을 기준으로 수행한다.

# Northstar Field Test — Mastro 0.8 showcase

Mastro의 현재 JSR 패키지를 실제로 밀어붙여 보는 에디토리얼 사이트입니다.

```sh
npm install
npm run dev
```

`http://localhost:8000`에서 확인할 수 있습니다.

## 이 프로젝트가 보여주는 것

- 표준 `Request`/`Response`를 쓰는 서버 렌더링
- 데이터 하나에서 홈 카드, 동적 상세 라우트, JSON API를 함께 생성
- `getStaticPaths()`를 이용한 6개 상세 페이지 정적 생성
- Promise를 그대로 템플릿에 넣는 비동기 서버 컴포넌트
- 별도 번들러 없이 동작하는 작은 브라우저 모듈
- View Transitions, `<dialog>`, CSS scroll-driven animation 등 웹 플랫폼 기능

```sh
npm run build
```

정적 결과물은 `dist/client/`에, Sites용 최소 Worker 진입점은
`dist/server/index.js`에 생성됩니다.

## 확인된 경계

Mastro 코어는 의도적으로 아주 작습니다. JSX, 이미지 파이프라인, CSS 스코프,
클라이언트 hydration, HMR, 배포 어댑터를 기본 제공하지 않습니다. 필요한 것은
웹 표준이나 별도 패키지로 직접 조합해야 합니다. 이 사이트의 상호작용도 Mastro가
hydrate한 것이 아니라 `/northstar.client.js`를 명시적으로 내려보낸 것입니다.

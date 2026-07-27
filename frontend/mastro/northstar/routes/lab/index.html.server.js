import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../../components/site.js";

const experiments = [
  ["01", "Escaped HTML", "보간된 문자열은 기본적으로 이스케이프됩니다.", "html`<p>${userInput}</p>`"],
  ["02", "Async rendering", "Promise와 AsyncIterable을 템플릿 안에서 스트리밍할 수 있습니다.", "html`${await serverValue}`"],
  ["03", "Dynamic routes", "URLPattern과 getStaticPaths로 SSR과 SSG를 같은 경로에서 다룹니다.", "routes/stories/[slug]"],
  ["04", "Standard responses", "전용 API 대신 웹 표준 Request와 Response를 그대로 사용합니다.", "GET(req) → Response"],
  ["05", "Static assets", "라우트 폴더의 파일은 가공 없이 그대로 전달할 수 있습니다.", "/northstar.client.js"],
  ["06", "Native transitions", "페이지 전환은 프레임워크 런타임 대신 브라우저 기능에 맡깁니다.", "@view-transition"],
];

export const GET = () =>
  htmlToResponse(
    Layout({
      title: "Field lab — Northstar",
      description: "Mastro가 잘하는 것과 의도적으로 하지 않는 것을 확인하는 여섯 개의 실험.",
      path: "/lab/",
      children: html`
        <section class="lab-hero shell">
          <a href="/" class="back">← Northstar journal</a>
          <div>
            <p class="eyebrow">Field lab / Mastro 0.8</p>
            <h1>프레임워크의<br><em>경계선에서.</em></h1>
          </div>
          <p>Mastro가 잘하는 것, 웹 플랫폼에 맡기는 것, 그리고 우리가 직접 만들어야 하는 것을 한 장에 펼쳤습니다.</p>
        </section>

        <section class="experiment-list shell">
          ${experiments.map(([number, title, copy, code]) => html`
            <article>
              <span>${number}</span>
              <div><h2>${title}</h2><p>${copy}</p></div>
              <code>${code}</code>
            </article>
          `)}
        </section>

        <section class="api-playground">
          <div class="shell api-grid">
            <div>
              <p class="eyebrow">Live endpoint</p>
              <h2>페이지가 아닌<br>JSON도 같은 라우트.</h2>
              <p>버튼을 누르면 이 사이트가 빌드한 API 응답을 브라우저에서 직접 읽습니다. JavaScript가 실패해도 원본 링크는 남습니다.</p>
              <div class="api-actions">
                <button type="button" data-fetch-api>Fetch /api/stories.json</button>
                <a href="/api/stories.json">Open raw <span>↗</span></a>
              </div>
            </div>
            <pre aria-live="polite" data-api-output><code>{
  "status": "waiting",
  "hint": "Fetch the route"
}</code></pre>
          </div>
        </section>

        <section class="limits shell">
          <header>
            <p class="eyebrow">The honest limits</p>
            <h2>작다는 건<br>선택이 남는다는 것.</h2>
          </header>
          <div class="limit-columns">
            <article>
              <span>Built in</span>
              <ul>
                <li>파일 및 프로그래밍 방식 라우팅</li>
                <li>SSG와 서버 렌더링</li>
                <li>안전한 HTML tagged template</li>
                <li>비동기 스트리밍</li>
                <li>표준 HTTP 응답</li>
              </ul>
            </article>
            <article>
              <span>You choose</span>
              <ul>
                <li>클라이언트 상태와 hydration</li>
                <li>CSS 스코프와 디자인 시스템</li>
                <li>이미지 처리와 번들링</li>
                <li>인증, 데이터베이스, 캐시</li>
                <li>HMR과 배포 플랫폼 어댑터</li>
              </ul>
            </article>
          </div>
          <p class="limit-conclusion">그래서 Mastro의 한계는 “못 한다”보다 “대신 결정해주지 않는다”에 가깝습니다. 콘텐츠 중심 MPA에서는 강점이고, 복잡한 SPA에서는 직접 조립해야 할 영역이 빠르게 늘어납니다.</p>
        </section>
      `,
    }),
  );

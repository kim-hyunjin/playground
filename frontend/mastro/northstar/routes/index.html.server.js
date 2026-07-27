import { html, htmlToResponse } from "@mastrojs/mastro";
import { categories, stories } from "../data/stories.js";
import { FeatureCard, Layout, StoryCard } from "../components/site.js";

const buildStamp = new Promise((resolve) => {
  const stamp = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date());
  resolve(html`<span>Rendered ${stamp}</span>`);
});

export const GET = () =>
  htmlToResponse(
    Layout({
      children: html`
        <section class="hero shell">
          <div class="hero-kicker">
            <span>Independent journal / Seoul</span>
            ${buildStamp}
          </div>
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="hero-issue">ISSUE 06 — THE WEB, UNCOVERED</p>
              <h1>얼마나 멀리<br><em>가볍게</em> 갈 수 있을까.</h1>
              <p class="hero-dek">프레임워크가 숨기던 것들을 걷어내고, HTML과 CSS, 작은 JavaScript로 만든 여섯 개의 장면.</p>
              <a href="#dispatches" class="text-link">Explore the issue <span>↓</span></a>
            </div>
            <div class="hero-observatory" data-observatory>
              <div class="observatory-orbit orbit-one"></div>
              <div class="observatory-orbit orbit-two"></div>
              <div class="observatory-sun"></div>
              <div class="observatory-land land-a"></div>
              <div class="observatory-land land-b"></div>
              <div class="observatory-readout">
                <span>37.5665° N</span>
                <span data-local-time>SEO 20:26:14</span>
              </div>
              <p>Move your pointer<br>to shift the horizon.</p>
            </div>
          </div>
          <div class="hero-stats" aria-label="프로젝트 요약">
            <div><strong>06</strong><span>generated stories</span></div>
            <div><strong>04</strong><span>route types</span></div>
            <div><strong>01</strong><span>client module</span></div>
            <div><strong>00</strong><span>bundlers</span></div>
          </div>
        </section>

        <section class="dispatches shell" id="dispatches">
          <header class="section-head">
            <div>
              <p class="eyebrow">Dispatches / 2026</p>
              <h2>데이터는 하나,<br><em>경로는 여섯.</em></h2>
            </div>
            <p>같은 객체 배열에서 카드, 상세 페이지와 JSON 응답이 만들어집니다. 아래 필터만 브라우저에서 점진적으로 동작합니다.</p>
          </header>
          <div class="filter-bar" role="group" aria-label="기록 필터" data-filters>
            ${categories.map((category, index) => html`
              <button type="button" data-filter="${category.value}" aria-pressed="${index === 0 ? "true" : "false"}">
                ${category.label}
              </button>
            `)}
            <span class="filter-count"><b data-visible-count>${stories.length}</b> signals</span>
          </div>
          <div class="story-grid">${stories.map(StoryCard)}</div>
          <p class="empty-state" data-empty-state hidden>이 조건에 맞는 기록이 없습니다.</p>
        </section>

        <section class="field-lab" id="field-lab">
          <div class="shell">
            <header class="lab-head">
              <p class="eyebrow">Under the surface</p>
              <h2>작은 코어 위에<br>필요한 만큼만.</h2>
              <a href="/lab/" class="round-link" aria-label="필드 랩 자세히 보기">↗</a>
            </header>
            <div class="feature-grid">
              ${FeatureCard({
                number: "01",
                label: "Server composition",
                title: "함수와 Promise가 컴포넌트가 됩니다.",
                copy: "별도 문법 없이 tagged template에 배열과 비동기 값을 조합합니다.",
                code: "html`${stories.map(StoryCard)}`",
              })}
              ${FeatureCard({
                number: "02",
                label: "Dynamic SSG",
                title: "하나의 파일이 여섯 경로가 됩니다.",
                copy: "getStaticPaths가 데이터에서 상세 URL을 만들고 빌드 시 완성된 HTML로 기록합니다.",
                code: "getStaticPaths() → /stories/:slug/",
              })}
              ${FeatureCard({
                number: "03",
                label: "Everything is a route",
                title: "HTML과 JSON이 같은 언어를 씁니다.",
                copy: "표준 Response 하나로 페이지, API, CSS나 이미지까지 같은 방식으로 다룹니다.",
                code: "GET(req) → new Response(body)",
              })}
              ${FeatureCard({
                number: "04",
                label: "Progressive JavaScript",
                title: "필요한 순간에만 브라우저를 깨웁니다.",
                copy: "검색, 필터와 포인터 효과는 명시적인 ES module 하나뿐입니다.",
                code: '<script type="module">',
              })}
            </div>
          </div>
        </section>

        <section class="manifesto shell">
          <div class="manifesto-index">06—26</div>
          <blockquote>
            “Mastro가 더 많이 해주는 것이 아니라,<br>
            <em>웹이 이미 할 수 있는 것을</em><br>
            다시 보게 한다.”
          </blockquote>
          <div class="manifesto-foot">
            <p>코어는 라우팅과 렌더링에 집중합니다. 상태 관리, hydration, 이미지 최적화, CSS 스코프가 필요하다면 직접 선택해야 합니다.</p>
            <a href="/lab/">Explore the honest limits <span>→</span></a>
          </div>
        </section>

        <section class="newsletter shell">
          <p class="eyebrow">A letter, occasionally</p>
          <h2>좋은 이야기는<br><em>천천히 도착합니다.</em></h2>
          <form action="/thanks/" method="get">
            <label>
              <span class="sr-only">이메일</span>
              <input required type="email" name="email" placeholder="your@email.com">
            </label>
            <button>Subscribe <span>→</span></button>
          </form>
          <p class="form-note">브라우저 JavaScript가 꺼져 있어도 이 폼은 다음 페이지로 이동합니다.</p>
        </section>
      `,
    }),
  );

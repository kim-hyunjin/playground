import { html } from "@mastrojs/mastro";

export const Layout = ({
  title = "Northstar — Mastro field test",
  description = "웹의 기본기만으로 어디까지 갈 수 있을까. Mastro로 만든 독립 저널.",
  path = "/",
  children,
}) => html`
  <!doctype html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="${description}">
      <meta name="theme-color" content="#eeeade">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:type" content="website">
      <meta property="og:image" content="/og.jpg">
      <meta name="twitter:card" content="summary_large_image">
      <link rel="icon" href="/favicon.svg" type="image/svg+xml">
      <link rel="stylesheet" href="/global.css">
      <script type="module" src="/northstar.client.js"></script>
      <title>${title}</title>
    </head>
    <body data-path="${path}">
      <a class="skip-link" href="#main">본문으로 건너뛰기</a>
      <header class="site-header shell">
        <a class="brand" href="/" aria-label="Northstar 홈">
          <span class="brand-mark">✦</span>
          <span>NORTHSTAR</span>
        </a>
        <p class="edition">Mastro field test <span>№ 02</span></p>
        <nav aria-label="주요 메뉴">
          <a href="/#dispatches">Dispatches</a>
          <a href="/lab/">Field lab</a>
          <button class="search-trigger" type="button" data-open-search>
            Search <span aria-hidden="true">⌘K</span>
          </button>
        </nav>
        <button class="menu" type="button" aria-label="메뉴 열기" data-menu-toggle>
          <i></i><i></i>
        </button>
      </header>
      <main id="main">${children}</main>
      <footer class="footer shell">
        <a class="brand" href="/"><span class="brand-mark">✦</span> NORTHSTAR</a>
        <p>Built close to the platform.<br>Published slowly, from Seoul.</p>
        <p class="footer-meta">Mastro 0.8 · 2026</p>
      </footer>
      <dialog class="search-dialog" data-search-dialog>
        <form method="dialog" class="dialog-head">
          <label for="site-search">이야기 찾기</label>
          <button aria-label="검색 닫기">Esc</button>
        </form>
        <input id="site-search" type="search" placeholder="장소, 계절, 단어를 입력하세요" autocomplete="off" data-site-search>
        <div class="search-results" data-search-results aria-live="polite">
          <p>검색어를 입력하면 6개의 정적 페이지를 즉시 찾아봅니다.</p>
        </div>
      </dialog>
    </body>
  </html>
`;

export const StoryCard = (story) => html`
  <article
    class="story-card"
    data-story-card
    data-category="${story.category}"
    data-search="${story.title} ${story.eyebrow} ${story.description} ${story.season}"
    style="--accent:${story.accent};--card-ink:${story.ink}"
  >
    <a href="/stories/${story.slug}/">
      <div class="story-visual" aria-hidden="true">
        <span class="visual-index">${story.index}</span>
        <span class="visual-coord">${story.coordinates}</span>
        <span class="story-shape"></span>
        <span class="story-orbit"></span>
      </div>
      <div class="story-copy">
        <p class="eyebrow">${story.eyebrow}</p>
        <h3>${story.title}</h3>
        <p>${story.description}</p>
        <div class="story-meta">
          <span>${story.season}</span>
          <span>${story.readTime}</span>
          <b aria-hidden="true">↗</b>
        </div>
      </div>
    </a>
  </article>
`;

export const FeatureCard = ({ number, label, title, copy, code }) => html`
  <article class="feature-card">
    <div class="feature-number">${number}</div>
    <div>
      <p class="eyebrow">${label}</p>
      <h3>${title}</h3>
      <p>${copy}</p>
      <code>${code}</code>
    </div>
  </article>
`;

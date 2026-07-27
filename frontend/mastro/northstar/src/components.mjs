import { html } from 'mastro';

export const StoryCard = (story, index) => html`
  <a class="story-card" href="/stories/${story.slug}/" style="--accent:${story.accent}">
    <div class="visual" aria-hidden="true"><span class="orb"></span><span class="line"></span><b>0${index + 1}</b></div>
    <div class="story-copy"><p class="eyebrow">${story.eyebrow}</p><h3>${story.title}</h3><p>${story.description}</p><span class="read">Read story <b>↗</b></span></div>
  </a>`;

export const Layout = ({ title = 'Northstar — Stories for slower days', description = '천천히 보고, 오래 기억하는 사람들을 위한 독립 저널.', content }) => html`
  <!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description" content="${description}"><meta name="theme-color" content="#f1eee5"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/global.css"><title>${title}</title></head>
  <body><header class="site-header shell"><a class="brand" href="/"><span>✦</span> NORTHSTAR</a><nav><a href="/#stories">Stories</a><a href="/#manifesto">Manifesto</a></nav><button class="menu" aria-label="메뉴 열기"><i></i><i></i></button></header><main>${content}</main><footer class="footer shell"><a class="brand" href="/"><span>✦</span> NORTHSTAR</a><p>Notes for curious minds.<br>Published slowly, from Seoul.</p><p class="copyright">© 2026 Northstar</p></footer></body></html>`;

import { html } from 'mastro';
import { Layout } from './components.mjs';

export const StoryPage = (story) => Layout({ title: `${story.title} — Northstar`, description: story.description, content: html`
  <article class="article shell" style="--accent:${story.accent}"><a href="/#stories" class="back">← All stories</a><header><p class="eyebrow">${story.eyebrow}</p><h1>${story.title}</h1><p class="dek">${story.description}</p><div class="meta"><time>${story.date}</time><span>${story.readTime}</span></div></header><div class="article-art" aria-hidden="true"><i></i><b>✦</b></div><div class="prose"><h2>빛이 머무는 시간</h2>${story.body.map((paragraph) => html`<p>${paragraph}</p>`)}<blockquote>좋은 여행은 더 멀리 가는 일이 아니라, 지금 있는 곳을 더 자세히 보는 일인지도 모른다.</blockquote></div></article>` });

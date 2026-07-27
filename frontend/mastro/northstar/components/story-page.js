import { html } from "@mastrojs/mastro";
import { Layout } from "./site.js";

export const StoryPage = (story) =>
  Layout({
    title: `${story.title} — Northstar`,
    description: story.description,
    path: `/stories/${story.slug}/`,
    children: html`
      <article class="article shell" style="--accent:${story.accent};--article-ink:${story.ink}">
        <a href="/#dispatches" class="back">← All dispatches</a>
        <header class="article-header">
          <div class="article-heading">
            <p class="eyebrow">${story.eyebrow}</p>
            <h1>${story.title}</h1>
            <p class="dek">${story.description}</p>
          </div>
          <dl class="article-data">
            <div><dt>Coordinates</dt><dd>${story.coordinates}</dd></div>
            <div><dt>Observed</dt><dd>${story.date}</dd></div>
            <div><dt>Air</dt><dd>${story.temperature}</dd></div>
            <div><dt>Reading time</dt><dd>${story.readTime}</dd></div>
          </dl>
        </header>
        <div class="article-art" aria-hidden="true">
          <span class="article-sun"></span>
          <span class="article-horizon"></span>
          <span class="article-star">✦</span>
          <p>${story.coordinates} / FIELD ${story.index}</p>
        </div>
        <div class="article-body">
          <aside>
            <p class="eyebrow">Field ${story.index}</p>
            <p>${story.categoryLabel}에 관한 관찰<br>${story.season}, 2026</p>
          </aside>
          <div class="prose">
            <p class="lead">${story.body[0]}</p>
            ${story.body.slice(1).map((paragraph) => html`<p>${paragraph}</p>`)}
            <blockquote>더 멀리 가는 일보다, 지금 있는 곳을 더 자세히 보는 일.</blockquote>
          </div>
        </div>
        <nav class="article-next" aria-label="다른 이야기">
          <span>Next signal</span>
          <a href="/#dispatches">모든 기록으로 돌아가기 <b>→</b></a>
        </nav>
      </article>
    `,
  });

import { html } from 'mastro';
import { Layout } from '../components.mjs';

export default () => Layout({ title: '구독 완료 — Northstar', content: html`<section class="newsletter shell confirmation"><p class="eyebrow">Welcome aboard</p><h2>다음 이야기를<br><em>기다려 주세요.</em></h2><p>브라우저 JavaScript 없이도 이 페이지까지 잘 도착했습니다.</p><a class="round-link" href="/">←</a></section>` });

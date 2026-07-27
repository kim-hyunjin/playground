import { html } from 'mastro';
import { Layout, StoryCard } from '../components.mjs';
import { stories } from '../data/stories.mjs';

export default () => Layout({ content: html`
  <section class="hero shell"><div class="hero-kicker"><span>Independent journal</span><span>Seoul · 37.5665° N</span></div><h1>Stay curious.<br><em>Move slowly.</em></h1><div class="hero-bottom"><p>빠르게 지나치는 것들 사이에서<br>오래 남을 이야기를 발견합니다.</p><a href="#stories" class="round-link">↓</a></div><div class="hero-art"><div class="sun"></div><div class="land land-one"></div><div class="land land-two"></div><div class="grain"></div><span>ISSUE 04 — THE ART OF NOTICING</span></div></section>
  <section class="stories shell" id="stories"><header class="section-head"><div><p class="eyebrow">Latest dispatches</p><h2>멀리서 도착한<br><em>세 개의 장면</em></h2></div><p>장소와 사람, 계절에 관한<br>짧고 깊은 기록을 전합니다.</p></header><div class="story-grid">${stories.map(StoryCard)}</div></section>
  <section class="manifesto" id="manifesto"><div class="shell manifesto-inner"><p class="eyebrow">Our manifesto</p><blockquote>“좋은 이야기는 세상을<br>더 크게 만들기보다,<br><em>더 자세히 보게 한다.</em>”</blockquote><div class="manifesto-foot"><span>01</span><p>Northstar는 속보 대신 여운을, 정보 대신 감각을 수집합니다. 화면을 닫은 뒤에도 남는 이야기를 만듭니다.</p><span>03</span></div></div></section>
  <section class="newsletter shell"><p class="eyebrow">A letter, occasionally</p><h2>좋은 이야기는<br><em>천천히 도착합니다.</em></h2><form action="/thanks/" method="get"><label><span class="sr-only">이메일</span><input required type="email" name="email" placeholder="your@email.com"></label><button>Subscribe <span>→</span></button></form><p class="form-note">한 달에 한 번, 광고 없이. 언제든 떠날 수 있어요.</p></section>` });

import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../../components/site.js";

export const GET = () =>
  htmlToResponse(
    Layout({
      title: "구독 완료 — Northstar",
      path: "/thanks/",
      children: html`
        <section class="confirmation shell">
          <p class="eyebrow">Signal received</p>
          <h1>다음 이야기를<br><em>기다려 주세요.</em></h1>
          <p>브라우저 JavaScript 없이도 표준 HTML 폼이 이 경로까지 데려왔습니다.</p>
          <a class="round-link" href="/" aria-label="홈으로 돌아가기">←</a>
        </section>
      `,
    }),
  );

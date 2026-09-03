/**
 * 코드 블록과 인라인 코드를 제거한다. `$1`, `"$name"` 처럼 코드 안에서 쓰인
 * 달러 기호를 수식으로 오인하지 않기 위한 전처리다.
 */
function stripCode(markdown: string): string {
  return markdown
    .replace(/^ {0,3}(`{3,}|~{3,})[\s\S]*?^ {0,3}\1[^\n]*$/gm, '')
    .replace(/(`+)[^\n]*?\1/g, '');
}

/**
 * 본문에 `$...$` 또는 `$$...$$` 형태의 LaTeX 수식이 있는지 판별한다.
 * 수식이 있는 글에서만 KaTeX 스타일시트를 불러오기 위해 사용한다.
 */
export function containsMath(markdown: string): boolean {
  const text = stripCode(markdown);
  return /\$\$[\s\S]+?\$\$/.test(text) || /\$[^$\n]+\$/.test(text);
}

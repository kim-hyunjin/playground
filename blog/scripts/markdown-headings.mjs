/**
 * 문자열 또는 문자열 배열로 저장된 Notebook 셀 소스를 하나의 문자열로 합친다.
 */
export const joinNotebookSource = (source) =>
  Array.isArray(source) ? source.join('') : (source ?? '');

/**
 * Markdown 한 줄이 ATX 제목인지 판별하고 제목 깊이, 줄 번호, 텍스트를 추출한다.
 */
function headingFromLine(line, lineNumber) {
  const match = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/);
  if (!match) return null;
  return {
    depth: match[1].length,
    line: lineNumber,
    text: (match[2] ?? '').trim().replace(/[ \t]+#+[ \t]*$/, ''),
  };
}

/**
 * 코드 펜스 내부를 제외한 Markdown의 ATX 및 Setext 제목을 문서 순서대로 수집한다.
 */
export function markdownHeadings(value) {
  const lines = value.split('\n');
  const headings = [];
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!fence) {
      const openingFence = line.match(/^ {0,3}(`{3,}|~{3,})/);
      if (openingFence) {
        fence = {
          marker: openingFence[1][0],
          size: openingFence[1].length,
        };
        continue;
      }
    } else {
      const closingFence = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (
        closingFence &&
        closingFence[1][0] === fence.marker &&
        closingFence[1].length >= fence.size
      ) {
        fence = null;
      }
      continue;
    }

    const atxHeading = headingFromLine(line, index + 1);
    if (atxHeading) {
      headings.push(atxHeading);
      continue;
    }

    const setextMarker = line.match(/^ {0,3}(=+|-+)[ \t]*$/);
    const previous = lines[index - 1]?.trim();
    if (setextMarker && previous) {
      headings.push({
        depth: setextMarker[1][0] === '=' ? 1 : 2,
        line: index,
        text: previous,
      });
    }
  }
  return headings;
}

/**
 * Notebook 메타데이터나 첫 번째 H1에서 제목을 찾고, 없으면 대체 제목을 반환한다.
 */
export function titleFromNotebook(notebook, fallback) {
  const metadataTitle = notebook.metadata?.title;
  if (typeof metadataTitle === 'string' && metadataTitle.trim()) {
    return metadataTitle.trim();
  }

  for (const cell of notebook.cells ?? []) {
    if (cell.cell_type !== 'markdown') continue;
    const heading = markdownHeadings(joinNotebookSource(cell.source)).find(
      ({ depth }) => depth === 1,
    );
    if (heading) return heading.text.replaceAll('*', '').trim();
  }
  return fallback;
}

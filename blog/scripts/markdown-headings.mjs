export const joinNotebookSource = (source) =>
  Array.isArray(source) ? source.join('') : (source ?? '');

function headingFromLine(line, lineNumber) {
  const match = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/);
  if (!match) return null;
  return {
    depth: match[1].length,
    line: lineNumber,
    text: (match[2] ?? '').trim().replace(/[ \t]+#+[ \t]*$/, ''),
  };
}

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

export function titleFromNotebook(notebook, fallback) {
  for (const cell of notebook.cells ?? []) {
    if (cell.cell_type !== 'markdown') continue;
    const heading = markdownHeadings(joinNotebookSource(cell.source)).find(
      ({ depth }) => depth === 1,
    );
    if (heading) return heading.text.replaceAll('*', '').trim();
  }
  return fallback;
}

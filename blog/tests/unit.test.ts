import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Element } from 'hast';
import matter from 'gray-matter';
import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { convertNotebook } from '../scripts/convert-notebooks.ts';
import { markdownHeadings, titleFromNotebook } from '../scripts/markdown-headings.ts';
import { parseNotebook } from '../scripts/notebook-types.ts';
import {
  buildTopicTree,
  flattenTopicTree,
  topicBreadcrumbsFromPath,
  topicPathFromId,
} from '../src/lib/topics';
import {
  addCodeLanguageLabel,
  codeLanguageLabel,
} from '../src/lib/code-language-label.ts';
import { containsMath } from '../src/lib/math.ts';
import { transformCjkStrong } from '../src/lib/remark-cjk-strong.ts';
import { joinBase, slugifySegment } from '../src/lib/url';

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return nested.flat();
}

describe('URL helpers', () => {
  it('joins the GitHub Pages base without duplicate slashes', () => {
    expect(joinBase('/playground/', '/backend/post.pub/')).toBe('/playground/backend/post.pub/');
    expect(joinBase('playground', '')).toBe('/playground/');
  });

  it('normalizes category and Korean tag segments', () => {
    expect(slugifySegment('Design & Architecture')).toBe('design-and-architecture');
    expect(slugifySegment('데이터 베이스')).toBe('데이터-베이스');
  });
});

describe('folder topic hierarchy', () => {
  const topics = buildTopicTree([
    { id: 'backend/backend-engineering/asynchronous-processing/worker.pub' },
    { id: 'backend/backend-engineering/asynchronous-processing/queue.pub' },
    { id: 'backend/backend-engineering/communications/http.pub' },
    { id: 'backend/database/database-basics.pub' },
  ]);

  it('derives a post topic path from its physical folder', () => {
    expect(topicPathFromId('backend/database/indexes-storage/b-tree.pub.md')).toBe(
      'backend/database/indexes-storage',
    );
  });

  it('aggregates descendant and direct post counts independently', () => {
    const flattened = flattenTopicTree(topics);
    expect(flattened.find((topic) => topic.path === 'backend')).toMatchObject({
      count: 4,
      directCount: 0,
    });
    expect(
      flattened.find(
        (topic) => topic.path === 'backend/backend-engineering/asynchronous-processing',
      ),
    ).toMatchObject({ count: 2, directCount: 2 });
  });

  it('builds human-readable breadcrumbs for every folder level', () => {
    expect(
      topicBreadcrumbsFromPath(
        'backend/backend-engineering/asynchronous-processing',
      ).map(({ name }) => name),
    ).toEqual(['Backend', 'Backend Engineering', 'Asynchronous Processing']);
  });
});

describe('content contract', () => {
  it('keeps an MDX build fixture', async () => {
    const files = await walk(resolve(process.cwd(), 'content'));
    expect(files.some((file) => file.endsWith('component-fixture.pub.mdx'))).toBe(true);
  });

  it('keeps the Notebook converter non-executing', async () => {
    const source = await readFile(resolve(process.cwd(), 'scripts/convert-notebooks.ts'), 'utf8');
    expect(source).not.toMatch(/\b(jupyter|nbconvert|execute_request|execSync)\b/);
    expect(source).toContain('cell.outputs');
  });

  it('rejects malformed Notebook cell collections', () => {
    expect(() => parseNotebook({ cells: 'not-an-array' })).toThrow(
      'Notebook cells must be an array.',
    );
  });

  it('converts the Notebook fixture into publishable Markdown', async () => {
    const fixturePath = resolve(
      process.cwd(),
      'tests/fixtures/notebook-conversion.pub.ipynb',
    );
    const notebook = JSON.parse(await readFile(fixturePath, 'utf8'));
    const converted = await convertNotebook(notebook, {
      sourcePath: 'fixtures/notebook-conversion.pub.ipynb',
      date: '2026-07-29',
      sourceModified: '2026-07-29T00:00:00Z',
    });
    const { content, data } = matter(converted);

    expect(data).toMatchObject({
      title: 'Notebook 변환 Fixture',
      category: 'fixtures',
      categories: ['fixtures'],
      tags: ['notebook', 'python', 'fixtures'],
      sourcePath: 'fixtures/notebook-conversion.pub.ipynb',
      generator: 'notebook-converter-v1',
    });
    expect(content).toContain('## Fixture 섹션');
    expect(content).toContain('```python\nprint("fixture output")\n```');
    expect(content).toContain('```text\nfixture output\n```');
    expect(markdownHeadings(content)).toContainEqual({
      depth: 2,
      line: 1,
      text: 'Fixture 섹션',
    });
    expect(markdownHeadings(content)).not.toContainEqual(
      expect.objectContaining({ depth: 1 }),
    );
  });
});

describe('Markdown rendering', () => {
  it('adds a readable language label to fenced code blocks', () => {
    const pre: Element = {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [{ type: 'element', tagName: 'code', properties: {}, children: [] }],
    };

    addCodeLanguageLabel(pre, 'javascript');

    expect(codeLanguageLabel('cpp')).toBe('C++');
    expect(pre.children[0]).toEqual({
      type: 'element',
      tagName: 'span',
      properties: {
        ariaLabel: '코드 언어: JavaScript',
        className: ['code-language'],
        dataPagefindIgnore: '',
      },
      children: [{ type: 'text', value: 'JavaScript' }],
    });
  });

  it('does not label code blocks without a fence language', () => {
    const pre: Element = {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [{ type: 'element', tagName: 'code', properties: {}, children: [] }],
    };

    addCodeLanguageLabel(pre, 'plaintext');

    expect(pre.children).toHaveLength(1);
  });

  it('extracts the Notebook title for frontmatter from the first body H1', () => {
    const notebook = parseNotebook({
      cells: [
        {
          cell_type: 'markdown',
          source: ['## 머리말\n', '\n', '# **Notebook 제목**\n'],
        },
      ],
    });

    expect(titleFromNotebook(notebook, 'fallback-title')).toBe('Notebook 제목');
  });

  it('finds body H1s without treating fenced code comments as headings', () => {
    expect(
      markdownHeadings('## 정상 섹션\n\n~~~python\n# 코드 주석\n~~~\n\n# 잘못된 본문 H1'),
    ).toEqual([
      { depth: 2, line: 1, text: '정상 섹션' },
      { depth: 1, line: 7, text: '잘못된 본문 H1' },
    ]);
  });

  it('extracts and detects a setext Notebook title', () => {
    const notebook = parseNotebook({
      cells: [{ cell_type: 'markdown', source: ['Setext 제목\n', '===\n', '\n', '본문'] }],
    });
    const markdown = 'Setext 제목\n===\n\n본문';

    expect(titleFromNotebook(notebook, 'fallback-title')).toBe('Setext 제목');
    expect(markdownHeadings(markdown)).toEqual([{ depth: 1, line: 1, text: 'Setext 제목' }]);
  });

  it('restores strong emphasis before a Korean particle after punctuation', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: '처리량은 **전체 처리량(throughput)**을 뜻합니다.',
            },
          ],
        },
      ],
    };

    transformCjkStrong(tree);

    const paragraph = tree.children[0];
    expect(paragraph.type).toBe('paragraph');
    if (paragraph.type !== 'paragraph') throw new TypeError('Expected a paragraph node.');

    expect(paragraph.children).toEqual([
      { type: 'text', value: '처리량은 ' },
      {
        type: 'strong',
        children: [{ type: 'text', value: '전체 처리량(throughput)' }],
      },
      { type: 'text', value: '을 뜻합니다.' },
    ]);
  });
});

describe('LaTeX 수식 감지', () => {
  it('본문 문장 안의 인라인 수식과 블록 수식을 찾는다', () => {
    expect(containsMath('독립 변수 $x$를 사용합니다.')).toBe(true);
    expect(containsMath('- **수식:** $f(x) = \\frac{1}{1 + e^{-x}}$')).toBe(true);
    expect(containsMath('$$\n\\sum_{i=1}^{n} i\n$$')).toBe(true);
  });

  it('코드 블록과 인라인 코드 안의 달러 기호는 수식으로 보지 않는다', () => {
    expect(containsMath('```sql\nWHERE (created_at, id) < ($1, $2)\n```')).toBe(false);
    expect(containsMath('셸에서는 `"$BASE/api/posts/$ID"` 처럼 씁니다.')).toBe(false);
    expect(containsMath('가격은 $100 입니다.')).toBe(false);
  });
});

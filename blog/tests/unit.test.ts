import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildTopicTree,
  flattenTopicTree,
  topicBreadcrumbsFromPath,
  topicPathFromId,
} from '../src/lib/topics';
import codeLanguageLabelTransformer, {
  codeLanguageLabel,
} from '../src/lib/code-language-label.mjs';
import remarkCjkStrong from '../src/lib/remark-cjk-strong.mjs';
import remarkNormalizeDocumentHeadings from '../src/lib/remark-normalize-document-headings.mjs';
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
    const source = await readFile(resolve(process.cwd(), 'scripts/convert-notebooks.mjs'), 'utf8');
    expect(source).not.toMatch(/\b(jupyter|nbconvert|execute_request|execSync)\b/);
    expect(source).toContain('cell.outputs');
  });
});

describe('Markdown rendering', () => {
  it('adds a readable language label to fenced code blocks', () => {
    const pre = {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [{ type: 'element', tagName: 'code', properties: {}, children: [] }],
    };

    codeLanguageLabelTransformer.pre.call({ options: { lang: 'javascript' } }, pre);

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
    const pre = {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [{ type: 'element', tagName: 'code', properties: {}, children: [] }],
    };

    codeLanguageLabelTransformer.pre.call({ options: { lang: 'plaintext' } }, pre);

    expect(pre.children).toHaveLength(1);
  });

  it('removes the document title and demotes later top-level sections', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'heading', depth: 1, children: [{ type: 'text', value: '문서 제목' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '본문' }] },
        { type: 'heading', depth: 1, children: [{ type: 'text', value: '본문의 H1' }] },
      ],
    };

    remarkNormalizeDocumentHeadings()(tree);

    expect(tree.children).toHaveLength(2);
    expect(tree.children[0]).toMatchObject({ type: 'paragraph' });
    expect(tree.children[1]).toMatchObject({ type: 'heading', depth: 2 });
  });

  it('finds the document title after metadata and an introductory heading', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'mdxjsEsm', value: "import Callout from './Callout.astro'" },
        { type: 'heading', depth: 2, children: [{ type: 'text', value: '별책 부록' }] },
        { type: 'heading', depth: 1, children: [{ type: 'text', value: 'MDX 제목' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '본문' }] },
      ],
    };

    remarkNormalizeDocumentHeadings()(tree);

    expect(tree.children.map(({ type }) => type)).toEqual([
      'mdxjsEsm',
      'heading',
      'paragraph',
    ]);
    expect(tree.children[1]).toMatchObject({ type: 'heading', depth: 2 });
  });

  it('restores strong emphasis before a Korean particle after punctuation', () => {
    const tree = {
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

    remarkCjkStrong()(tree);

    expect(tree.children[0].children).toEqual([
      { type: 'text', value: '처리량은 ' },
      {
        type: 'strong',
        children: [{ type: 'text', value: '전체 처리량(throughput)' }],
      },
      { type: 'text', value: '을 뜻합니다.' },
    ]);
  });
});

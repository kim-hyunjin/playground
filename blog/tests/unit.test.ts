import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
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

describe('content contract', () => {
  it('keeps the expected source counts and an MDX build fixture', async () => {
    const files = await walk(resolve(process.cwd(), 'content'));
    expect(files.filter((file) => file.endsWith('.pub.md'))).toHaveLength(130);
    expect(files.filter((file) => file.endsWith('.pub.ipynb'))).toHaveLength(21);
    expect(files.some((file) => file.endsWith('component-fixture.pub.mdx'))).toBe(true);
  });

  it('keeps the Notebook converter non-executing', async () => {
    const source = await readFile(resolve(process.cwd(), 'scripts/convert-notebooks.mjs'), 'utf8');
    expect(source).not.toMatch(/\b(jupyter|nbconvert|execute_request|execSync)\b/);
    expect(source).toContain('cell.outputs');
  });
});

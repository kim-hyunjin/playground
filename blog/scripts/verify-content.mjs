import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import matter from 'gray-matter';
import { markdownHeadings } from './markdown-headings.mjs';

const root = process.cwd();
const sourceRoot = resolve(root, 'content');
const generatedRoot = resolve(root, 'src/content/generated');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return nested.flat();
}

const sources = await walk(sourceRoot);
const markdown = sources.filter((path) => /\.pub\.(md|mdx)$/.test(path));
const notebooks = sources.filter((path) => path.endsWith('.pub.ipynb'));
const generated = (await walk(generatedRoot)).filter((path) => path.endsWith('.pub.md'));
const errors = [];
const slugs = new Map();

const expectedNotebookOutputs = new Set(
  notebooks.map((path) => relative(sourceRoot, path).replace(/\.ipynb$/, '.md')),
);
const generatedNotebookOutputs = new Set(
  generated.map((path) => relative(generatedRoot, path)),
);
for (const path of expectedNotebookOutputs) {
  if (!generatedNotebookOutputs.has(path)) {
    errors.push(`Missing generated Notebook: ${path}`);
  }
}
for (const path of generatedNotebookOutputs) {
  if (!expectedNotebookOutputs.has(path)) {
    errors.push(`Unexpected generated Notebook: ${path}`);
  }
}

for (const [collection, base, files] of [
  ['posts', sourceRoot, markdown],
  ['notebooks', generatedRoot, generated],
]) {
  for (const path of files) {
    const { content, data } = matter(await readFile(path, 'utf8'));
    const id = relative(base, path).replace(/\.(md|mdx)$/, '');
    const existing = slugs.get(id);
    if (existing) errors.push(`Duplicate output path: ${id} (${existing}, ${path})`);
    slugs.set(id, `${collection}:${path}`);

    for (const field of ['title', 'date', 'category', 'tags', 'summary']) {
      if (data[field] === undefined || data[field] === '') {
        errors.push(`${relative(root, path)} is missing ${field}.`);
      }
    }
    if (!Array.isArray(data.tags) || data.tags.length === 0) {
      errors.push(`${relative(root, path)} must have at least one tag.`);
    }
    if (String(data.summary ?? '').length > 220) {
      errors.push(`${relative(root, path)} has a summary longer than 220 characters.`);
    }
    for (const heading of markdownHeadings(content).filter(({ depth }) => depth === 1)) {
      errors.push(
        `${relative(root, path)} has a body H1 on content line ${heading.line}: "${heading.text}". ` +
          'Use the frontmatter title and start body sections at ##.',
      );
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Verified ${markdown.length} Markdown/MDX posts and ${generated.length} generated Notebooks.`);

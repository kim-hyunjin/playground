import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import matter from 'gray-matter';
import { MARKDOWN_COUNT, NOTEBOOK_COUNT } from './config.mjs';

const root = process.cwd();

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

const sources = await walk(resolve(root, 'content'));
const markdown = sources.filter((path) => /\.pub\.(md|mdx)$/.test(path));
const notebooks = sources.filter((path) => path.endsWith('.pub.ipynb'));
const generated = (await walk(resolve(root, 'src/content/generated'))).filter((path) =>
  path.endsWith('.pub.md'),
);
const errors = [];
const slugs = new Map();

if (markdown.filter((path) => path.endsWith('.pub.md')).length !== MARKDOWN_COUNT) {
  errors.push(`Expected ${MARKDOWN_COUNT} Markdown posts.`);
}
if (notebooks.length !== NOTEBOOK_COUNT || generated.length !== NOTEBOOK_COUNT) {
  errors.push(`Expected ${NOTEBOOK_COUNT} source and generated Notebooks.`);
}

for (const [collection, base, files] of [
  ['posts', resolve(root, 'content'), markdown],
  ['notebooks', resolve(root, 'src/content/generated'), generated],
]) {
  for (const path of files) {
    const { data } = matter(await readFile(path, 'utf8'));
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
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Verified ${markdown.length} Markdown/MDX posts and ${generated.length} generated Notebooks.`);

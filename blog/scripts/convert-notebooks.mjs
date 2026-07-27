import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import sanitizeHtml from 'sanitize-html';
import { BASE_PATH } from './config.mjs';

const root = process.cwd();
const sourceRoot = resolve(root, 'content');
const generatedRoot = resolve(root, 'src/content/generated');
const assetRoot = resolve(root, 'public/notebook-assets');
const GENERATOR_VERSION = 'notebook-converter-v1';

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

const joinSource = (source) => (Array.isArray(source) ? source.join('') : (source ?? ''));

function titleFromNotebook(notebook, fallback) {
  for (const cell of notebook.cells ?? []) {
    if (cell.cell_type !== 'markdown') continue;
    const match = joinSource(cell.source).match(/^#\s+(.+)$/m);
    if (match) return match[1].replaceAll('*', '').trim();
  }
  return fallback;
}

function plainSummary(notebook, title) {
  const text = (notebook.cells ?? [])
    .filter((cell) => cell.cell_type === 'markdown')
    .map((cell) => joinSource(cell.source))
    .join('\n')
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return (text || `${title}의 코드와 저장된 실행 결과를 정리한 Notebook입니다.`).slice(0, 180);
}

function gitValue(path, format) {
  try {
    return execFileSync('git', ['log', '-1', `--format=${format}`, '--', relative(root, path)], {
      cwd: root,
      encoding: 'utf8',
    }).trim();
  } catch {
    return '';
  }
}

function normalizedCategory(sourcePath) {
  const first = sourcePath.split('/')[0];
  const names = {
    ai: 'AI',
    backend: 'Backend',
    frontend: 'Frontend',
    algorithms: 'Algorithms',
    blockchain: 'Blockchain',
    'design-architecture': 'Design & Architecture',
    language: 'Language',
    mobile: 'Mobile',
    security: 'Security',
  };
  return names[first] ?? first;
}

function safeHtml(value) {
  return sanitizeHtml(value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'figure',
      'figcaption',
      'details',
      'summary',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'title', 'aria-label'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      a: ['href', 'name', 'target', 'rel'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    disallowedTagsMode: 'discard',
  });
}

async function richOutput(output, altText) {
  const data = output.data ?? {};

  if (data['image/png']) {
    const encoded = joinSource(data['image/png']).replace(/\s+/g, '');
    const buffer = Buffer.from(encoded, 'base64');
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 20);
    const name = `${hash}.png`;
    await writeFile(resolve(assetRoot, name), buffer);
    return `![${altText}](${BASE_PATH}notebook-assets/${name})`;
  }

  if (data['text/html']) {
    return `<div class="notebook-html-output">\n${safeHtml(joinSource(data['text/html']))}\n</div>`;
  }

  const plain = joinSource(data['text/plain'] ?? output.text);
  if (!plain.trim()) return '';
  return `\`\`\`text\n${plain.replace(/\n$/, '')}\n\`\`\``;
}

function frontmatter(data) {
  const yamlArray = (values) => values.map((value) => `  - ${JSON.stringify(value)}`).join('\n');
  return [
    '---',
    `title: ${JSON.stringify(data.title)}`,
    `date: ${JSON.stringify(data.date)}`,
    `category: ${JSON.stringify(data.category)}`,
    'categories:',
    yamlArray(data.categories),
    'tags:',
    yamlArray(data.tags),
    `summary: ${JSON.stringify(data.summary)}`,
    `sourcePath: ${JSON.stringify(data.sourcePath)}`,
    `sourceModified: ${JSON.stringify(data.sourceModified)}`,
    `generator: ${JSON.stringify(GENERATOR_VERSION)}`,
    '---',
    '',
  ].join('\n');
}

await rm(generatedRoot, { recursive: true, force: true });
await rm(assetRoot, { recursive: true, force: true });
await mkdir(generatedRoot, { recursive: true });
await mkdir(assetRoot, { recursive: true });

const files = (await walk(sourceRoot)).filter((path) => path.endsWith('.pub.ipynb')).sort();
for (const sourceFile of files) {
  const sourcePath = relative(sourceRoot, sourceFile);
  const targetPath = sourcePath.replace(/\.ipynb$/, '.md');
  const targetFile = resolve(generatedRoot, targetPath);
  const notebook = JSON.parse(await readFile(sourceFile, 'utf8'));
  const fallbackTitle = sourcePath.split('/').at(-1).replace('.pub.ipynb', '').replaceAll('-', ' ');
  const title = titleFromNotebook(notebook, fallbackTitle);
  const category = normalizedCategory(sourcePath);
  const date = gitValue(sourceFile, '%cs') || '1970-01-01';
  const sourceModified = gitValue(sourceFile, '%cI') || `${date}T00:00:00Z`;
  const sections = [];

  for (const [cellIndex, cell] of (notebook.cells ?? []).entries()) {
    if (cell.cell_type === 'markdown') {
      const markdown = joinSource(cell.source).trim();
      if (markdown) sections.push(markdown);
      continue;
    }
    if (cell.cell_type !== 'code') continue;

    const code = joinSource(cell.source).replace(/\n$/, '');
    if (code) sections.push(`\`\`\`python\n${code}\n\`\`\``);

    for (const output of cell.outputs ?? []) {
      if (output.output_type === 'error') {
        const traceback = (output.traceback ?? []).join('\n').replace(/\x1b\[[0-9;]*m/g, '');
        sections.push(`\`\`\`text\n${traceback}\n\`\`\``);
        continue;
      }
      const rendered = await richOutput(output, `${title} 셀 ${cellIndex + 1} 출력`);
      if (rendered) sections.push(rendered);
    }
  }

  const metadata = {
    title,
    date,
    category,
    categories: sourcePath.split('/').slice(0, -1),
    tags: ['notebook', 'python', sourcePath.split('/')[0]],
    summary: plainSummary(notebook, title),
    sourcePath,
    sourceModified,
  };

  await mkdir(dirname(targetFile), { recursive: true });
  await writeFile(targetFile, `${frontmatter(metadata)}${sections.join('\n\n')}\n`);
}

console.log(`Converted ${files.length} Notebooks without executing cells.`);

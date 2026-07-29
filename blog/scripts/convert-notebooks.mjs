import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sanitizeHtml from 'sanitize-html';
import { BASE_PATH } from './config.mjs';
import { joinNotebookSource, titleFromNotebook } from './markdown-headings.mjs';

const root = process.cwd();
const sourceRoot = resolve(root, 'content');
const generatedRoot = resolve(root, 'src/content/generated');
const assetRoot = resolve(root, 'public/notebook-assets');
const GENERATOR_VERSION = 'notebook-converter-v1';

/**
 * 지정한 디렉터리를 재귀적으로 순회해 모든 파일의 절대 경로를 반환한다.
 */
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

/**
 * Notebook Markdown의 이미지 정렬 속성을 제거해 주변 요소와의 레이아웃 충돌을 방지한다.
 */
function normalizeMarkdown(value) {
  // Legacy Notebook HTML often floats linked badges with align="left".
  // The float collapses the parent paragraph and lets the following heading
  // intercept pointer events over the image.
  return value.replace(/(<img\b[^>]*?)\s+align=(["'])(?:left|right|center)\2([^>]*>)/gi, '$1$3');
}

/**
 * Notebook의 Markdown 셀에서 메타데이터에 사용할 짧은 일반 텍스트 요약을 만든다.
 */
function plainSummary(notebook, title) {
  const text = (notebook.cells ?? [])
    .filter((cell) => cell.cell_type === 'markdown')
    .map((cell) => joinNotebookSource(cell.source))
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

/**
 * 특정 파일의 최신 Git 커밋 정보를 요청한 형식으로 조회하고, 조회 실패 시 빈 문자열을 반환한다.
 */
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

/**
 * 소스 경로의 최상위 디렉터리명을 게시물에 표시할 표준 카테고리명으로 변환한다.
 */
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

/**
 * Notebook의 HTML 출력을 허용 목록 기준으로 정제해 안전하게 게시할 수 있는 HTML로 만든다.
 */
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

/**
 * Notebook의 이미지, HTML, 일반 텍스트 출력을 Markdown에 삽입할 문자열로 변환한다.
 * 이미지 출력은 해시 기반 파일명으로 별도 저장한다.
 */
async function richOutput(output, altText, outputAssetRoot) {
  const data = output.data ?? {};

  if (data['image/png']) {
    const encoded = joinNotebookSource(data['image/png']).replace(/\s+/g, '');
    const buffer = Buffer.from(encoded, 'base64');
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 20);
    const name = `${hash}.png`;
    await writeFile(resolve(outputAssetRoot, name), buffer);
    return `![${altText}](${BASE_PATH}notebook-assets/${name})`;
  }

  if (data['text/html']) {
    return `<div class="notebook-html-output">\n${safeHtml(joinNotebookSource(data['text/html']))}\n</div>`;
  }

  const plain = joinNotebookSource(data['text/plain'] ?? output.text);
  if (!plain.trim()) return '';
  return `\`\`\`text\n${plain.replace(/\n$/, '')}\n\`\`\``;
}

/**
 * 변환된 Notebook 문서에 삽입할 YAML frontmatter 문자열을 생성한다.
 */
function frontmatter(data) {
  /**
   * 문자열 배열을 YAML 블록 배열 형식으로 직렬화한다.
   */
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

/**
 * Notebook 객체의 Markdown, 코드, 저장된 실행 결과를 게시 가능한 Markdown 문서로 변환한다.
 */
export async function convertNotebook(
  notebook,
  {
    sourcePath,
    date = '1970-01-01',
    sourceModified = `${date}T00:00:00Z`,
    outputAssetRoot = assetRoot,
  },
) {
  const fallbackTitle = sourcePath.split('/').at(-1).replace('.pub.ipynb', '').replaceAll('-', ' ');
  const title = titleFromNotebook(notebook, fallbackTitle);
  const category = normalizedCategory(sourcePath);
  const sections = [];

  for (const [cellIndex, cell] of (notebook.cells ?? []).entries()) {
    if (cell.cell_type === 'markdown') {
      const markdown = normalizeMarkdown(joinNotebookSource(cell.source)).trim();
      if (markdown) sections.push(markdown);
      continue;
    }
    if (cell.cell_type !== 'code') continue;

    const code = joinNotebookSource(cell.source).replace(/\n$/, '');
    if (code) sections.push(`\`\`\`python\n${code}\n\`\`\``);

    for (const output of cell.outputs ?? []) {
      if (output.output_type === 'error') {
        const traceback = (output.traceback ?? []).join('\n').replace(/\x1b\[[0-9;]*m/g, '');
        sections.push(`\`\`\`text\n${traceback}\n\`\`\``);
        continue;
      }
      const rendered = await richOutput(
        output,
        `${title} 셀 ${cellIndex + 1} 출력`,
        outputAssetRoot,
      );
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

  return `${frontmatter(metadata)}${sections.join('\n\n')}\n`;
}

/**
 * content 아래의 공개 Notebook을 모두 찾아 생성 콘텐츠와 출력 자산으로 일괄 변환한다.
 */
export async function convertNotebooks() {
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
    const date = gitValue(sourceFile, '%cs') || '1970-01-01';
    const sourceModified = gitValue(sourceFile, '%cI') || `${date}T00:00:00Z`;
    const markdown = await convertNotebook(notebook, {
      sourcePath,
      date,
      sourceModified,
    });

    await mkdir(dirname(targetFile), { recursive: true });
    await writeFile(targetFile, markdown);
  }

  console.log(`Converted ${files.length} Notebooks without executing cells.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await convertNotebooks();
}

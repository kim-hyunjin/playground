import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { BASE_PATH, SITE_URL } from './config.mjs';

const root = process.cwd();
const dist = resolve(root, 'dist');
const errors = [];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

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

const required = [
  'index.html',
  '404.html',
  '.nojekyll',
  'pagefind/pagefind.js',
  'rss.xml',
  'robots.txt',
  'sitemap/index.html',
  'sitemap-0.xml',
  'sitemap-index.xml',
];
for (const file of required) {
  if (!(await exists(resolve(dist, file)))) errors.push(`Missing required output: ${file}`);
}

const htmlFiles = (await walk(dist)).filter((path) => path.endsWith('.html'));
for (const htmlFile of htmlFiles) {
  const source = await readFile(htmlFile, 'utf8');
  const scannableSource = source
    .replace(/<script([^>]*)>[\s\S]*?<\/script>/gi, '<script$1></script>')
    .replace(/<style([^>]*)>[\s\S]*?<\/style>/gi, '<style$1></style>')
    .replace(/<pre([^>]*)>[\s\S]*?<\/pre>/gi, '<pre$1></pre>');
  const label = relative(dist, htmlFile);
  const canonicals = [...source.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map(
    (match) => match[1],
  );

  if (label !== '404.html' && canonicals.length !== 1) {
    errors.push(`${label} must have exactly one canonical URL.`);
  }
  for (const canonical of canonicals) {
    if (!canonical.startsWith(SITE_URL) || canonical.includes('/playground/playground/')) {
      errors.push(`${label} has an invalid canonical URL: ${canonical}`);
    }
  }

  if (/<aside class="toc"[\s\S]*?<a[^>]*>[^<]*#<\/a>/.test(source)) {
    errors.push(`${label} has a table-of-contents label ending in "#".`);
  }

  for (const match of scannableSource.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (
      !raw ||
      raw.startsWith('#') ||
      /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(raw)
    ) {
      continue;
    }

    if (raw.startsWith('/') && !raw.startsWith(BASE_PATH)) {
      errors.push(`${label} has an origin-root path without the base: ${raw}`);
      continue;
    }

    const withoutHash = raw.split('#')[0].split('?')[0];
    if (!withoutHash) continue;
    const localPath = withoutHash.startsWith(BASE_PATH)
      ? resolve(dist, withoutHash.slice(BASE_PATH.length))
      : resolve(dirname(htmlFile), withoutHash);
    const candidates = extname(localPath)
      ? [localPath]
      : [localPath, resolve(localPath, 'index.html'), `${localPath}.html`];
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
      errors.push(`${label} links to a missing local file: ${raw}`);
    }
  }
}

for (const file of ['rss.xml', 'sitemap-index.xml']) {
  const source = await readFile(resolve(dist, file), 'utf8');
  if (source.includes('/playground/playground/')) {
    errors.push(`${file} contains a duplicated base path.`);
  }
  if (!source.includes(SITE_URL)) {
    errors.push(`${file} does not contain the production site URL.`);
  }
}

const sitemapIndex = await readFile(resolve(dist, 'sitemap-index.xml'), 'utf8');
if (!sitemapIndex.includes(`${SITE_URL}sitemap-0.xml`)) {
  errors.push('sitemap-index.xml does not reference sitemap-0.xml.');
}

if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} Astro HTML files.`);

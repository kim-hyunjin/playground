import { execFileSync, spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

if (!resolve(root, 'package.json').endsWith('/blog/package.json')) {
  throw new Error('Run publish from the blog directory.');
}
if (!process.version.startsWith('v22.')) {
  throw new Error(`Node 22 is required; found ${process.version}.`);
}

const pnpmVersion = execFileSync('corepack', ['pnpm', '--version'], { encoding: 'utf8' }).trim();
if (pnpmVersion !== manifest.packageManager.split('@').at(-1)) {
  throw new Error(`pnpm ${manifest.engines.pnpm} is required; found ${pnpmVersion}.`);
}

if (!dryRun) {
  const status = execFileSync('git', ['status', '--porcelain', '--untracked-files=all', '--', '.'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  if (status) {
    throw new Error('Commit all blog/ changes before publishing.');
  }
}

const build = spawnSync('corepack', ['pnpm', 'run', 'build'], {
  cwd: root,
  encoding: 'utf8',
  stdio: 'inherit',
});
if (build.status !== 0) process.exit(build.status ?? 1);

if (dryRun) {
  console.log('Dry run passed. No branch or remote was changed.');
  process.exit(0);
}

execFileSync('git', ['fetch', 'origin', 'gh-pages'], { cwd: root, stdio: 'inherit' });
const sourceSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const publish = spawnSync(
  'corepack',
  [
    'pnpm',
    'exec',
    'gh-pages',
    '--dist',
    'dist',
    '--branch',
    'gh-pages',
    '--dotfiles',
    '--message',
    `Deploy ${sourceSha}`,
  ],
  { cwd: root, stdio: 'inherit' },
);
if (publish.status !== 0) process.exit(publish.status ?? 1);

console.log(`Published dist/ from ${sourceSha} to gh-pages.`);

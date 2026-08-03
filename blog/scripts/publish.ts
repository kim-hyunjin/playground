import { execFileSync, spawnSync } from 'node:child_process';
import { basename, resolve } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');

if (basename(root) !== 'blog') {
  throw new Error('Run publish from the blog directory.');
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

const buildCommand = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'pnpm';
const buildArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'pnpm run build'] : ['run', 'build'];
const build = spawnSync(buildCommand, buildArgs, {
  cwd: root,
  encoding: 'utf8',
  stdio: 'inherit',
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

if (dryRun) {
  console.log('Dry run passed. No branch or remote was changed.');
  process.exit(0);
}

execFileSync('git', ['fetch', 'origin', 'gh-pages'], { cwd: root, stdio: 'inherit' });
const sourceSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const ghPages = resolve(root, 'node_modules/gh-pages/bin/gh-pages.js');
const publish = spawnSync(
  process.execPath,
  [
    ghPages,
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
if (publish.error) throw publish.error;
if (publish.status !== 0) process.exit(publish.status ?? 1);

console.log(`Published dist/ from ${sourceSha} to gh-pages.`);

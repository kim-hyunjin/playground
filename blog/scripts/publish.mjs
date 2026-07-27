import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');

if (!resolve(root, 'package.json').endsWith('/blog/package.json')) {
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

const build = spawnSync('npm', ['run', 'build'], {
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
const ghPages = resolve(
  root,
  'node_modules/.bin',
  process.platform === 'win32' ? 'gh-pages.cmd' : 'gh-pages',
);
const publish = spawnSync(
  ghPages,
  [
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

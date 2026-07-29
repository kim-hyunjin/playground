import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const allowedTargets = [
  resolve(root, 'dist'),
  resolve(root, '.astro'),
  resolve(root, 'node_modules/.astro'),
  resolve(root, 'src/content/generated'),
  resolve(root, 'public/notebook-assets'),
];

for (const target of allowedTargets) {
  if (!target.startsWith(`${root}/`)) {
    throw new Error(`Refusing to clean an unexpected path: ${target}`);
  }
  await rm(target, { recursive: true, force: true });
}

console.log('Removed generated Astro, Notebook, and distribution files.');

import { rm } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';

const root = process.cwd();
const allowedTargets = [
  resolve(root, 'dist'),
  resolve(root, '.astro'),
  resolve(root, 'node_modules/.astro'),
  resolve(root, 'src/content/generated'),
  resolve(root, 'public/notebook-assets'),
];

for (const target of allowedTargets) {
  const relativeTarget = relative(root, target);
  if (
    !relativeTarget ||
    relativeTarget === '..' ||
    relativeTarget.startsWith(`..${sep}`) ||
    isAbsolute(relativeTarget)
  ) {
    throw new Error(`Refusing to clean an unexpected path: ${target}`);
  }
  await rm(target, { recursive: true, force: true });
}

console.log('Removed generated Astro, Notebook, and distribution files.');

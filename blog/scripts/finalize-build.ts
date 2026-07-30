import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const target = resolve(process.cwd(), 'dist/.nojekyll');
await writeFile(target, '');
console.log('Created dist/.nojekyll.');

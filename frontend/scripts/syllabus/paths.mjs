// Shared paths for the syllabus pipeline (all cache output lives at the repo root).
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url)); // frontend/scripts/syllabus/
export const frontendDir = resolve(here, '..', '..');
export const repoRoot = resolve(frontendDir, '..');

export const cacheDir = resolve(repoRoot, 'syllabi');
export const rawDir = resolve(cacheDir, 'raw'); // downloaded PDFs
export const textDir = resolve(cacheDir, 'text'); // extracted plain text
export const dataDir = resolve(frontendDir, 'src', 'data'); // generated TS data

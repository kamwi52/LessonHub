// Throwaway probe: physics form-1 unit table text.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';
import { parseSyllabus } from './parse.mjs';

const tidy = (s) => s.replace(/\s+/g, ' ').trim();

const out = [];
for (const slug of ['physics-o-level', 'computer-science-o-level-2024']) {
  const text = readFileSync(join(textDir, `${slug}.txt`), 'utf8');
  const { records } = parseSyllabus(text);
  out.push(`\n### ${slug} form 1 units`);
  const seen = new Map();
  for (const r of records) {
    if (r.comp.segments[0] !== 1) continue;
    const key = r.unit?.segments.join('.') ?? '?';
    if (!seen.has(key)) seen.set(key, tidy((r.unit?.title ?? []).join(' ')));
  }
  for (const [key, title] of seen) out.push(`  unit ${key}: ${title.slice(0, 70)}`);
}

writeFileSync(join(textDir, '_units.md'), out.join('\n'), 'utf8');
console.log('written');


// Throwaway probe: unit 3.5/3.6 raw text in physics form 3.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';
import { parseSyllabus } from './parse.mjs';

const tidy = (s) => s.replace(/\s+/g, ' ').trim();

const out = [];
const text = readFileSync(join(textDir, 'physics-o-level.txt'), 'utf8');
const lines = text.split('\n');
const from = lines.findIndex((l) => /^3\.5/.test(l.trim()));
const slice = lines.slice(Math.max(0, from - 6), from + 34);
out.push('--- raw lines ---');
slice.forEach((l, k) => out.push(`${from - 6 + k}: ${l.length > 180 ? l.slice(0, 180) + '…' : JSON.stringify(l)}`));

const { records, stats } = parseSyllabus(text);
out.push(`\nstats=${JSON.stringify(stats)}`);
out.push('\n### form 3 units');
const seen = new Map();
for (const r of records) {
  if (r.comp.segments[0] !== 3) continue;
  const key = r.unit?.segments.join('.') ?? '?';
  if (!seen.has(key)) seen.set(key, tidy((r.unit?.title ?? []).join(' ')));
}
for (const [key, title] of seen) out.push(`  unit ${key}: ${title.slice(0, 70)}`);

writeFileSync(join(textDir, '_physics-f3.md'), out.join('\n'), 'utf8');
console.log('written');

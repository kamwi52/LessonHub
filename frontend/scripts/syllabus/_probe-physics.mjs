// Throwaway probe: physics sub-topic order for units 1.4 and 1.5.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';
import { parseSyllabus } from './parse.mjs';

const tidy = (s) => s.replace(/\s+/g, ' ').trim();

const out = [];
const text = readFileSync(join(textDir, 'physics-o-level.txt'), 'utf8');
const { records } = parseSyllabus(text);
for (const r of records) {
  const key = r.comp.segments.slice(0, 2).join('.');
  if (r.comp.segments[0] !== 1 || !['1.4', '1.5'].includes(key)) continue;
  const sub = r.comp.segments.slice(0, 3).join('-');
  const unitTitle = tidy((r.unit?.title ?? []).join(' '));
  const subTitle = tidy((r.sub?.title ?? []).join(' '));
  out.push(`${r.comp.segments.join('.')} | unit=${r.unit?.segments.join('.')} "${unitTitle.slice(0, 50)}" | sub=${sub} "${subTitle.slice(0, 50)}"`);
}

writeFileSync(join(textDir, '_physics-order.md'), out.join('\n'), 'utf8');
console.log('written');

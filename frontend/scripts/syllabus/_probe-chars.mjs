// Throwaway probe: character-level look at the awkward files.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';

const out = [];
for (const slug of ['biology-o-level', 'chemistry-o-level', 'integrated-science-o-level']) {
  const text = readFileSync(join(textDir, `${slug}.txt`), 'utf8');
  const esc = (s) => JSON.stringify(s);
  // Distribution of characters that lead a line, excluding plain letters/spaces.
  const counts = new Map();
  for (const line of text.split('\n')) {
    const t = line.trimStart();
    if (!t) continue;
    const c = t[0];
    if (/[A-Za-z0-9"'(]/.test(c)) continue;
    const key = esc(c);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  out.push(`\n##### ${slug}`);
  out.push(`line-start markers: ${top.map(([k, v]) => `${k}×${v}`).join('  ')}`);

  const lines = text.split('\n');
  const idx = lines.findIndex((l) => /\d{1,2}\.\d{1,2}\.\d{1,2}\.\d{1,2}/.test(l));
  out.push('--- escaped sample ---');
  out.push(lines.slice(Math.max(0, idx - 2), idx + 16).map(esc).join('\n'));
}
writeFileSync(join(textDir, '_char-probe.md'), out.join('\n'), 'utf8');
console.log('written');

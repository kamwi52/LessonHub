// Throwaway probe: compare RAW (unrepaired) vs repaired text for a few markers.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { extractText, getDocumentProxy } from 'unpdf';
import { rawDir, textDir } from './paths.mjs';

const TARGETS = [
  { slug: 'computer-science-o-level-2024', pattern: /cyber/i },
  { slug: 'mathematics-o-level', pattern: /exploring number systems/i },
];

const out = [];
for (const { slug, pattern } of TARGETS) {
  const pdf = await getDocumentProxy(new Uint8Array(readFileSync(join(rawDir, `${slug}.pdf`))));
  const { text } = await extractText(pdf, { mergePages: false });
  const raw = text.join('\n');
  const repaired = readFileSync(join(textDir, `${slug}.txt`), 'utf8');

  for (const [label, body] of [['RAW', raw], ['REPAIRED', repaired]]) {
    const lines = body.split('\n');
    const hits = lines.filter((l) => pattern.test(l)).slice(0, 3);
    out.push(`\n### ${slug} / ${label}`);
    out.push(hits.length ? hits.map((h) => JSON.stringify(h)).join('\n') : '(no match)');
  }
}
writeFileSync(join(textDir, '_raw-compare.md'), out.join('\n'), 'utf8');
console.log('written');

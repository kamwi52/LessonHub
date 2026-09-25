// Throwaway probe: identify what each extracted text is really about.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';
import { SOURCES } from './sources.mjs';

const HINTS = [
  'integrated science',
  'civic education',
  'citizenship',
  'human rights',
  'governance',
  'biology',
  'chemistry',
  'physics',
  'mathematics',
  'computer',
  'information and communication technology',
  'constitution',
  'democracy',
];

const out = [];
for (const s of SOURCES) {
  const text = readFileSync(join(textDir, `${s.slug}.txt`), 'utf8').toLowerCase();
  const hits = HINTS.map((h) => {
    let count = 0;
    let i = text.indexOf(h);
    while (i !== -1) {
      count += 1;
      i = text.indexOf(h, i + h.length);
    }
    return `${h}=${count}`;
  });
  out.push(`${s.id.padEnd(20)} ${hits.join('  ')}`);
}
writeFileSync(join(textDir, '_topic-probe.md'), out.join('\n'), 'utf8');
console.log('written');

// Throwaway probe: how parseable is each extracted text file?
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';
import { SOURCES } from './sources.mjs';

const lines = [];
for (const s of SOURCES) {
  const text = readFileSync(join(textDir, `${s.slug}.txt`), 'utf8');
  const count = (re) => (text.match(re) ?? []).length;
  const competence = count(/^\s*\d{1,2}\.\d{1,2}\.\d{1,2}\.\d{1,2}\.?\s/gm);
  const subtopic = count(/^\s*\d{1,2}\.\d{1,2}\.\d{1,2}\.?(\s|$)/gm);
  const topic = count(/^\s*\d{1,2}\.\d{1,2}\.?\s+[A-Za-z]/gm);
  const forms = count(/^\s*FORM\s*\d\s*$/gim);
  const bullets = count(/^\s*[•=o]\s/gm);
  const oddChars = count(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\uFFFD]/g);
  lines.push(
    `${s.id.padEnd(20)} competence=${String(competence).padStart(4)} subtopic=${String(subtopic).padStart(3)} topic=${String(topic).padStart(3)} forms=${forms} bullets=${String(bullets).padStart(4)} ctrl=${oddChars}`,
  );
}
lines.push('\n--- first competence block per subject ---');
for (const s of SOURCES) {
  const text = readFileSync(join(textDir, `${s.slug}.txt`), 'utf8');
  const m = /^\s*\d{1,2}\.\d{1,2}\.\d{1,2}\.\d{1,2}\.?/m.exec(text);
  const from = m ? m.index : 0;
  lines.push(`\n### ${s.id}`);
  lines.push(text.slice(from, from + 700).replace(/\n{2,}/g, '\n'));
}
writeFileSync(join(textDir, '_parse-probe.md'), lines.join('\n'), 'utf8');
console.log('written');



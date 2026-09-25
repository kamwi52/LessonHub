// Throwaway probe: dump the raw lines around problem spots.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';

const out = [];
const dump = (slug, pattern, before, after) => {
  const lines = readFileSync(join(textDir, `${slug}.txt`), 'utf8').split('\n');
  const idx = lines.findIndex((l) => pattern.test(l));
  if (idx === -1) {
    out.push(`\n### ${slug}: pattern not found`);
    return;
  }
  out.push(`\n### ${slug} (line ${idx + 1})`);
  out.push(
    lines
      .slice(Math.max(0, idx - before), idx + after)
      .map((l, k) => `${idx + k - before}: ${typeof l === 'string' && l.length > 220 ? `${l.slice(0, 220)}…` : JSON.stringify(l)}`)
      .join('\n'),
  );
};

dump('mathematics-o-level', /2\.5\.1 Matrix Operations/, 0, 0);
dump('mathematics-o-level', /2\.5\.1\.1/, 2, 6);
dump('computer-science-o-level-2024', /Cyber Threats and Mitigation/, 0, 10);
dump('biology-o-level', /3ULQFLSOHV OF/, 0, 6);
dump('chemistry-o-level', /Mineral Ores/, 2, 12);
dump('physics-o-level', /2\.1\.2 Linear/, 0, 10);
dump('integrated-science-o-level', /1\.1\.1\.1 Demonstrate/, 2, 12);

writeFileSync(join(textDir, '_raw-spots.md'), out.join('\n'), 'utf8');
console.log('written');



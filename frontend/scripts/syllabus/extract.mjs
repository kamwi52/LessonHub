// Extract plain text from every downloaded PDF into syllabi/text.
//
//   npm run syllabus:extract            # priority subjects
//   npm run syllabus:extract -- --all   # every mapped subject
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { selectSources } from './sources.mjs';
import { extractPdf } from './text.mjs';
import { rawDir, textDir } from './paths.mjs';

const wantsAll = process.argv.includes('--all');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const sources = selectSources({ all: wantsAll, only });

await mkdir(textDir, { recursive: true });

let failed = 0;
for (const source of sources) {
  const rawPath = join(rawDir, `${source.slug}.pdf`);
  try {
    await readFile(rawPath);
  } catch {
    console.log(`⚠️  ${source.id.padEnd(22)} no PDF — run \`npm run syllabus:fetch\` first`);
    failed += 1;
    continue;
  }

  const result = await extractPdf(rawPath);
  await writeFile(join(textDir, `${source.slug}.txt`), result.text, 'utf8');
  const extras = [
    result.shift ? `Caesar shift ${result.dir > 0 ? '+' : '-'}${result.shift}` : null,
    result.lineFixes ? `${result.lineFixes} line(s)` : null,
    result.tokenFixes ? `${result.tokenFixes} token(s)` : null,
  ].filter(Boolean);
  console.log(
    `📄 ${source.id.padEnd(22)} ${String(result.totalPages).padStart(3)} pages  ${
      extras.length ? `repaired: ${extras.join(', ')}` : 'clean'
    }`,
  );
}

console.log(`\nDone. ${sources.length - failed} extracted into ${textDir}.`);
if (failed) process.exitCode = 1;

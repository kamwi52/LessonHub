// Download the CDC syllabus PDFs from the shared Drive folder into syllabi/raw.
//
//   npm run syllabus:fetch              # priority subjects (ICT, Maths, Sciences)
//   npm run syllabus:fetch -- --all     # every mapped subject
//   npm run syllabus:fetch -- ict       # one or more subject ids / slugs
//
// Files already in the cache are skipped, so re-running is cheap and offline-safe.
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { listFolder, downloadFile, humanBytes, DRIVE_FOLDER_URL } from './drive.mjs';
import { selectSources } from './sources.mjs';
import { rawDir } from './paths.mjs';

const wantsAll = process.argv.includes('--all');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const sources = selectSources({ all: wantsAll, only });
await mkdir(rawDir, { recursive: true });

console.log(`☁️  ${DRIVE_FOLDER_URL}`);
console.log(`⬇️  ${sources.length} source file(s) → ${rawDir}\n`);

const listing = await listFolder();
const byName = new Map(listing.map((f) => [f.name, f]));
let downloaded = 0;
let missing = 0;

for (const source of sources) {
  const hit = byName.get(source.drive);
  if (!hit) {
    missing += 1;
    console.log(`⚠️  ${source.id.padEnd(22)} not found in the Drive folder: ${source.drive}`);
    continue;
  }
  const dest = join(rawDir, `${source.slug}.pdf`);
  const got = await downloadFile(hit.id, dest);
  if (!got.cached) downloaded += 1;
  console.log(
    `${got.cached ? '✅ cached' : '⬇️  saved '} ${source.id.padEnd(22)} ${humanBytes(got.bytes).padStart(8)}  ${source.slug}.pdf`,
  );
}

console.log(`\nDone. ${downloaded} downloaded, ${sources.length - downloaded - missing} cached, ${missing} missing.`);
if (missing) process.exitCode = 1;

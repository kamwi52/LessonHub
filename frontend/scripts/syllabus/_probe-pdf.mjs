// Throwaway probe: download priority PDFs and dump their text.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractText, getDocumentProxy } from 'unpdf';
import { listFolder, downloadFile, humanBytes } from './drive.mjs';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..');
const WANT = [
  'ICT_Ordinary_Level_Syllabus_(2024).pdf',
  'Computer_Science_Syllabus_(2024)_Ordinary_Level.pdf',
  'Final O-LEVEL MATH 1 - 4 final.pdf',
  'CIVIC EDUCATION SYLLABUS SCIENCE   O LEVEL  SYLLABUS FORM 1-4.pdf',
  'PHYSICS SYLLABUS  O LEVEL FORM 1-4 CAMERA READY.pdf',
];

const rawDir = join(repoRoot, 'syllabi', 'raw');
const textDir = join(repoRoot, 'syllabi', 'text');
await mkdir(rawDir, { recursive: true });
await mkdir(textDir, { recursive: true });

const files = await listFolder();
for (const want of WANT) {
  const hit = files.find((f) => f.name === want);
  if (!hit) {
    console.log('MISSING:', want);
    continue;
  }
  const slug = want.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  const dest = join(rawDir, `${slug}.pdf`);
  const got = await downloadFile(hit.id, dest);
  console.log(`${got.cached ? 'cached' : 'got   '} ${slug} ${humanBytes(got.bytes)}`);
  const pdf = await getDocumentProxy(new Uint8Array(await readFile(dest)));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  console.log(`   pages: ${totalPages}, pages with text: ${text.filter((t) => t.trim()).length}`);
  await writeFile(
    join(textDir, `${slug}.txt`),
    text.map((t, i) => `\n===== PAGE ${i + 1} =====\n${t}`).join('\n'),
    'utf8',
  );
  console.log('   --- preview of page 5 ---');
  console.log((text[4] ?? '').slice(0, 1200));
}


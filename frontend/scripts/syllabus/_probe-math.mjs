// Throwaway probe: check the alternate Maths PDFs for clean text.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { extractText, getDocumentProxy } from 'unpdf';
import { listFolder, downloadFile } from './drive.mjs';
import { rawDir, textDir } from './paths.mjs';

const WANT = [
  'MATHEMATICS II SYLLABUS SECONDARY EDUCATION ORDINARY LEVEL FORM 1 – 4 (1).pdf',
  'Maths_STEM_FINALISED_Copy[1].pdf',
];

await mkdir(rawDir, { recursive: true });
await mkdir(textDir, { recursive: true });

const files = await listFolder();
for (const want of WANT) {
  const hit = files.find((f) => f.name === want);
  if (!hit) {
    console.log('MISSING:', want);
    continue;
  }
  const slug = want.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+$/, '').toLowerCase();
  const dest = join(rawDir, `${slug}.pdf`);
  const got = await downloadFile(hit.id, dest);
  const pdf = await getDocumentProxy(new Uint8Array(await readFile(dest)));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  await writeFile(
    join(textDir, `${slug}.txt`),
    text.map((t, i) => `\n===== PAGE ${i + 1} =====\n${t}`).join('\n'),
    'utf8',
  );
  const sample = text.slice(10, 22).join('\n');
  console.log(`\n### ${slug} | pages ${totalPages} | ${got.bytes} bytes`);
  console.log(sample.slice(0, 1500));
}

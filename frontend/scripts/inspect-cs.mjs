import { readFile, writeFile } from 'node:fs/promises';
import { getDocumentProxy, extractText } from 'unpdf';
import { repairEncoding, fixMojibake } from './syllabus/text.mjs';

const raw = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/COMPUTER_-SCIENCE-ORDINARY-SYLLABI-FORM-1-4.pdf');
const pdf = await getDocumentProxy(new Uint8Array(raw));
const { totalPages, text } = await extractText(pdf, { mergePages: false });

console.log(`Total Pages: ${totalPages}`);

let fullText = '';
for (let i = 0; i < totalPages; i++) {
  const p = text[i] || '';
  const rep = repairEncoding(p);
  fullText += `\n===== PAGE ${i + 1} ===== (shift: ${rep.shift})\n` + rep.text + '\n';
}

await writeFile('../syllabi/text/cs-ordinary-form-1-4.txt', fullText, 'utf8');
console.log('Saved to syllabi/text/cs-ordinary-form-1-4.txt');


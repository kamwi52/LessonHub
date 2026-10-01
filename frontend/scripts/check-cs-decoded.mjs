import { readFile } from 'node:fs/promises';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');
const lines = text.split(/\r?\n/);

console.log(`Total lines: ${lines.length}`);
let formsFound = [];
let topicsFound = [];
let subtopicsFound = [];
let compFound = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const mForm = line.match(/^FORM\s+([1-4])/i);
  if (mForm && line.length < 15) {
    formsFound.push({ form: mForm[1], line: i, text: line });
  }
  const mComp = line.match(/^(\d\.\d+\.\d+\.\d+)\s*(.*)/);
  if (mComp) {
    compFound.push({ code: mComp[1], text: mComp[2], line: i });
  }
}

console.log('Forms found:', formsFound);
console.log(`Total competences found: ${compFound.length}`);
console.log('Competence list:');
for (const c of compFound) {
  console.log(`  [Line ${c.line}] ${c.code}: ${c.text.slice(0, 80)}`);
}

import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');

const CLEAN_PAIRS = [
  [/=/g, ' '],
  [/\u00a8/g, '(c)'],
  [/\u00dc/g, 'fi'],
  [/\u00ec/g, 'ff'],
  [/\u00d3/g, "'"],
  [/\u00d2/g, '-'],
  [/\u00c8\)/g, ')'],
  [/\u00c8/g, ')'],
  [/\u00dd/g, 'y'],
  [/ArtiÜcial/gi, 'Artificial'],
  [/ConÜgure/gi, 'Configure'],
  [/ConÜguration/gi, 'Configuration'],
  [/ConÜguring/gi, 'Configuring'],
  [/dierent/gi, 'different'],
  [/eect/gi, 'effect'],
  [/eective/gi, 'effective'],
  [/eectively/gi, 'effectively'],
  [/ecient/gi, 'efficient'],
  [/eciently/gi, 'efficiently'],
  [/identiÜed/gi, 'identified'],
  [/speciÜc/gi, 'specific'],
  [/signiÜcant/gi, 'significant'],
  [/proÜciency/gi, 'proficiency'],
  [/beneÜt/gi, 'benefit'],
  [/beneÜts/gi, 'benefits'],
  [/modiÜcation/gi, 'modification'],
  [/deÜnition/gi, 'definition'],
  [/deÜning/gi, 'defining'],
  [/veriÜcation/gi, 'verification'],
  [/certiÜcation/gi, 'certification'],
  [/di\s*൵\s*erent/gi, 'different'],
  [/e\s*൵\s*ect/gi, 'effect'],
  [/e\s*൵\s*ective/gi, 'effective'],
  [/e\s*൵\s*icient/gi, 'efficient'],
  [/e\s*൵\s*iciently/gi, 'efficiently'],
  [/di\s*ff\s*erent/gi, 'different'],
  [/e\s*ff\s*ect/gi, 'effect'],
  [/e\s*ff\s*ective/gi, 'effective'],
  [/e\s*ff\s*icient/gi, 'efficient'],
  [/e\s*ff\s*iciently/gi, 'efficiently'],
];

function clean(str) {
  let s = str || '';
  for (const [re, rep] of CLEAN_PAIRS) {
    s = s.replace(re, rep);
  }
  return s.replace(/\s+/g, ' ').trim();
}

// Let's parse the document
const rawLines = text.split(/\r?\n/);

// Filter out noise
const skipPatterns = [
  /^=== PAGE \d+ ===/,
  /^Computer Science\s+Syllab/i,
  /^Secondary Education Ordinary Level\s+FORM 1-4/i,
  /^TOPIC\s+SUB-TOPIC/i,
  /^TOPIC\s+SUB\s*TOPIC/i,
  /^SPECIFIC COMPETENCES/i,
  /^LEARNING ACTIVITIES/i,
  /^EXPECTED STANDARDS?/i,
  /^\d{1,2}$/,
];

const cleanedLines = [];
for (const line of rawLines) {
  const t = line.trim();
  if (!t) continue;
  if (skipPatterns.some((p) => p.test(t))) continue;
  cleanedLines.push(t);
}

console.log(`Filtered down to ${cleanedLines.length} meaningful lines.`);

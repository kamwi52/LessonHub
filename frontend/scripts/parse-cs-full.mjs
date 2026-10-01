import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');
const lines = text.split(/\r?\n/);

const CLEAN_MAP = [
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
  [/clarifi/gi, 'clarifi'],
  [/classifi/gi, 'classifi'],
  [/specifi/gi, 'specifi'],
  [/qualifi/gi, 'qualifi'],
  [/scientifi/gi, 'scientifi'],
  [/artifi/gi, 'artifi'],
  [/transfe/gi, 'transfe'],
  [/di\s*൵\s*erent/gi, 'different'],
  [/e\s*൵\s*ect/gi, 'effect'],
  [/e\s*൵\s*ective/gi, 'effective'],
  [/e\s*൵\s*icient/gi, 'efficient'],
  [/e\s*൵\s*iciently/gi, 'efficiently'],
];

function clean(str) {
  let s = str || '';
  for (const [re, rep] of CLEAN_MAP) {
    s = s.replace(re, rep);
  }
  return s.replace(/\s+/g, ' ').trim();
}

// Check how many lines and inspect the syllabus sections
console.log(`Read ${lines.length} lines.`);

import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');
const lines = text.split(/\r?\n/);

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

function parseFormLines(startLine, endLine, formNum) {
  const slice = lines.slice(startLine, endLine);
  console.log(`\n=================== FORM ${formNum} ===================`);
  for (let i = 0; i < slice.length; i++) {
    const raw = slice[i];
    const t = clean(raw);
    if (!t) continue;
    if (t.startsWith('=== PAGE')) continue;
    if (/^TOPIC\s+SUB/i.test(t)) continue;
    if (/^Computer Science\s+Syllab/i.test(t)) continue;
    if (/^Secondary Education Ordinary/i.test(t)) continue;
    if (/^\d{1,2}$/.test(t)) continue;

    const mComp = t.match(/^(\d\.\d+\.\d+\.\d+)\.?\s*(.*)/);
    const mSub = t.match(/^(\d\.\d+\.\d+)\.?\s*(.*)/);
    const mTopic = t.match(/^(\d\.\d+)\.?\s*(.*)/);

    if (mComp) {
      console.log(`\n    [COMP] ${mComp[1]} -> ${mComp[2]}`);
    } else if (mSub) {
      console.log(`\n  [SUB] ${mSub[1]} -> ${mSub[2]}`);
    } else if (mTopic) {
      console.log(`\n[TOPIC] ${mTopic[1]} -> ${mTopic[2]}`);
    } else if (raw.includes('\u00a4') || raw.startsWith('•') || raw.startsWith('-') || raw.startsWith('r ') || raw.startsWith('±')) {
      console.log(`      * ${t}`);
    }
  }
}

parseFormLines(569, 1197, 1);
parseFormLines(1197, 1640, 2);
parseFormLines(1640, 2236, 3);
parseFormLines(2236, 2568, 4);


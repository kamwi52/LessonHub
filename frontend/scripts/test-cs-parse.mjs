import { readFile } from 'node:fs/promises';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');
const lines = text.split(/\r?\n/);

function inspectSlice(start, end, formNum) {
  console.log(`\n================= FORM ${formNum} (lines ${start} - ${end}) =================`);
  const slice = lines.slice(start, end);
  for (let i = 0; i < slice.length; i++) {
    const line = slice[i].trim();
    if (!line) continue;
    if (line.startsWith('=== PAGE')) continue;
    if (/^TOPIC\s+SUB/i.test(line)) continue;
    if (/^Computer Science\s+Syllab/i.test(line)) continue;
    if (/^Secondary Education Ordinary/i.test(line)) continue;
    if (/^\d{1,2}$/.test(line)) continue;

    // Check if code or heading
    const mComp = line.match(/^(\d\.\d+\.\d+\.\d+)\.?\s*(.*)/);
    const mSub = line.match(/^(\d\.\d+\.\d+)\.?\s*(.*)/);
    const mTopic = line.match(/^(\d\.\d+)\.?\s*(.*)/);

    if (mComp) {
      console.log(`      COMP: ${mComp[1]} -> ${mComp[2]}`);
    } else if (mSub) {
      console.log(`    SUBTOPIC: ${mSub[1]} -> ${mSub[2]}`);
    } else if (mTopic) {
      console.log(`  TOPIC: ${mTopic[1]} -> ${mTopic[2]}`);
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('r ')) {
      // activity bullet
      // console.log(`        - ${line.slice(0, 60)}`);
    } else if (line.toUpperCase() === line && line.length > 3 && /[A-Z]/.test(line)) {
      console.log(`  CAPS: ${line}`);
    }
  }
}

inspectSlice(569, 1197, 1);
inspectSlice(1197, 1640, 2);
inspectSlice(1640, 2236, 3);
inspectSlice(2236, 2568, 4);


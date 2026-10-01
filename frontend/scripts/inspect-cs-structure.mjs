import { readFile } from 'node:fs/promises';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');
const lines = text.split(/\r?\n/);

console.log('=== STRUCTURE OF CS_DECODED.TXT ===');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  if (/^FORM\s+[1-4]/i.test(line) || /^=== PAGE \d+ ===/.test(line) || /^TOPIC\s+SUB/i.test(line)) {
    // console.log(`[${i}] ${line}`);
  }
  const m = line.match(/^(\d\.\d+(\.\d+)?(\.\d+)?)\s*(.*)/);
  if (m) {
    console.log(`[${i}] ${m[1]} -> ${m[4].slice(0, 80)}`);
  }
}

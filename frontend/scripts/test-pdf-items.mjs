import { readFile } from 'node:fs/promises';
import { getDocumentProxy } from 'unpdf';

try {
  const raw = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/COMPUTER_-SCIENCE-ORDINARY-SYLLABI-FORM-1-4.pdf');
  const pdf = await getDocumentProxy(new Uint8Array(raw));

  console.log('Number of pages:', pdf.numPages);
  const page18 = await pdf.getPage(18);
  const content = await page18.getTextContent();
  console.log('Page 18 item count:', content.items.length);
  console.log('Sample items from page 18:');
  for (const item of content.items.slice(0, 30)) {
    console.log(`[x=${Math.round(item.transform[4])}, y=${Math.round(item.transform[5])}] "${item.str}"`);
  }
} catch (e) {
  console.error('Error in test:', e);
}


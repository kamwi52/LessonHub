// Shared Drive helpers for the syllabus pipeline.
// The "2023 CBC School Syllabuses" folder is public, so no API key is needed:
//  - the embedded folder view lists every file (id + name)
//  - uc?export=download streams a file by id
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname } from 'node:path';

export const DRIVE_FOLDER_ID = '1-3GtczQFBKy5wg5r5wXIinINix2eTJF8';
export const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1-3GtczQFBKy5wg5r5wXIinINix2eTJF8';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

/** List every file in the shared folder as `{ id, name }`. */
export async function listFolder(folderId = DRIVE_FOLDER_ID) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`Drive listing failed: ${res.status} ${res.statusText}`);
  const html = await res.text();

  const files = [];
  const re = /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]*)<\/div>/g;
  for (const [, id, rawName] of html.matchAll(re)) {
    files.push({ id, name: decodeEntities(rawName).trim() });
  }
  if (!files.length) throw new Error('Drive listing parsed zero files — folder layout changed?');
  return files;
}

export const downloadUrl = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

/** Download a Drive file to `dest`; skips the network call when it already exists. */
export async function downloadFile(id, dest, { force = false } = {}) {
  if (!force) {
    try {
      const info = await stat(dest);
      if (info.size > 1024) return { dest, bytes: info.size, cached: true };
    } catch {
      /* not cached yet */
    }
  }

  const res = await fetch(downloadUrl(id), { headers: { 'user-agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`Download failed for ${id}: ${res.status} ${res.statusText}`);

  const type = res.headers.get('content-type') ?? '';
  const buf = Buffer.from(await res.arrayBuffer());
  if (!type.includes('pdf') && buf.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new Error(
      `Drive returned ${type || 'an unrecognised body'} for ${id} instead of a PDF ` +
        '(large files can require a confirmation page).',
    );
  }

  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return { dest, bytes: buf.length, cached: false };
}

export function humanBytes(n) {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(n / 1024)} KB`;
}

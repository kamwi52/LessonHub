// Text extraction + encoding repair for the CDC syllabus PDFs.
//
// Some CDC PDFs ship fonts with a broken ToUnicode map, so pdf.js returns a
// Caesar-shifted alphabet ("$VVHVVPHQW" instead of "Assessment"). `repairEncoding`
// scores every candidate shift against common curriculum words and undoes the
// winning one, then fixes the usual UTF-8/latin1 mojibake (â€¢, Â¿, â€™ …).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { extractText, getDocumentProxy } from 'unpdf';

// Common words used to score whether a candidate decode reads like English prose.
const FREQUENT = new Set(
  (
    'the and of to in a is are for on with that this be by as at from or an it its ' +
    'learners learner teacher teachers topic sub competences competence activities ' +
    'form term assessment content knowledge skills learning teaching syllabus ' +
    'expected standard specific general key concepts week weeks lesson lessons ' +
    'explain describe identify state use apply define discuss demonstrate ' +
    'will shall be each other their which when what how why not have has can may ' +
    'science mathematics biology chemistry physics information technology'
  ).split(/\s+/),
);


const MOJIBAKE = [
  [/â€¢|Ã¢â‚¬Â¢|â—¦|â€£/g, '•'],
  [/â€™|Ã¢â‚¬â„¢|â€˜/g, "'"],
  [/â€œ|â€\u009d|Ã¢â‚¬Å“/g, '"'],
  [/â€“|Ã¢â‚¬â€œ/g, '–'],
  [/â€”|Ã¢â‚¬â€\u009d/g, '—'],
  [/Â¿/g, 'fi'],
  [/Ã€|Ã¯¬\u0080/g, 'fl'],
  [/àµµ|ï¬\u0080/g, 'ff'],
  [/Ã¯¬\u0081/g, 'ffi'],
  [/Â¶/g, "'"],
  [/Â³|Â²|Â¹/g, ''],
  [/Â/g, ''],
];

/** Undo UTF-8-read-as-latin1 mojibake. */
export function fixMojibake(text) {
  let out = text;
  const bad = (out.match(/Ã.|â€|Â.|Ã¢/g) ?? []).length;
  if (bad > 3) {
    try {
      const round = Buffer.from(out, 'latin1').toString('utf8');
      const badRound = (round.match(/Ã.|â€|Â.|Ã¢|\uFFFD/g) ?? []).length;
      if (badRound < bad) out = round;
    } catch {
      /* keep the original */
    }
  }
  for (const [re, rep] of MOJIBAKE) out = out.replace(re, rep);
  return out;
}

/**
 * Apply a Caesar shift to the whole character set the PDF font used. Structural
 * whitespace (tab/newline/return) is preserved; everything else moves, which also
 * recovers the digits and spaces that hide in the control-char range.
 */
function shiftText(text, shift, dir, { keepSpaces = false } = {}) {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (ch === '\n' || ch === '\r' || ch === '\t' || code > 0xff) {
      out += ch;
      continue;
    }
    if (keepSpaces && (ch === ' ' || ch === '\u00a0')) {
      out += ch;
      continue;
    }
    const next = dir > 0 ? code + shift : code - shift;
    out += next >= 0x20 && next <= 0x7e ? String.fromCharCode(next) : ch;
  }
  return out;
}

/** Turn leftover control characters and the odd font ligature into real text. */
function normaliseGlyphs(text) {
  return text
    .replace(/[\u200b-\u200f\u2028\u2029\ufeff\u2060]/g, '') // zero-width junk
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, ' ') // half-shifted
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/¿/g, 'fi')
    .replace(/«/g, '…')
    .replace(/^\s*=+=?\s*/gm, '• ') // bullet glyphs that survived as '='
    .replace(/^\s*•\s*=+/gm, '• ');
}

/**
 * Token-level pass for PDFs where a few *words* (not whole pages) came from a
 * broken font, e.g. "1DWXUH RI %LRORJ\" -> "Nature of Biology". A token is only
 * rewritten when a uniform shift turns it into a common word we recognise.
 */
function repairTokens(text) {
  let changed = 0;
  const out = text.replace(/[^\s.]{2,}/g, (token) => {
    if (!/[A-Za-z]/.test(token)) return token;
    if (FREQUENT.has(token.toLowerCase())) return token;

    for (let shift = 1; shift <= 40; shift += 1) {
      for (const dir of [1, -1]) {
        let candidate = '';
        let usable = true;
        for (const ch of token) {
          const code = ch.codePointAt(0);
          const next = dir > 0 ? code + shift : code - shift;
          if (next < 0x21 || next > 0x7e) {
            usable = false;
            break;
          }
          candidate += String.fromCharCode(next);
        }
        if (!usable) continue;
        if (!/^[A-Za-z][A-Za-z'’,-]*$/.test(candidate)) continue;
        if (FREQUENT.has(candidate.toLowerCase())) {
          changed += 1;
          return candidate;
        }
      }
    }
    return token;
  });
  return { text: out, repairedTokens: changed };
}

function repairLines(text) {
  const lines = text.split('\n');
  let changed = 0;
  const out = lines.map((line) => {
    const tokens = line.toLowerCase().match(/[a-z]{2,}/g) ?? [];
    if (tokens.length < 3) return line;
    let known = 0;
    for (const t of tokens) if (FREQUENT.has(t)) known += 1;
    if (known / tokens.length >= 0.15) return line; // already reads fine

    let best = { score: known / tokens.length, hits: known, text: line };
    for (let shift = 1; shift <= 40; shift += 1) {
      for (const dir of [1, -1]) {
        const candidate = shiftText(line, shift, dir, { keepSpaces: true });
        const candTokens = candidate.toLowerCase().match(/[a-z]{2,}/g) ?? [];
        let candKnown = 0;
        for (const t of candTokens) if (FREQUENT.has(t)) candKnown += 1;
        const ratio = candKnown / Math.max(1, candTokens.length);
        if (ratio > best.score) best = { score: ratio, hits: candKnown, text: candidate };
      }
    }
    // Require a decisive, unambiguous improvement before rewriting a line.
    if (best.score > 0.25 && best.hits >= 2) {
      changed += 1;
      return best.text;
    }
    return line;
  });
  return { text: out.join('\n'), repairedLines: changed };
}

/**
 * How much the text looks like readable English prose. Returns the share of word
 * tokens that are common words (prose ≈ 0.15-0.25) plus the letter/space balance.
 * Shifted text scores near zero because its word boundaries disappear.
 */
function scoreText(text) {
  const sample = text.slice(0, 60000).toLowerCase();
  const tokens = sample.match(/[a-z]{2,}/g) ?? [];
  if (!tokens.length) return { ratio: 0, spacing: 0 };
  let known = 0;
  for (const token of tokens) if (FREQUENT.has(token)) known += 1;
  const letters = (sample.match(/[a-z]/g) ?? []).length;
  const spaces = (sample.match(/ /g) ?? []).length;
  return {
    ratio: known / tokens.length,
    spacing: letters ? Math.min(1, spaces / letters) : 0, // ≈0.17 for prose
  };
}

const quality = ({ ratio, spacing }) => ratio + spacing * 0.1;

/**
 * Repair a Caesar-shifted alphabet if one is detected. Returns `{ text, shift, dir }`
 * where shift 0 means the text was already readable.
 */
export function repairEncoding(text) {
  const base = fixMojibake(text);
  const baseScore = scoreText(base);
  let best = { shift: 0, dir: 1, score: baseScore };

  for (let shift = 1; shift <= 40; shift += 1) {
    for (const dir of [1, -1]) {
      const score = scoreText(shiftText(base, shift, dir));
      if (quality(score) > quality(best.score)) best = { shift, dir, score };
    }
  }

  // Only accept a shift when it is decisively more readable, so clean PDFs stay put.
  const decisive = best.score.ratio > 0.08 && best.score.ratio > baseScore.ratio * 1.8;
  if (best.shift === 0 || !decisive) return { text: normaliseGlyphs(base), shift: 0, dir: 1 };
  return {
    text: normaliseGlyphs(shiftText(base, best.shift, best.dir)),
    shift: best.shift,
    dir: best.dir,
  };
}

/** Score helpers exposed for the `syllabus:check` diagnostics. */
export function diagnose(text) {
  const { text: fixed, shift, dir } = repairEncoding(text);
  return { shift, dir, before: scoreText(text), after: scoreText(fixed) };
}

/** Extract one PDF into clean, repaired text (page markers preserved). */
export async function extractPdf(file) {
  const pdf = await getDocumentProxy(new Uint8Array(await readFile(file)));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = text.map((t) => t ?? '');

  // Page-level pass (a whole broken font), then line- and token-level passes for
  // PDFs that mix a broken font with a good one (Biology).
  const pageRepair = repairEncoding(pages.join('\n'));
  let lineFixes = 0;
  let tokenFixes = 0;
  const repaired = pages.map((page) => {
    const first = repairEncoding(page);
    const second = repairLines(first.text);
    lineFixes += second.repairedLines;
    const third = repairTokens(second.text);
    tokenFixes += third.repairedTokens;
    return third.text;
  });

  const body = repaired.map((page, i) => `\n===== PAGE ${i + 1} =====\n${page}`).join('\n');
  return {
    totalPages,
    blankPages: pages.filter((p) => !p.trim()).length,
    shift: pageRepair.shift,
    dir: pageRepair.dir,
    lineFixes,
    tokenFixes,
    text: body,
  };
}

export async function extractToCache({ slug, rawPath, textDir }) {
  const result = await extractPdf(rawPath);
  await writeFile(join(textDir, `${slug}.txt`), result.text, 'utf8');
  return result;
}

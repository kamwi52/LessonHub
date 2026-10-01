// Generate the Civic Education curriculum (Forms 1-4) and its Term 3 weekly
// plans from the repaired CDC syllabus text.
//
//   cd frontend && node scripts/generate-civic-education.mjs
//
// The civic PDF is a five-column table (TOPIC | SUB-TOPIC | SPECIFIC
// COMPETENCES | LEARNING ACTIVITIES | EXPECTED STANDARD) whose cells the text
// extractor glues onto one line and whose line wraps are marked with the cell
// rule character, e.g.
//
//   1.3.1.1. Apply knowledgef of
//   Governance= in real life
//   situation=
//   * Describing family and school governance systems.
//
// The generic table parser in syllabus/parse.mjs loses sub-topics on that, so
// this builder scans the syllabus codes itself. Codes are
//
//   X.Y  unit      X.Y.Z  sub-topic      X.Y.Z.W  specific competence
//
// and where the CDC numbering slips (unit 3.4 prints competences as 3.4.2 /
// 3.4.4 / 3.4.6) the "competence verb + next number" rule below still splits
// them correctly.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { dataDir, textDir } from './syllabus/paths.mjs';

const SUBJECT_ID = 'civic-education';
const SUBJECT_NAME = 'Civic Education';
const SLUG = 'civic-education-o-level';
const PDF_REF = 'CIVIC EDUCATION SYLLABUS SCIENCE   O LEVEL  SYLLABUS FORM 1-4.pdf';
const TS_EXPORT = 'CIVIC_EDUCATION_CURRICULUM';
const TS_WEEKS_EXPORT = 'CIVIC_EDUCATION_TERM3_WEEKS';

const RESOURCES = ['Civic Education Textbook', 'Constitution of Zambia', 'Newspaper cuttings'];
const WEEK_RESOURCES = [...RESOURCES, 'Whiteboard & markers'];

const json = (value) => JSON.stringify(value, null, 2);
const hasWords = (text) => /[A-Za-z]{3,}/.test(text ?? '');
const short = (text, max = 90) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
};

// ── Text repair ─────────────────────────────────────────────────────────────
// The CDC original has a handful of font-map slips that survive extraction.
const fixChars = (text) =>
  String(text ?? '')
    .replace(/[\u00B6\u2018\u2019]/g, "'") // pilcrow / curly quote -> apostrophe
    .replace(/\u00C0/g, 'fl') // fl ligature
    .replace(/[\u0D75\u09FC\u09FD]/g, 'ff') // ff ligature
    .replace(/\u00B1/g, '-')
    .replace(/[\u03EC-\u03F5\u0357\u0358\u0372]/g, '') // ISBN mojibake
    .replace(/\u0000/g, ' ');

// Word-level slips in the CDC original ("Apply knowledgef of Governance"),
// including the words its own printer split across a line.
const WORD_FIXES = [
  [/knowledgef\s+of/gi, 'knowledge of'],
  [/\bdemostrate\b/gi, 'demonstrate'],
  [/\bnon-\s+/gi, 'non-'],
  [/Entrepreneuria\s+l\b/gi, 'Entrepreneurial'],
  [/Entrepreneurs\s+Hip\b/gi, 'Entrepreneurship'],
  [/Introductionto\b/gi, 'Introduction to'],
  [/Part AN of/gi, 'Part II of'],
];

const tidy = (text) =>
  WORD_FIXES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), fixChars(text))
    .replace(/\s+/g, ' ')
    .trim();

/** '= = =' rules separate the sub-topic cell from the competence cell. */
const CELL_RULE = /(?:^|\s)=(?:\s*=)+\s*/;

/** Split a cell at its first '= =' rule: head = bold text, tail = glued cell. */
const spacedRule = (text) => {
  const at = String(text ?? '').search(CELL_RULE);
  return at < 0 ? { head: text ?? '', tail: '' } : { head: text.slice(0, at), tail: text.slice(at) };
};

/** Capitalise the first letter only (CDC prints some cells in ALL CAPS). */
const asSentence = (text) => {
  const clean = tidy(text).replace(/^[-\s]+/, '').replace(/[\s.]+$/, '');
  return clean ? clean[0].toUpperCase() + clean.slice(1) : '';
};

const SMALL_WORDS = new Set(['and', 'of', 'in', 'the', 'to', 'for', 'a', 'an', 'on', 'as']);
const ACRONYMS = new Set(['ecz', 'sec', 'crb', 'ict', 'hiv', 'aids']);
const titleCase = (text) =>
  tidy(text)
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      const bare = word.replace(/[^a-z]/g, '');
      if (ACRONYMS.has(bare)) return word.toUpperCase();
      if (index > 0 && SMALL_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

// ── Scan the syllabus codes ─────────────────────────────────────────────────
// Codes can sit mid-line (the extractor glues the next column on: "* 1.4.2
// Qualifications for Zambian Citizenship"), so the loop looks for the first
// code on each line, hands the text before it back to the previous cell and
// opens a new cell for everything that follows.
const raw = await readFile(join(textDir, `${SLUG}.txt`), 'utf8');

const PAGE_MARKER = /^=+ PAGE \d+ =+$/;
const FOOTER = /Civic Education Syllabus|^FORM \d$|^S\/N\b/i;
const COLUMN_HEAD =
  /(specific\s+competences|learning\s+activities|expected\s+standard|^TOPIC\b|SUB\s?-?\s?TOPIC|KEY COMPETENCES|^COMPETENCE\b)/i;
// Codes are printed with a trailing dot in some rows ("1.1.1. Civic
// Education="), which must not stop the match.
const CODE = /(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?\.?(?![.\d])/;
const BULLET = /\s*\u2022\s*/;
const STANDARD_END =
  /(correctly|accordingly|appropriately|responsibly|justified|adhered to|as expected)\s*\.?$/i;

const lines = raw
  .split(/\r?\n/)
  .map(tidy)
  .filter((line) => line.length > 0)
  .filter((line) => !PAGE_MARKER.test(line) && !FOOTER.test(line) && !COLUMN_HEAD.test(line))
  .filter((line) => !/\.{4,}/.test(line)); // contents-page dot leaders

const stripEquals = (text) => tidy(String(text ?? '').replace(/\s*=\s*/g, ' '));
const dropTrailingRoman = (text) => tidy(text).replace(/\s+[ivx]$/i, '');

/** Join a cell's wrapped lines into one line of text. */
const joinCell = (lines) => tidy(lines.join(' '));

/** The bold cell text that opens a row: everything before a bullet or rule. */
const cellHead = (text) =>
  dropTrailingRoman(stripEquals(spacedRule(tidy(text).split(BULLET)[0] ?? '').head));

/** A few rows in the CDC PDF use a custom font and extract as cipher text
 *  ("aS\bS\QSa +:WTS"). Real prose never carries this many stray symbols. */
const looksGarbled = (text) => {
  if (!/[A-Za-z]{4,}/.test(text)) return true;
  const symbols = (text.match(/[^\w\s\u2019'-]/g) ?? []).length;
  return symbols > 2 && symbols / Math.max(1, text.split(/\s+/).length) > 0.25;
};

/** Split one competence cell into its statement, activities and standard. */
function parseCell(text) {
  const chunks = tidy(text).split(BULLET);
  const { head, tail } = spacedRule(chunks.shift() ?? '');
  const rawStatement = dropTrailingRoman(stripEquals(head));
  const items = [];
  if (hasWords(tail)) items.push(asSentence(stripEquals(tail)));
  for (const chunk of chunks) {
    const item = asSentence(stripEquals(chunk));
    if (hasWords(item)) items.push(item);
  }
  let standard = '';
  if (items.length > 1 && STANDARD_END.test(items[items.length - 1])) standard = items.pop();
  // A cell wrapped mid-sentence leaves an activity dangling on a conjunction.
  const usable = items.filter(
    (item) => !/\b(and|of|the|to|in|or|with|for|a|an|that)\s*$/i.test(item) && !looksGarbled(item),
  );
  return {
    statement: looksGarbled(rawStatement) ? '' : rawStatement,
    activities: usable.slice(0, 6).map((item) => short(item, 120)),
    standard: looksGarbled(standard) ? '' : short(standard, 120),
  };
}

const tokens = [];
let cell = null;
for (const line of lines) {
  let rest = line;
  for (;;) {
    const hit = CODE.exec(rest);
    if (!hit) {
      if (cell && rest.trim()) cell.lines.push(rest.trim());
      break;
    }
    const lead = rest.slice(0, hit.index).replace(/^[-\s]+/, '').trim();
    if (cell && hasWords(lead)) cell.lines.push(lead);
    const segments = [hit[1], hit[2], hit[3], hit[4]].filter(Boolean).map(Number);
    cell = { code: segments.join('.'), segments, lines: [] };
    tokens.push(cell);
    rest = rest.slice(hit.index + hit[0].length);
  }
}

// ── Assemble units -> sub-topics -> competences ─────────────────────────────
// Competence statements always open with one of these verbs; a three-segment
// code that opens with a verb and continues the numbering is a competence
// whose last segment the CDC dropped (units 3.4, 3.5, 3.6, 3.8).
const COMPETENCE_VERBS = new Set(
  ('analyse apply appreciate assess care consolidate create critique demonstrate demostrate describe develop ' +
    'devise dierentiate differentiate dissolve distinguish engage established evaluate examine exhibit explain ' +
    'explore express generate identify interpret justify mobilise practise practice prepare promote recognise ' +
    'recognize report resolve show take use value participate communicate manage')
    .split(' '),
);

/** Codes whose printed text is unreadable or misspelt after extraction. */
const TITLE_FIXES = {
  '1.4.3.1': "Demonstrate understanding of one's rights, duties and responsibilities as a Zambian citizen",
  '1.10.1': 'Types of Business Units',
  '1.10.1.1': 'Adapt to changing business environment',
  '2.2.2': 'Electoral Commission of Zambia (ECZ)',
  '2.2.2.1': 'Analyse the role of the Electoral Commission of Zambia (ECZ)',
  '2.6.1.1': 'Promote peace and non-violence in society',
  '3.3': 'Family Law',
  '3.3.1': 'Types of Marriages',
  '3.3.2': 'Laws on Inheritance and Succession',
  '3.3.1.1': 'Demonstrate understanding of types of marriages',
  '3.3.1.2': 'Analyse elements of family law',
  '3.3.2.1': 'Interpret laws on inheritance and succession',
  '3.5.5': "Participate in Zambia's societal core values",
  '3.8.1': 'Entrepreneurial Activities',
  '3.8.1.1': 'Establish a business venture',
  '4.4.2': 'Gender-Based Violence (GBV)',
  '4.6.1': 'Credit Reference Bureau (CRB)',
  '4.7.1': 'Securities and Exchange Commission (SEC)',
  '4.8.1': 'Pension and Retirement Planning',
};
/** Sub-topics the extraction loses completely; keyed by their parent unit. */
const EXTRA_SUBTOPICS = {
  '3.3': ['3.3.1', '3.3.2'],
};
/** Competence rows that print in a different row than their code says. Each
 *  code can repeat (unit 2.3 prints 2.3.1.1 twice), so the values are queues:
 *  the nth occurrence of the code goes to the nth sub-topic, later ones stay
 *  with the row they are printed in. */
const COMPETENCE_OWNER = {
  '1.6.2.2': ['1.6.2'],
  '2.3.1.1': ['2.2.3'],
  '2.12.2.2': ['2.12.3'],
  '2.12.2.3': ['2.12.4'],
  '2.12.2.4': ['2.12.5'],
  '3.2.1.2': ['3.2.2'],
  '3.3.1.2': ['3.3.1'],
};
/** Rows whose text the extractor cannot recover; supplied from the syllabus. */
const EXTRA_COMPETENCES = {
  '1.10.1': ['Adapt to changing business environment'],
  '3.3.1': ['Demonstrate understanding of types of marriages'],
  '3.3.2': ['Interpret laws on inheritance and succession'],
};

const firstWord = (text) => (tidy(text).match(/[A-Za-z]{2,}/) ?? [''])[0].toLowerCase();
const byCode = (a, b) => a.code.localeCompare(b.code, 'en', { numeric: true });

const forms = new Map();
const stats = { skipped: 0 };

const ensureUnit = (form, unitNo) => {
  if (!forms.has(form)) forms.set(form, new Map());
  const units = forms.get(form);
  const unitCode = `${form}.${unitNo}`;
  if (!units.has(unitCode)) units.set(unitCode, { code: unitCode, title: '', subs: new Map(), lastSub: 0 });
  return units.get(unitCode);
};

// Re-instate the sub-topics the extractor drops (unit 3.3 prints only one
// competence and no sub-topic cells at all).
for (const [unitCode, subCodes] of Object.entries(EXTRA_SUBTOPICS)) {
  const [form, unitNo] = unitCode.split('.').map(Number);
  const unit = ensureUnit(form, unitNo);
  for (const subCode of subCodes) {
    unit.subs.set(subCode, { code: subCode, title: TITLE_FIXES[subCode] ?? '', comps: [] });
    unit.lastSub = Number(subCode.split('.')[2]);
  }
}

const pending = []; // competences, attached once every sub-topic of the form exists
// The row a competence is printed in can belong to a different unit than its
// code (the 2.2.3 row carries competence 2.3.1.1), so track the last sub-topic
// per form instead of per unit.
const lastSubByForm = new Map();
const findSub = (form, code) => {
  for (const unit of forms.get(form)?.values() ?? []) if (unit.subs.has(code)) return unit.subs.get(code);
  return null;
};

for (const token of tokens) {
  const [form, unitNo, subNo, compNo] = token.segments;
  if (form < 1 || form > 4 || unitNo < 1 || unitNo > 25) { stats.skipped += 1; continue; }
  const unit = ensureUnit(form, unitNo);

  if (subNo === undefined) {
    if (!unit.title) {
      unit.title = titleCase(short(TITLE_FIXES[unit.code] ?? cellHead(joinCell(token.lines)), 70));
    }
    continue;
  }

  const cell = joinCell(token.lines);
  const isCompetence =
    compNo !== undefined || (COMPETENCE_VERBS.has(firstWord(cell)) && unit.lastSub === subNo - 1);

  if (!isCompetence) {
    const title = TITLE_FIXES[token.code] ?? asSentence(short(cellHead(cell), 70));
    if (hasWords(title)) {
      const sub = { code: token.code, title, comps: [] };
      unit.subs.set(token.code, sub);
      lastSubByForm.set(form, sub);
    }
    unit.lastSub = subNo;
    continue;
  }

  const parsedCell = parseCell(cell);
  // A three-segment competence keeps the numbering chain going (3.6.3 makes
  // 3.6.4 the next competence rather than a new sub-topic).
  if (compNo === undefined) unit.lastSub = subNo;
  pending.push({
    form,
    tokenCode: token.code,
    rowOwner: lastSubByForm.get(form) ?? null,
    statement: TITLE_FIXES[token.code] ?? parsedCell.statement,
    activities: parsedCell.activities,
    standard: parsedCell.standard,
  });
}

// Attach the competences only now that every sub-topic of the form is known:
// some codes name a row further down the page, others repeat the row above.
const overrideUse = new Map();
for (const comp of pending) {
  const queue = COMPETENCE_OWNER[comp.tokenCode] ?? [];
  const used = overrideUse.get(comp.tokenCode) ?? 0;
  const override = queue[used];
  if (override) overrideUse.set(comp.tokenCode, used + 1);
  const owner =
    (override ? findSub(comp.form, override) : null) ??
    comp.rowOwner ??
    lastSubByForm.get(comp.form);
  if (!owner) continue;
  owner.comps.push({
    code: `${owner.code}.${owner.comps.length + 1}`,
    statement: comp.statement,
    activities: comp.activities,
    standard: comp.standard,
  });
}

// Competence rows the extractor could not read at all.
for (const [subCode, statements] of Object.entries(EXTRA_COMPETENCES)) {
  const [form, unitNo] = subCode.split('.').map(Number);
  const sub = ensureUnit(form, unitNo).subs.get(subCode);
  if (!sub) continue;
  for (const statement of statements) {
    sub.comps.push({ code: `${subCode}.${sub.comps.length + 1}`, statement, activities: [], standard: '' });
  }
}

// ── Assemble GradePlan[] ────────────────────────────────────────────────────
const FORM_DESC = {
  1: 'Introduction to civic education, governance, citizenship, political parties, central and local government, personal finance, risk management and entrepreneurship.',
  2: 'The constitution, elections, economic and social development, trade, human rights, peace and conflict, international relations, banking and entrepreneurship.',
  3: 'Corruption, drug and substance abuse, family law, child abuse, culture, civil society and media, personal finance and entrepreneurship.',
  4: 'The legal system, international human rights, poverty, gender development, development planning, credit, investment, risk management and entrepreneurship.',
};

const fallbackObjectives = (topicTitle) => [
  `Discuss the meaning and importance of ${topicTitle}.`,
  `Explain how ${topicTitle} applies to daily life in Zambia.`,
];

const toLesson = (comp, topicTitle) => {
  const title = short(comp.statement, 120) || `Demonstrate understanding of ${topicTitle.toLowerCase()}`;
  const objectives = comp.activities.length ? comp.activities.slice(0, 4) : fallbackObjectives(topicTitle);
  const outline = comp.activities.length ? comp.activities.slice(0, 6) : objectives;
  return {
    id: comp.code.replace(/\./g, '-'),
    title,
    durationMin: 60,
    objectives,
    outline,
    resources: [...RESOURCES],
    homework: `Complete the practice exercise on ${short(title, 80)}.`,
    assessment: comp.standard || `${short(topicTitle, 70).replace(/\.$/, '')} demonstrated correctly`,
  };
};

/** Split a form's units into three even terms (the syllabus prints no terms). */
function termChunks(units) {
  const base = Math.floor(units.length / 3);
  const extra = units.length % 3;
  const chunks = [];
  let at = 0;
  for (let i = 0; i < 3; i += 1) {
    const size = base + (i < extra ? 1 : 0);
    chunks.push(units.slice(at, at + size));
    at += size;
  }
  return chunks;
}

const grades = [];
for (const form of [...forms.keys()].sort((a, b) => a - b)) {
  const units = [...forms.get(form).values()]
    .filter((unit) => unit.subs.size)
    .sort(byCode)
    .map((unit) => ({
      ...unit,
      // Unit 3.3 prints no heading cell at all, so its title comes from the fixes.
      title: unit.title || TITLE_FIXES[unit.code] || `Unit ${unit.code}`,
      subs: [...unit.subs.values()].sort(byCode),
    }));
  if (!units.length) continue;

  const gradeId = `form-${form}`;
  const terms = termChunks(units).map((chunk, index) => ({
    id: `${gradeId}-t${index + 1}`,
    label: `Term ${index + 1}`,
    theme: chunk.map((unit) => unit.title).join(', '),
    weeks: 12,
    topics: chunk.flatMap((unit) =>
      unit.subs.map((sub) => ({
        id: sub.code.replace(/\./g, '-'),
        title: sub.title,
        overview: `${unit.title} - ${sub.title}`,
        weeks: `Unit ${unit.code}`,
        keyTerms: [unit.title, sub.title],
        lessons: sub.comps.map((comp) => toLesson(comp, sub.title)),
        homeworkBank: [`Practice questions on ${sub.title}.`],
        quizQuestions: [],
      })),
    ),
  }));

  grades.push({
    id: gradeId,
    grade: `Form ${form}`,
    level: 'Ordinary Level',
    description: FORM_DESC[form] ?? `Civic Education Form ${form}`,
    terms: terms.filter((term) => term.topics.length),
  });
}


// ── Term 3 weekly plans (13 weeks, Linda format) ────────────────────────────
// Term 3 carries the last third of the form's units, so the planner tops the
// ten lesson weeks up with earlier units where the term itself is short.
function buildWeeks(grade) {
  const term3 = grade.terms.find((term) => term.id.endsWith('-t3'));
  if (!term3) return [];
  const pair = (topic) => topic.lessons.map((lesson) => ({ topic, lesson }));
  const termLessons = term3.topics.flatMap(pair);
  const earlier = grade.terms
    .filter((term) => term !== term3)
    .flatMap((term) => term.topics.flatMap(pair));
  const pool = [...termLessons, ...earlier];
  if (!pool.length) return [];
  const picks = Array.from({ length: 10 }, (_, index) => pool[index % pool.length]);

  const lessonWeek = ({ topic, lesson }, week) => ({
    week,
    type: 'lesson',
    title: short(lesson.title, 72),
    focus: lesson.id.replace(/-/g, '.'),
    objectives: (lesson.objectives.length ? lesson.objectives : [lesson.title]).slice(0, 3),
    starter: `Recap the key ideas of "${topic.title}" and collect learners' answers on the board.`,
    development: (lesson.outline.length ? lesson.outline : [lesson.title]).slice(0, 6),
    plenary: `Learners say one thing they can now do in "${topic.title}" and one question they still have.`,
    resources: [...WEEK_RESOURCES, topic.title],
    homework: `Complete the practice exercise on "${short(lesson.title, 80)}" in the class workbook.`,
    assessment: lesson.assessment ?? 'Competence demonstrated correctly',
  });

  const examWeek = (week, type, title, note) => ({
    week,
    type,
    title,
    focus: type === 'revision' ? 'Term 3 consolidation' : 'Weeks in review',
    objectives: [`Assess learner progress in ${SUBJECT_NAME}`, 'Give feedback on common errors'],
    starter: 'Remind learners of the examination rules and the time allowed.',
    development: [`Administer the ${title.toLowerCase()} under examination conditions`, note],
    plenary: 'Collect all scripts and confirm every learner has submitted.',
    resources: [...WEEK_RESOURCES, 'Past examination papers'],
    homework: 'Correct the paper and note the topics that need revision.',
    assessment: 'Marked scripts and recorded marks',
  });

  return [
    ...picks.slice(0, 6).map((pick, index) => lessonWeek(pick, index + 1)),
    examWeek(7, 'exam', 'Mid-Term Examination', 'Cover the competences taught in weeks 1-6.'),
    ...picks.slice(6, 10).map((pick, index) => lessonWeek(pick, index + 8)),
    examWeek(
      12,
      'revision',
      'Revision & Consolidation',
      'Revise the weak areas flagged by the mid-term results.',
    ),
    examWeek(13, 'exam', 'End of Term Examination', `Cover the whole of ${term3.label} (weeks 1-13).`),
  ];
}

const weeks = Object.fromEntries(grades.map((grade) => [grade.id, buildWeeks(grade)]));


// ── Write the data files ────────────────────────────────────────────────────
await mkdir(dataDir, { recursive: true });
await writeFile(
  join(dataDir, `syllabus-${SUBJECT_ID}.ts`),
  `// AUTO-GENERATED from ${PDF_REF} (Forms 1-4). Do not edit by hand.\n` +
    "import type { GradePlan } from './ict-curriculum';\n\n" +
    `export const ${TS_EXPORT}: GradePlan[] = ${json(grades)};\n`,
  'utf8',
);
await writeFile(
  join(dataDir, `${SUBJECT_ID}-t3-weeks.ts`),
  `// AUTO-GENERATED Term 3 weekly plans for Civic Education (Forms 1-4). Do not edit by hand.\n` +
    "import type { WeekPlan } from './ict-curriculum';\n\n" +
    `export const ${TS_WEEKS_EXPORT}: Record<string, WeekPlan[]> = ${json(weeks)};\n`,
  'utf8',
);

const topics = grades.flatMap((grade) => grade.terms.flatMap((term) => term.topics));
const lessons = topics.flatMap((topic) => topic.lessons);
const emptyTopics = topics.filter((topic) => !topic.lessons.length).length;
console.log(
  `${SUBJECT_NAME}: ${grades.length} forms · ${topics.length} sub-topics · ${lessons.length} competences`,
);
console.log(`Written: src/data/syllabus-${SUBJECT_ID}.ts, src/data/${SUBJECT_ID}-t3-weeks.ts`);
console.log(
  `Weeks: ${Object.entries(weeks)
    .map(([id, list]) => `${id}=${list.length}`)
    .join(', ')}` +
    (stats.skipped ? ` · ignored ${stats.skipped} stray codes` : '') +
    (emptyTopics ? ` · ${emptyTopics} sub-topics without lessons` : ''),
);


// Parse repaired CDC syllabus text into the app's curriculum shape.
//
// CDC syllabuses are tables: TOPIC | SUB TOPIC | SPECIFIC COMPETENCES |
// LEARNING ACTIVITIES | EXPECTED STANDARD. A code such as 1.4.2.3 means
// Form 1, unit 4, sub-topic 2, competence 3.
//
// The app maps that to Form -> TermPlan -> Topic -> Lesson. The parser
// repairs wrapped cells, repeated merged labels, and table-column interleaving.

const PAGE_MARKER = /^===== PAGE (\d+) =====$/;
const BULLET = /^\s*(?:[•▪‣·*\-–—xo]|\d{1,2}\.)\s+/;
const DOT_LEADER = /\.{3,}/;
const TABLE_HEADER =
  /^\s*(topic|sub\s*-?\s*topic|specific\s+competences?|learning\s+activities?|expected\s+standard|general\s+competences?|key\s+concepts?|competence\s+descriptors?|summary\s+of)\b/i;
const CODE_LEVEL = { 2: 'unit', 3: 'subtopic', 4: 'competence' };

const tidy = (s) =>
  s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?…)\]}])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+'/g, "'")
    .trim();
const sentence = (text) => tidy(text).replace(/[.;:]+$/, '');
const terminal = (text) => /[.!?:;]$/.test(text.trim());

const shortTitle = (text, max = 60) => {
  const clean = sentence(text);
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}â€¦`;
};

const idOf = (segments) => segments.join('-');

/** Guard against page numbers, dates and bicimal numbers being read as codes. */
function plausible(segments) {
  const [form, unit = 1, sub = 1, comp = 1] = segments;
  return (
    form >= 1 && form <= 6 && unit >= 1 && unit <= 25 && sub >= 1 && sub <= 60 && comp >= 1 && comp <= 60
  );
}

/**
 * Every syllabus code on a line, in order. Codes normally start the line, but
 * table extraction often glues the next column on ("1.1. REAL NUMBERS 1.1.1.
 * Types of Numbers 1.1.1.1. Use â€¦"), and some PDFs print the title first
 * ("Nature of Biology 1.1.2.1 Categorise â€¦"), which is why hit.lead exists.
 */
function findCodes(line) {
  const hits = [];
  const scan = (pattern, levels) => {
    for (const m of line.matchAll(pattern)) {
      const at = m.index ?? 0;
      const segments = levels.map((i) => Number(m[i]));
      hits.push({ level: CODE_LEVEL[segments.length], segments, start: at, end: at + m[0].length });
    }
  };
  // 4- and 3-segment codes first from the line start ("1.1.1.1" >> "1.1.1" >> "1.1").
  const anchored4 = /^(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.?\s*(.*)$/.exec(line);
  if (anchored4) return codeHit('competence', anchored4, 0, line.length, line);
  const anchored3 = /^(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.?\s*(.*)$/.exec(line);
  if (anchored3) return codeHit('subtopic', anchored3, 0, line.length, line);
  const anchored2 = /^(\d{1,2})\.(\d{1,2})\.?\s*(.*)$/.exec(line);
  if (anchored2 && plausible([Number(anchored2[1]), Number(anchored2[2])])) {
    return codeHit('unit', anchored2, 0, line.length, line);
  }

  // Codes glued later in the line (table columns): longest level first so
  // "1.1.1.1" wins over the "1.1.1" and "1.1" hidden inside it.
  scan(/\b(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.?\b/g, [1, 2, 3, 4]);
  scan(/\b(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.?\b/g, [1, 2, 3]);

  const accepted = [];
  for (const hit of hits.sort((a, b) => a.start - b.start)) {
    if (!plausible(hit.segments)) continue;
    // A shorter code fully inside an accepted longer one is a false positive.
    if (accepted.some((h) => hit.start >= h.start && hit.end <= h.end)) continue;
    if (accepted.some((h) => hit.start < h.end && hit.end > h.start)) continue;
    // Embedded codes must be followed by a label, so prose numbers are ignored.
    // A long glued row is one row, though: do not reject shadow codes that
    // land after a genuine row tail ("â€¦ accordingly 9PHYSICS SYLLABUS â€¦").
    const after = line.slice(hit.end);
    if (after && after.length < 80 && !/^\s*[A-Z0-9("'â€˜â€œ\-]/.test(after)) continue;
    accepted.push(hit);
  }
  for (let i = 0; i < accepted.length; i += 1) {
    const from = i === 0 ? 0 : accepted[i - 1].end;
    const to = i === accepted.length - 1 ? line.length : accepted[i + 1].start;
    accepted[i].lead = line.slice(from, accepted[i].start).trim();
    accepted[i].text = line.slice(accepted[i].end, to).trim().replace(/^[.:]\s*/, '');
  }
  return accepted;
}

/** Wrap an anchored code match (line starts with the code) into a single hit. */
function codeHit(level, m, at, lineLength, line) {
  const width = level === 'competence' ? 4 : level === 'subtopic' ? 3 : 2;
  const segments = [];
  for (let i = 1; i <= width; i += 1) segments.push(Number(m[i]));
  return [{ level, segments, start: at, end: at + m[0].length - (m[width + 1]?.length ?? 0), lead: '', text: (m[width + 1] ?? '').trim() }];
}

/** Append title fragments, skipping anything already present. */
function appendTitle(target, parts) {
  const existing = tidy((target?.title ?? []).join(' ')).toLowerCase();
  for (const part of parts) {
    const text = tidy(part);
    if (!text) continue;
    if (existing.includes(text.toLowerCase())) continue;
    target.title.push(text);
  }
}

const normaliseLabel = (text) => tidy(text).toLowerCase().replace(/[^a-z0-9 ]/g, '');

/**
 * A trailing text group that continues a title which was itself cut by a page
 * break or a table wrap ("Structure and Composition of the" hanging after the
 * 1.4.1 sub-topic line). These are prefixes/suffixes of a known title and must
 * not become the expected standard.
 */
function looksLikeWrappedTitle(text, ...owners) {
  const label = normaliseLabel(text);
  if (label.length < 10 || label.length > 80) return false;
  return owners.some((owner) => {
    const known = normaliseLabel((owner?.title ?? []).join(' '));
    if (known.length < 10) return false;
    const head = known.split(' ').slice(0, 6).join(' ');
    const tail = known.split(' ').slice(-6).join(' ');
    return (
      (head && (head.startsWith(label) || label.startsWith(head))) ||
      (tail && (tail.endsWith(label) || label.endsWith(tail)))
    );
  });
}

// Unit title fragments that turn out to be a glued-in sibling code or an
// empty unit label â€” these never start a real syllabus unit.
const JunkUnitText =
  /^(\d{1,2}(\.\d{1,2}){0,3}\.?|[IVX]+|note|example|refer(ence)?|[a-z])$/i;

const isJunkTitle = (parts) => {
  const text = tidy(parts.join(' '));
  if (!text) return true;
  if (JunkUnitText.test(text)) return true;
  if (text.length < 4) return true;
  return false;
};


/** True when a trailing cell repeats a known TOPIC / SUB TOPIC label. */
function isRepeatedLabel(text, ...owners) {
  const label = normaliseLabel(text);
  if (label.length < 5) return false;
  return owners.some((owner) => {
    const known = normaliseLabel((owner?.title ?? []).join(' '));
    return known.length >= 5 && (known === label || known.includes(label));
  });
}

/**
 * Walk the text and produce one record per specific competence, carrying the
 * unit / sub-topic it belongs to. `lead` holds free text seen while no
 * competence is open â€” that is how wrapped titles are picked up.
 */
function collectRecords(text) {
  const records = [];
  let unit = null;
  let sub = null;
  let comp = null;
  let lead = [];
  let formRanges = []; // [startLine, endLine, form]

  const lines = text.split('\n');

  // Pass 1: find the FORM n headings, so each form's table starts from scratch.
  const formLines = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = /^\s*FORM\s+(\d)\s*$/.exec(lines[i]);
    if (m) formLines.push({ line: i, form: Number(m[1]) });
  }
  if (formLines.length >= 2) {
    for (let i = 0; i < formLines.length; i += 1) {
      const end = i + 1 < formLines.length ? formLines[i + 1].line : lines.length;
      formRanges.push({
        start: formLines[i].line,
        end,
        form: formLines[i].form,
        current: false,
      });
    }
  }

  const flush = () => {
    if (!comp) return;
    // Trailing plain text: the last group is the expected standard, earlier
    // groups are learning activities whose bullet glyph the PDF dropped.
    const groups = comp.tail.filter(
      (group) => !isRepeatedLabel(group, unit, sub) && !looksLikeWrappedTitle(group, unit, sub),
    );
    comp.standard = groups.length ? [groups[groups.length - 1]] : [];
    comp.activities.push(...groups.slice(0, -1));
    delete comp.tail;
    records.push({ unit, sub, comp });
    comp = null;
  };

  const absorbLead = (kind) => {
    if (!lead.length) return;
    if (kind === 'unit') {
      if (unit && !unit.title.length) unit.title = [...lead];
    } else if (sub && !sub.title.length) {
      sub.title = [...lead];
    } else if (unit && !unit.title.length) {
      unit.title = [...lead];
    } else if (sub) {
      appendTitle(sub, lead);
    } else if (unit) {
      appendTitle(unit, lead);
    }
    lead = [];
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const raw = lines[lineIndex];

    // Start a fresh form when its table heading comes up: the same unit codes
    // (e.g. "1.2", "2.2") repeat in every form, so context must not carry over.
    const range = formRanges.find((r) => lineIndex >= r.start && lineIndex < r.end);
    if (range && !range.current) {
      for (const r of formRanges) r.current = false;
      range.current = true;
      flush();
      unit = null;
      sub = null;
      lead = [];
    }

    if (PAGE_MARKER.test(raw.trim())) continue;
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) continue;
    if (DOT_LEADER.test(line) || TABLE_HEADER.test(line)) continue;
    if (/^\s*\d{1,3}\s*$/.test(line)) continue; // stray page number

    const trimmed = line.trim();
    const codes = findCodes(trimmed);

    if (codes.length) {
      // Ignore a false lead-in hit (e.g. a "Competences Â· Activities Â· Standard"
      // cell header fragment shadow) when a better hit follows on the same line.
      const usable = codes.filter((hit) => !(hit.level === 'unit' && isJunkTitle([hit.text]) && codes.length > 1));
      const effective = usable.length ? usable : codes;
      for (const hit of effective) {
        flush();
        absorbLead(hit.level);

        if (hit.level === 'unit') {
          unit = { segments: hit.segments, title: hit.text ? [hit.text] : [] };
          sub = null;
        } else if (hit.level === 'subtopic') {
          sub = { segments: hit.segments, title: hit.text ? [hit.text] : [] };
        } else {
          // Competence: keep the open sub-topic unless the printed code is a
          // typo (CDC slips such as competence "2.2.1" inside sub-topic 1.2.1).
          let owner = sub;
          if (
            owner &&
            (owner.segments[1] !== hit.segments[1] || owner.segments[2] !== hit.segments[2])
          ) {
            owner = null;
          }
          if (!owner) {
            sub = { segments: hit.segments.slice(0, 3), title: [] };
            owner = sub;
          }
          if (hit.lead) {
            if (!owner.title.length) owner.title = [hit.lead];
            else appendTitle(owner, [hit.lead]);
          }
          if (!unit) unit = { segments: hit.segments.slice(0, 2), title: [] };
          comp = {
            segments: [...owner.segments, hit.segments[3]],
            statement: hit.text ? [hit.text] : [],
            activities: [],
            standard: [],
            tail: [],
            sawBullet: false,
          };
        }
        lead = [];
      }
      continue;
    }

    if (BULLET.test(line)) {
      if (!comp) continue;
      const item = trimmed.replace(BULLET, '').trim();
      const last = comp.activities[comp.activities.length - 1];
      if (last && !terminal(last) && /^[a-z(]/.test(item)) {
        comp.activities[comp.activities.length - 1] = `${last} ${item}`;
      } else {
        comp.activities.push(item);
      }
      comp.sawBullet = true;
      continue;
    }

    if (!comp) {
      lead.push(trimmed);
    } else if (!comp.sawBullet) {
      comp.statement.push(trimmed);
    } else {
      // After the bullets: lowercase fragments continue the last activity,
      // anything else starts/finishes the expected standard.
      const last = comp.activities[comp.activities.length - 1];
      if (last && !terminal(last) && /^[a-z(=]/.test(trimmed)) {
        comp.activities[comp.activities.length - 1] = `${last} ${trimmed}`;
      } else {
        const prev = comp.tail[comp.tail.length - 1];
        if (prev && !terminal(prev)) comp.tail[comp.tail.length - 1] = `${prev} ${trimmed}`;
        else comp.tail.push(trimmed);
      }
    }
  }
  flush();
  return records;
}

/**
 * Some syllabuses list several competences and then one shared activity list for
 * the group (Computer Studies 1.1.1.1-1.1.1.3). Share that list with the group.
 */
function shareGroupedActivities(records) {
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (record.comp.activities.length) continue;
    let j = i + 1;
    while (j < records.length && !records[j].comp.activities.length) j += 1;
    const next = records[j];
    if (!next) continue;
    const tail = (r) => r.comp.segments.slice(0, 3).join('.');
    if (tail(record) !== tail(next)) continue;
    record.comp.activities = [...next.comp.activities];
    record.comp.standard = [...next.comp.standard];
  }
  return records;
}

const joinParts = (parts) => tidy(parts.join(' '));

/** Wrap the sentences CDC prints for a competence into the app's lesson shape. */
function toLesson(record) {
  const statement =
    sentence(joinParts(record.comp.statement)) || sentence(record.comp.activities[0] ?? '');
  const activities = record.comp.activities.map((a) => sentence(a)).filter(Boolean);
  const standard = sentence(joinParts(record.comp.standard));

  return {
    id: idOf(record.comp.segments),
    title: shortTitle(statement, 120) || idOf(record.comp.segments),
    durationMin: 60,
    objectives: activities.length ? activities : [statement].filter(Boolean),
    outline: activities,
    resources: [],
    assessment: standard || undefined,
  };
}

/**
 * Assemble records into `GradePlan[]`.
 *
 * The CDC syllabuses do not label terms: units simply run 1.1 â€¦ 1.7 through a
 * form. The portal is term-driven, so each form's units are split into three even
 * groups (Term 1/2/3). Nothing is invented â€” the split is the only reading
 * applied, and each term keeps its syllabus unit codes as the theme.
 */
export function buildCurriculum(records, { subjectDescription } = {}) {
  const forms = new Map();
  for (const record of shareGroupedActivities(records)) {
    const form = record.comp.segments[0];
    if (!forms.has(form)) forms.set(form, new Map());
    const units = forms.get(form);

    const unitKey = (record.unit?.segments ?? record.comp.segments.slice(0, 2)).join('.');
    if (!units.has(unitKey)) {
      units.set(unitKey, { title: tidy((record.unit?.title ?? []).join(' ')), topics: new Map() });
    }
    const unit = units.get(unitKey);

    const topicKey = idOf(record.comp.segments.slice(0, 3));
    if (!unit.topics.has(topicKey)) {
      unit.topics.set(topicKey, {
        id: topicKey,
        title: tidy((record.sub?.title ?? []).join(' ')),
        lessons: [],
      });
    }
    unit.topics.get(topicKey).lessons.push(toLesson(record));
  }

  const grades = [];
  for (const form of [...forms.keys()].sort((a, b) => a - b)) {
    const units = [...forms.get(form).entries()].map(([key, value]) => ({ key, ...value }));
    const perTerm = Math.ceil(units.length / 3) || 1;
    const chunks = [
      units.slice(0, perTerm),
      units.slice(perTerm, perTerm * 2),
      units.slice(perTerm * 2),
    ];
    const gradeId = `form-${form}`;

    const terms = chunks.map((chunk, index) => ({
      id: `${gradeId}-t${index + 1}`,
      label: `Term ${index + 1}`,
      theme: chunk.map((u) => u.title || `Unit ${u.key}`).join('; '),
      weeks: 12,
      topics: chunk.flatMap((unit) =>
        [...unit.topics.values()].map((topic) => ({
          id: topic.id,
          title: topic.title || topic.id.replace(/-/g, '.'),
          overview:
            [unit.title, topic.title].filter(Boolean).join(' - ') || topic.id.replace(/-/g, '.'),
          weeks: `Unit ${unit.key}`,
          keyTerms: [],
          lessons: topic.lessons,
          homeworkBank: [],
          quizQuestions: [],
        })),
      ),
    }));

    grades.push({
      id: gradeId,
      grade: `Form ${form}`,
      level: 'Ordinary Level',
      description:
        subjectDescription ??
        `Form ${form}: ${units
          .slice(0, 4)
          .map((u) => u.title || `Unit ${u.key}`)
          .join(', ')}${units.length > 4 ? 'â€¦' : ''}`,
      terms: terms.filter((t) => t.topics.length),
    });
  }
  return grades;
}

/** Parse one syllabus text into curriculum grades plus a small quality report. */
export function parseSyllabus(text, options = {}) {
  const records = collectRecords(text);
  const grades = buildCurriculum(records, options);
  const allTopics = grades.flatMap((g) => g.terms.flatMap((t) => t.topics));
  const stats = {
    records: records.length,
    forms: grades.length,
    topics: allTopics.length,
    lessons: allTopics.reduce((n, t) => n + t.lessons.length, 0),
    withActivities: records.filter((r) => r.comp.activities.length).length,
    withStandard: records.filter((r) => r.comp.standard.length).length,
    unnamedTopics: allTopics.filter((t) => !/[A-Za-z]{3,}/.test(t.title)).length,
  };
  return { grades, records, stats };
}

/**
 * Auto-derive a Term 3 weekly plan from a form's term-3 topics, mirroring the
 * hand-written plans that ship with the app: weeks 1-6 lessons Â· week 7
 * mid-term exams Â· weeks 8+ lessons Â· revision Â· end-of-term exams.
 */
export function buildTerm3Weeks(grade, { subjectName, resources = [] } = {}) {
  const term = grade.terms.find((t) => t.id.endsWith('-t3'));
  if (!term) return [];

  const lessons = term.topics.flatMap((topic) => topic.lessons.map((lesson) => ({ topic, lesson })));
  if (!lessons.length) return [];

  const spread = (items, count) =>
    items.length <= count
      ? items
      : Array.from({ length: count }, (_, i) => items[Math.floor((i * items.length) / count)]);

  const firstHalf = spread(lessons, Math.min(6, lessons.length));
  const takenFirst = new Set(firstHalf.map((x) => x.lesson.id));
  const remaining = lessons.filter((x) => !takenFirst.has(x.lesson.id));
  const secondHalf = spread(remaining, Math.min(4, remaining.length));
  const aids = [...resources, 'Whiteboard & markers'];

  const lessonWeek = ({ topic, lesson }) => ({
    type: 'lesson',
    title: shortTitle(lesson.title, 70),
    focus: lesson.id.replace(/-/g, '.'),
    objectives:
      lesson.objectives.length >= 2
        ? lesson.objectives.slice(0, 3)
        : [lesson.title, ...lesson.objectives].slice(0, 3),
    starter: `Recap the key ideas of "${topic.title}" and collect learners' answers on the board.`,
    development: (lesson.outline.length ? lesson.outline : [lesson.title]).slice(0, 6),
    plenary: `Learners say one thing they can now do in "${topic.title}" and one question they still have.`,
    resources: [...aids, topic.title].filter(Boolean),
    homework: `Complete the practice exercise on "${shortTitle(lesson.title, 80)}" in the class workbook.`,
    assessment: lesson.assessment ?? 'Competence demonstrated correctly',
  });

  const examWeek = (type, title, note) => ({
    type,
    title,
    focus: 'Weeks in review',
    objectives: [`Assess learner progress in ${subjectName}`, 'Give feedback on common errors'],
    starter: 'Remind learners of the examination rules and the time allowed.',
    development: [`Administer the ${title.toLowerCase()} under examination conditions`, note],
    plenary: 'Collect all scripts and confirm every learner has submitted.',
    resources: [...aids, 'Past examination papers'],
    homework: 'Correct the paper and note the topics that need revision.',
    assessment: 'Marked scripts and recorded marks',
  });

  const scheduled = [
    ...firstHalf,
    examWeek('exam', 'Mid-Term Examination', 'Cover the competences taught in weeks 1-6.'),
    ...secondHalf,
    examWeek('revision', 'Revision & Consolidation', 'Revise the weak areas flagged by the mid-term results.'),
    examWeek('exam', 'End of Term Examination', `Cover the whole of ${term.label} (weeks 1-13).`),
  ];

  return scheduled.map((week, index) => ({ week: index + 1, ...week }));
}

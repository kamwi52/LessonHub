// Generate app-ready curriculum and Term 3 planner data from repaired CDC text.
//   npm run syllabus:generate              # priority subjects
//   npm run syllabus:generate -- biology   # one or more subject ids
//   npm run syllabus:generate -- --all     # every mapped subject
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { selectSources } from './sources.mjs';
import { parseSyllabus } from './parse.mjs';
import { dataDir, textDir } from './paths.mjs';

const sources = selectSources({
  all: process.argv.includes('--all'),
  only: process.argv.slice(2).filter((arg) => !arg.startsWith('--')),
});
const selected = sources.filter((source) => ['biology', 'chemistry', 'physics'].includes(source.id));
if (!selected.length) {
  console.log('No generated science sources selected.');
  process.exit(0);
}

const json = (value) => JSON.stringify(value, null, 2);
const hasWords = (text) => /[A-Za-z]{3,}/.test(text ?? '');
const short = (text, max = 90) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
};
const fallbackTitle = (topic, unit) => {
  if (hasWords(topic.title)) return topic.title;
  if (hasWords(unit)) return unit;
  const first = topic.lessons[0]?.title;
  return hasWords(first)
    ? `Syllabus focus: ${short(first, 72)}`
    : `Syllabus topic ${topic.id.replace(/-/g, '.')}`;
};

function makeWeeks(grade, source) {
  const term = grade.terms.find((item) => item.id.endsWith('-t3'));
  if (!term) return [];
  const lessons = term.topics.flatMap((topic) => topic.lessons.map((lesson) => ({ topic, lesson })));
  if (!lessons.length) return [];
  const aids = source.meta.name === 'Biology' ? ['Biology laboratory', 'Specimens', 'Microscope', 'Whiteboard & markers'] : source.meta.name === 'Chemistry' ? ['Chemistry laboratory', 'Reagents', 'Safety equipment', 'Whiteboard & markers'] : ['Physics laboratory', 'Measuring instruments', 'Apparatus', 'Whiteboard & markers'];
  const lessonWeek = ({ topic, lesson }, week) => ({ week, type: 'lesson', title: short(lesson.title, 72), focus: lesson.id.replace(/-/g, '.'), objectives: (lesson.objectives.length ? lesson.objectives : [lesson.title]).slice(0, 3), starter: `Recall the key ideas of ${topic.title} and write one example.`, development: (lesson.outline.length ? lesson.outline : [lesson.title]).slice(0, 6), plenary: `Explain one thing learned in ${topic.title} and answer one review question.`, resources: [...aids, topic.title].filter(Boolean), homework: `Complete the practice task on ${short(lesson.title, 72)}.`, assessment: lesson.assessment ?? 'Competence demonstrated in the lesson task' });
  const examWeek = (week, type, title, note) => ({ week, type, title, focus: type === 'revision' ? 'Term 3 consolidation' : 'Weeks in review', objectives: [`Assess progress in ${source.meta.name}`, 'Give feedback on common errors'], starter: 'Explain the examination instructions and expected evidence.', development: [note, 'Learners complete the paper under examination conditions.'], plenary: 'Collect scripts and confirm all learners have submitted.', resources: [...aids, 'Past examination papers'], homework: 'Correct the paper and list topics requiring revision.', assessment: 'Marked scripts and recorded marks' });
  const picks = Array.from({ length: 10 }, (_, index) => lessons[index % lessons.length]);
  return [...picks.slice(0, 6).map((item, index) => lessonWeek(item, index + 1)), examWeek(7, 'exam', 'Mid-Term Examination', 'Cover the competences taught in weeks 1–6.'), ...picks.slice(6).map((item, index) => lessonWeek(item, index + 8)), examWeek(12, 'revision', 'Revision & Consolidation', 'Revise weak areas identified from the mid-term.'), examWeek(13, 'exam', 'End of Term Examination', `Cover the whole of ${term.label}.`)];
}

const exports = { biology: 'BIOLOGY_CURRICULUM', chemistry: 'CHEMISTRY_CURRICULUM', physics: 'PHYSICS_CURRICULUM' };
const weekExports = { biology: 'BIOLOGY_TERM3_WEEKS', chemistry: 'CHEMISTRY_TERM3_WEEKS', physics: 'PHYSICS_TERM3_WEEKS' };
await mkdir(dataDir, { recursive: true });
for (const source of selected) {
  const text = await readFile(join(textDir, `${source.slug}.txt`), 'utf8');
  const parsed = parseSyllabus(text, { subjectDescription: source.meta.description });
  for (const grade of parsed.grades) {
    const topics = grade.terms.flatMap((term) => term.topics);
    if (!grade.terms.some((term) => term.id.endsWith('-t3')) && topics.length >= 3) {
      const size = Math.ceil(topics.length / 3);
      grade.terms = [0, 1, 2].map((index) => ({ id: `${grade.id}-t${index + 1}`, label: `Term ${index + 1}`, theme: `Syllabus topics ${index * size + 1}–${Math.min((index + 1) * size, topics.length)}`, weeks: 12, topics: topics.slice(index * size, (index + 1) * size) }));
    }
    for (const term of grade.terms) for (const topic of term.topics) {
      const unit = topic.overview.split(' - ')[0];
      topic.title = fallbackTitle(topic, hasWords(unit) ? unit : '');
      topic.overview = [unit, topic.title].filter(Boolean).join(' - ') || topic.id.replace(/-/g, '.');
      topic.weeks = unit ? `Unit ${unit}` : 'Syllabus topic';
      topic.keyTerms ??= []; topic.homeworkBank ??= []; topic.quizQuestions ??= [];
    }
  }
  const weeks = Object.fromEntries(parsed.grades.map((grade) => [grade.id, makeWeeks(grade, source)]));
  await writeFile(join(dataDir, `syllabus-${source.id}.ts`), `// AUTO-GENERATED from ${source.drive}. Do not edit by hand.\nimport type { GradePlan } from './ict-curriculum';\n\nexport const ${exports[source.id]}: GradePlan[] = ${json(parsed.grades)};\n`, 'utf8');
  await writeFile(join(dataDir, `${source.id}-t3-weeks.ts`), `// AUTO-GENERATED from ${source.drive}. Do not edit by hand.\nimport type { WeekPlan } from './ict-curriculum';\n\nexport const ${weekExports[source.id]}: Record<string, WeekPlan[]> = ${json(weeks)};\n`, 'utf8');
  console.log(`✅ ${source.id}: ${parsed.stats.forms} forms · ${parsed.stats.topics} topics · ${parsed.stats.lessons} lessons · ${Object.values(weeks).flat().length} weeks`);
}


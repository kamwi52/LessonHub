// Derive Schemes of Work and Linda-format Lesson Plans from a subject's Term 3 weekly plans.
import type { GradePlan, TermPlan, Topic, WeekPlan } from './ict-curriculum';
import { DEFAULT_SUBJECT_ID, getSubject, getSubjectGrade, getSubjectTerm3 } from './subjects';

export const SCHOOL_NAME = 'LINDA SECONDARY SCHOOL';

// Linda-format documents: every subject is timetabled as two 80-minute lessons
// per week, so one weekly plan prints as two lesson plans (Lesson 1 of 2, …).
export const LESSONS_PER_WEEK = 2;
export const LESSON_MINUTES = 80;
export const LESSON_DURATION = `${LESSON_MINUTES} MINUTES`;

// ---- Subject helpers: printed docs stay in step with the subject registry ----
export function getSubjectName(subjectId: string): string {
  return getSubject(subjectId)?.name ?? 'ICT';
}

export function getSyllabusRef(subjectId: string): string {
  return getSubject(subjectId)?.syllabusRef ?? 'CDC Ordinary Level Syllabus';
}

export function getLessonRef(subjectId: string): string {
  return getSubject(subjectId)?.lessonRef ?? 'CDC Ordinary Level Syllabus';
}

export interface SchemeRow {
  week: number;
  type: 'lesson' | 'exam' | 'revision';
  topic: string;
  competence: string;
  keyConcept: string;
  activity: string;
  assessment: string;
  materials: string;
  expectedStandard: string;
  reference: string;
}

const ASSESS_METHOD: Record<WeekPlan['type'], string> = {
  lesson: 'Demonstration, Hands-On Practice, Group Discussion, Blended Learning',
  exam: 'Written Test, Practical Task',
  revision: 'Quiz, Peer Review, Past-Paper Practice',
};

export function getCourse(subjectId: string = DEFAULT_SUBJECT_ID): GradePlan[] {
  return getSubject(subjectId)?.curriculum ?? [];
}

/** Grades that actually carry a Term 3 plan (drops ICT's placeholder grades). */
export function getForms(subjectId: string = DEFAULT_SUBJECT_ID): GradePlan[] {
  return getCourse(subjectId).filter((g) => g.terms.some((t) => t.id.endsWith('-t3')));
}

export function getGradeById(subjectId: string, gradeId: string): GradePlan | undefined {
  return getSubjectGrade(subjectId, gradeId);
}

export function getTerm3(subjectId: string, gradeId: string): TermPlan | undefined {
  return getSubjectTerm3(subjectId, gradeId);
}

/** Numeric segments of a syllabus code, e.g. '1.4.1.2' -> [1, 4, 1, 2]. */
function codeSegments(code: string): number[] {
  return code.split('.').map(Number).filter((n) => Number.isInteger(n) && n > 0);
}

/**
 * Pick the topic that best matches a syllabus code: the one sharing the longest
 * run of leading segments (e.g. '1.4.1.2' -> topic 1-4-1 rather than 1-4-2).
 */
function matchTopic(topics: Topic[], code: number[]): Topic | undefined {
  let best: Topic | undefined;
  let bestScore = 0;
  for (const t of topics) {
    const seg = t.id.split('-').map(Number);
    if (seg.some((n) => !Number.isInteger(n))) continue;
    let score = 0;
    while (score < seg.length && score < code.length && seg[score] === code[score]) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return bestScore >= 2 ? best : undefined;
}

/** Build scheme-of-work rows for a term from its weekly plans. */
export function buildSchemeRows(subjectId: string, gradeId: string, termId: string): SchemeRow[] {
  const term = getGradeById(subjectId, gradeId)?.terms.find((t) => t.id === termId);
  if (!term) return [];
  const reference = getSyllabusRef(subjectId);
  const rows: SchemeRow[] = [];
  for (const w of term.weekPlans ?? []) {
    const firstRef = (w.focus.split('+')[0] ?? '').trim();
    const parts = codeSegments(firstRef);
    let topic = '';
    let subtopic = '';
    let competence = '';
    if (parts.length >= 2) {
      const t = matchTopic(term.topics, parts);
      if (t) {
        topic = `${t.id.split('-').slice(0, 2).join('.')} ${t.overview.split(' - ')[0]}`;
        subtopic = `${t.id.replace(/-/g, '.')} ${t.title}`;
        const lesson = t.lessons.find((l) => l.id === parts.join('-'));
        competence = `${parts.join('.')} ${lesson?.title ?? w.title}`;
      }
    }
    if (!topic) {
      topic = w.type === 'exam' ? 'Examinations' : 'Revision & Assessment';
      subtopic = '—';
      competence = w.title;
    }
    rows.push({
      week: w.week,
      type: w.type,
      topic,
      competence,
      keyConcept: subtopic,
      activity: w.development.map((d) => `• ${d}`).join(' '),
      assessment: ASSESS_METHOD[w.type],
      materials: w.resources.join(', '),
      expectedStandard: w.assessment ?? w.objectives.join('; '),
      reference,
    });
  }
  return rows;
}

export interface PlanTable {
  part: string;
  time: string;
  content: string[];
  methodology: string;
  learner: string;
  refAids: string;
}

export interface LessonPlanDoc {
  week: number;
  /** 1-based lesson number inside the week (Lesson 1 of 2, Lesson 2 of 2 …). */
  lesson: number;
  /** How many lesson plans this week was split into. */
  lessonsInWeek: number;
  type: WeekPlan['type'];
  className: string;
  subject: string;
  topic: string;
  subtopic: string;
  duration: string;
  objectives: string;
  aids: string;
  rows: PlanTable[];
}

interface PlanHeader {
  topic: string;
  subtopic: string;
  aids: string;
}

/** Resolve the topic / subtopic / resources printed at the top of a week's plan. */
function planHeader(subjectId: string, gradeId: string, termId: string, w: WeekPlan): PlanHeader {
  const term = getGradeById(subjectId, gradeId)?.terms.find((t) => t.id === termId);
  const firstRef = (w.focus.split('+')[0] ?? '').trim();
  const parts = codeSegments(firstRef);
  let topic = 'Revision / Examination';
  let subtopic = w.title;
  if (parts.length >= 2 && term) {
    const t = matchTopic(term.topics, parts);
    if (t) {
      topic = `${t.id.split('-').slice(0, 2).join('.')} ${t.overview.split(' - ')[0]}`;
      subtopic = `${t.id.replace(/-/g, '.')} ${t.title}`;
    }
  }
  return { topic, subtopic, aids: w.resources.join(', ') };
}

/** Build ONE Linda-format lesson plan covering a whole week (single-lesson view). */
export function buildLessonPlan(
  subjectId: string,
  gradeId: string,
  termId: string,
  w: WeekPlan,
  className: string,
): LessonPlanDoc {
  const head = planHeader(subjectId, gradeId, termId, w);
  const aids = head.aids;
  const rows: PlanTable[] = [
    {
      part: 'Intro',
      time: '10 min',
      content: [w.starter, ...w.objectives.map((o) => `Objective: ${o}`)],
      methodology: 'QPN',
      learner: 'Answering questions',
      refAids: 'Projector, Chalkboard, Internet',
    },
    {
      part: 'Dev',
      time: '40 min',
      content: w.development,
      methodology: 'Demonstration, Lecture, Q/A',
      learner: 'Answering questions and asking questions',
      refAids: aids,
    },
    {
      part: 'App',
      time: '20 min',
      content: [
        w.homework
          ? `Practical exercise: ${w.homework}`
          : w.type === 'exam'
            ? 'Exam task under timed conditions'
            : 'Practical exercise applying the lesson content on the computer',
      ],
      methodology: w.type === 'exam' ? 'Exam supervision' : 'Using the computer',
      learner: 'Answering questions and consultation',
      refAids: aids,
    },
    {
      part: 'Con',
      time: '10 min',
      content: [w.plenary],
      methodology: 'Lecture, Q/A',
      learner: 'Answering and asking questions',
      refAids: '',
    },
  ];
  return {
    week: w.week,
    lesson: 1,
    lessonsInWeek: 1,
    type: w.type,
    className,
    subject: getSubjectName(subjectId),
    topic: head.topic,
    subtopic: head.subtopic,
    duration: LESSON_DURATION,
    objectives: 'PSBAT ' + w.objectives.join('; '),
    aids,
    rows,
  };
}

/** Split a list into two halves; the first half keeps the extra item when odd. */
function splitInHalf<T>(items: T[]): [T[], T[]] {
  const cut = Math.ceil(items.length / 2);
  return [items.slice(0, cut), items.slice(cut)];
}

/**
 * Build the printable lesson plans for ONE week of the term. Every subject is
 * timetabled as two 80-minute lessons a week, so a weekly plan becomes:
 *   Lesson 1 — the week's introduction, first-half development and guided practice
 *   Lesson 2 — a recap, the remaining development, the practical exercise/homework
 * Exam and revision weeks split the same way, so every week prints two plans.
 */
export function buildWeekLessonPlans(
  subjectId: string,
  gradeId: string,
  termId: string,
  w: WeekPlan,
  className: string,
): LessonPlanDoc[] {
  const head = planHeader(subjectId, gradeId, termId, w);
  const [objectivesFirst, objectivesSecond] = splitInHalf(w.objectives);
  const [developmentFirst, developmentSecond] = splitInHalf(w.development);
  // A one-item list must not leave a lesson with nothing to teach.
  const objectives1 = objectivesFirst.length ? objectivesFirst : w.objectives;
  const objectives2 = objectivesSecond.length ? objectivesSecond : objectives1;
  const development1 = developmentFirst.length ? developmentFirst : w.development;
  const development2 = developmentSecond.length ? developmentSecond : development1;
  const guidedPractice = development1[development1.length - 1] ?? w.title;
  const application = w.homework
    ? `Practical exercise: ${w.homework}`
    : w.type === 'exam'
      ? 'Exam task under timed conditions'
      : 'Practical exercise applying the lesson content on the computer';
  const applicationMethod = w.type === 'exam' ? 'Exam supervision' : 'Using the computer';

  const rowsFor = (lesson: number): PlanTable[] => [
    {
      part: 'Intro',
      time: '10 min',
      content: lesson === 1
        ? [w.starter, ...objectives1.map((o) => `Objective: ${o}`)]
        : ['Recap Lesson 1: learners state the key points covered.', ...objectives2.map((o) => `Objective: ${o}`)],
      methodology: 'QPN',
      learner: 'Answering questions',
      refAids: 'Projector, Chalkboard, Internet',
    },
    {
      part: 'Dev',
      time: '40 min',
      content: lesson === 1 ? development1 : development2,
      methodology: 'Demonstration, Lecture, Q/A',
      learner: 'Answering questions and asking questions',
      refAids: head.aids,
    },
    {
      part: 'App',
      time: '20 min',
      content: lesson === 1 ? [`Guided practice: ${guidedPractice}`] : [application],
      methodology: applicationMethod,
      learner: 'Answering questions and consultation',
      refAids: head.aids,
    },
    {
      part: 'Con',
      time: '10 min',
      content: lesson === 1
        ? ['Checkpoint: learners state one thing they have learnt in Lesson 1.']
        : [w.plenary],
      methodology: 'Lecture, Q/A',
      learner: 'Answering and asking questions',
      refAids: '',
    },
  ];

  return Array.from({ length: LESSONS_PER_WEEK }, (_, i) => {
    const lesson = i + 1;
    return {
      week: w.week,
      lesson,
      lessonsInWeek: LESSONS_PER_WEEK,
      type: w.type,
      className,
      subject: getSubjectName(subjectId),
      topic: head.topic,
      subtopic: head.subtopic,
      duration: LESSON_DURATION,
      objectives: 'PSBAT ' + (lesson === 1 ? objectives1 : objectives2).join('; '),
      aids: head.aids,
      rows: rowsFor(lesson),
    };
  });
}

// Derive Schemes of Work and Linda-format Lesson Plans from a subject's Term 3 weekly plans.
import type { GradePlan, TermPlan, Topic, WeekPlan } from './ict-curriculum';
import { DEFAULT_SUBJECT_ID, getSubject, getSubjectGrade, getSubjectTerm3 } from './subjects';

export const SCHOOL_NAME = 'LINDA SECONDARY SCHOOL';

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

/** Build a Linda-format lesson plan document from a weekly plan. */
export function buildLessonPlan(
  subjectId: string,
  gradeId: string,
  termId: string,
  w: WeekPlan,
  className: string,
): LessonPlanDoc {
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
  const aids = w.resources.join(', ');
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
    type: w.type,
    className,
    subject: getSubjectName(subjectId),
    topic,
    subtopic,
    duration: '80 MINUTES',
    objectives: 'PSBAT ' + w.objectives.join('; '),
    aids,
    rows,
  };
}

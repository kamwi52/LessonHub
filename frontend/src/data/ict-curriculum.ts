// LessonsHub ICT Curriculum Framework — Senior School Planner Design
// Grade -> Term -> Topic -> Lessons + Homework + Practical + Quiz
// Paste your syllabus text any time and I will stitch it in here.
import { GRADE7 } from './curriculum-grade7';
import { GRADE8 } from './curriculum-grade8';
import { GRADE9 } from './curriculum-grade9';
import { ICT_SYLLABUS } from './syllabus-ict';
import { TERM3_WEEKS } from './term3-weeks';
export interface Lesson {
  id: string; title: string; durationMin: number;
  objectives: string[]; outline: string[]; resources: string[];
  homework?: string; assessment?: string;
}
export interface Topic {
  id: string; title: string; overview: string; weeks: string;
  keyTerms: string[]; lessons: Lesson[];
  practicalTask?: string; homeworkBank: string[]; quizQuestions: string[];
}
export interface TermPlan {
  id: string; label: string; theme: string; weeks: number; topics: Topic[];
  weekPlans?: WeekPlan[];
}
/** A single week in a term's weekly plan (Term 3 weekly planner). */
export interface WeekPlan {
  week: number;
  type: 'lesson' | 'exam' | 'revision';
  title: string;
  focus: string;            // syllabus reference, e.g. '1.4.1.1' or 'Weeks 1-6'
  objectives: string[];
  starter: string;
  development: string[];    // step-by-step teaching activities
  plenary: string;
  resources: string[];
  homework?: string;
  assessment?: string;
}
export interface GradePlan {
  id: string; grade: string; level: string; description: string; terms: TermPlan[];
}
export const ICT_CURRICULUM: GradePlan[] = [
  ...ICT_SYLLABUS, // real CDC syllabus (Forms 1-4)
  GRADE7, GRADE8, GRADE9, // starter placeholders kept for reference
];

// Attach Term 3 weekly lesson plans (weeks 1-13) to each Form.
for (const g of ICT_CURRICULUM) {
  const weeks = TERM3_WEEKS[g.id];
  if (!weeks) continue;
  const t3 = g.terms.find((t) => t.id.endsWith('-t3'));
  if (t3) {
    t3.weekPlans = weeks;
    t3.weeks = 13; // 1-6 lessons, 7 mid-term, 8-11 lessons, 12 revision, 13 exams
  }
}
// Grades are merged from per-grade files below (keeps edits small).
// Import order = display order in the portal.
export function getGrade(id: string) { return ICT_CURRICULUM.find((g) => g.id === id); }
export function getTerm(gradeId: string, termId: string) {
  return getGrade(gradeId)?.terms.find((t) => t.id === termId);
}
export function getTopic(gradeId: string, termId: string, topicId: string) {
  return getTerm(gradeId, termId)?.topics.find((t) => t.id === topicId);
}

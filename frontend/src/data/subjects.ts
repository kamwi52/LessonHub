// Subject registry — every subject the portal knows about.
// Each subject points to its curriculum data + Term 3 weekly plans.
// Add a new subject here, drop its data file in /data, and it appears on the catalog automatically.

import type { GradePlan, TermPlan, Topic } from './ict-curriculum';
import type { WeekPlan } from './ict-curriculum';
import { ICT_CURRICULUM } from './ict-curriculum';
import { TERM3_WEEKS as ICT_TERM3_WEEKS } from './term3-weeks';
import { MATH_CURRICULUM } from './math-curriculum';
import { MATH_TERM3_WEEKS } from './math-t3-weeks';
import { COMPUTER_STUDIES } from './syllabus-computer-studies';
import { CS_TERM3_WEEKS } from './cs-t3-weeks';
import { BIOLOGY_CURRICULUM } from './syllabus-biology';
import { BIOLOGY_TERM3_WEEKS } from './biology-t3-weeks';
import { CHEMISTRY_CURRICULUM } from './syllabus-chemistry';
import { CHEMISTRY_TERM3_WEEKS } from './chemistry-t3-weeks';
import { PHYSICS_CURRICULUM } from './syllabus-physics';
import { PHYSICS_TERM3_WEEKS } from './physics-t3-weeks';

// Attach Term 3 weekly plans (weeks 1-13) to every grade that has a `-t3` term.
for (const g of ICT_CURRICULUM) {
  const weeks = ICT_TERM3_WEEKS[g.id];
  const t3 = g.terms.find((t) => t.id.endsWith('-t3'));
  if (weeks && t3) { t3.weekPlans = weeks; t3.weeks = 13; }
}
for (const g of MATH_CURRICULUM) {
  const weeks = MATH_TERM3_WEEKS[g.id];
  const t3 = g.terms.find((t) => t.id.endsWith('-t3'));
  if (weeks && t3) { t3.weekPlans = weeks; t3.weeks = 13; }
}
for (const g of COMPUTER_STUDIES) {
  const weeks = CS_TERM3_WEEKS[g.id];
  const t3 = g.terms.find((t) => t.id.endsWith('-t3'));
  if (weeks && t3) { t3.weekPlans = weeks; t3.weeks = 13; }
}
for (const [curriculum, planners] of [
  [BIOLOGY_CURRICULUM, BIOLOGY_TERM3_WEEKS],
  [CHEMISTRY_CURRICULUM, CHEMISTRY_TERM3_WEEKS],
  [PHYSICS_CURRICULUM, PHYSICS_TERM3_WEEKS],
] as const) {
  for (const g of curriculum) {
    const weeks = planners[g.id];
    const t3 = g.terms.find((t) => t.id.endsWith('-t3'));
    if (weeks && t3) { t3.weekPlans = weeks; t3.weeks = 13; }
  }
}

export type SubjectEntry = {
  id: string;
  name: string;
  shortCode: string;
  icon: string;
  color: string; // tailwind color for subject chips
  description: string;
  grades: string[]; // e.g. ['Form 1','Form 2','Form 3','Form 4']
  levels: string[]; // e.g. ['Ordinary Level','Advanced Level']
  term3Weeks: Record<string, WeekPlan[]>;
  curriculum: GradePlan[];
  status: 'ready' | 'coming';
  featured?: boolean; // show on dashboard
  syllabusRef: string; // reference line printed on schemes of work
  lessonRef: string; // reference line printed on lesson plans
};

export const SUBJECTS: SubjectEntry[] = [
  {
    id: 'ict',
    name: 'Information & Communication Technology',
    shortCode: 'ICT',
    icon: '💻',
    color: 'blue',
    description:
      'Computer systems, networking, internet, productivity tools, digital citizenship and cybersecurity — Zambia CDC O-Level syllabus (Forms 1-4).',
    grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    levels: ['Ordinary Level'],
    term3Weeks: ICT_TERM3_WEEKS,
    curriculum: ICT_CURRICULUM,
    status: 'ready',
    featured: true,
    syllabusRef: 'CDC Ordinary Level ICT Syllabus, Forms 1-4',
    lessonRef: "2024 CDC O-Level ICT Syllabus Forms 1-4; Teacher's Notes and Handouts & the Internet",
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    shortCode: 'MATH',
    icon: '📐',
    color: 'emerald',
    description:
      'Number, Algebra, Geometry, Statistics & Probability — Zambia CDC O-Level syllabus (Forms 1-4).',
    grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    levels: ['Ordinary Level'],
    term3Weeks: MATH_TERM3_WEEKS,
    curriculum: MATH_CURRICULUM,
    status: 'ready',
    featured: true,
    syllabusRef: 'CDC Ordinary Level Mathematics Syllabus, Forms 1-4',
    lessonRef: "2024 CDC O-Level Mathematics Syllabus Forms 1-4; Pupil's Textbook, Calculator & Graph Paper",
  },
  {
    id: 'biology',
    name: 'Biology',
    shortCode: 'BIO',
    icon: '🧬',
    color: 'green',
    description: 'Cells, transport, nutrition, respiration, reproduction, genetics and ecology — CDC O-Level syllabus (Forms 1-4).',
    grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    levels: ['Ordinary Level'],
    term3Weeks: BIOLOGY_TERM3_WEEKS,
    curriculum: BIOLOGY_CURRICULUM,
    status: 'ready',
    featured: true,
    syllabusRef: 'CDC Ordinary Level Biology Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Biology Syllabus Forms 1-4; Biology Laboratory & Specimens',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    shortCode: 'CHEM',
    icon: '⚗️',
    color: 'amber',
    description: 'Matter, atomic structure, reactions, stoichiometry, acids and bases, metals and organic chemistry — CDC O-Level syllabus (Forms 1-4).',
    grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    levels: ['Ordinary Level'],
    term3Weeks: CHEMISTRY_TERM3_WEEKS,
    curriculum: CHEMISTRY_CURRICULUM,
    status: 'ready',
    featured: true,
    syllabusRef: 'CDC Ordinary Level Chemistry Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Chemistry Syllabus Forms 1-4; Chemistry Laboratory & Reagents',
  },
  {
    id: 'physics',
    name: 'Physics',
    shortCode: 'PHY',
    icon: '🧲',
    color: 'indigo',
    description: 'Measurement, mechanics, heat, waves, electricity, magnetism and modern physics — CDC O-Level syllabus (Forms 1-4).',
    grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    levels: ['Ordinary Level'],
    term3Weeks: PHYSICS_TERM3_WEEKS,
    curriculum: PHYSICS_CURRICULUM,
    status: 'ready',
    featured: true,
    syllabusRef: 'CDC Ordinary Level Physics Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Physics Syllabus Forms 1-4; Physics Laboratory & Apparatus',
  },
  {
    id: 'computer-studies',
    name: 'Computer Studies',
    shortCode: 'CS',
    icon: '🖥️',
    color: 'violet',
    description:
      'Hardware, Operating Systems, Networking, Productivity Tools, and Multimedia — CDC Syllabus (Grades 8-12).',
    grades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    levels: ['Junior Secondary', 'Senior Secondary'],
    term3Weeks: CS_TERM3_WEEKS,
    curriculum: COMPUTER_STUDIES,
    status: 'ready',
    featured: true,
    syllabusRef: 'CDC Computer Studies Syllabus, Grades 8-12',
    lessonRef: "CDC Computer Studies Syllabus Grades 8-12; Digital Resources",
  },
];

export const DEFAULT_SUBJECT_ID = 'ict';

export const ICT_SUBJECT = SUBJECTS[0];
export const MATH_SUBJECT = SUBJECTS[1];

export const FEATURED_SUBJECTS = SUBJECTS.filter((s) => s.featured);
export const READY_SUBJECTS = SUBJECTS.filter((s) => s.status === 'ready');

export function getSubject(id: string): SubjectEntry | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

/** Resolve a `?subject=` query value, falling back to the default subject. */
export function resolveSubjectId(id?: string | null): string {
  return id && getSubject(id) ? id : DEFAULT_SUBJECT_ID;
}

// Convenience helpers used across the learn pages
export function getSubjectGrades(subjectId: string): GradePlan[] {
  return getSubject(subjectId)?.curriculum ?? [];
}

export function getSubjectForms(subjectId: string): GradePlan[] {
  return getSubjectGrades(subjectId).filter((g) => g.terms.some((t) => t.id.endsWith('-t3')));
}

export function getSubjectGrade(subjectId: string, gradeId: string): GradePlan | undefined {
  return getSubjectGrades(subjectId).find((g) => g.id === gradeId);
}

export function getSubjectTerm(
  subjectId: string,
  gradeId: string,
  termId: string,
): TermPlan | undefined {
  return getSubjectGrade(subjectId, gradeId)?.terms.find((t) => t.id === termId);
}

/** The Term 3 planner for a form (id always ends in `-t3`). */
export function getSubjectTerm3(subjectId: string, gradeId: string): TermPlan | undefined {
  return getSubjectGrade(subjectId, gradeId)?.terms.find((t) => t.id.endsWith('-t3'));
}

export function getSubjectTopic(
  subjectId: string,
  gradeId: string,
  termId: string,
  topicId: string,
): Topic | undefined {
  return getSubjectTerm(subjectId, gradeId, termId)?.topics.find((t) => t.id === topicId);
}

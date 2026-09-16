import type { GradePlan } from './ict-curriculum';
export const GRADE9: GradePlan = {
  id: 'grade-9', grade: 'Grade 9', level: 'Upper Secondary',
  description: 'Systems, web build, Python logic.',
  terms: [{
    id: 't1', label: 'Term 1', theme: 'Systems + Binary', weeks: 8, topics: [
      { id: 'g9-t1-a', title: 'OS + Binary Count', overview: 'OS jobs, RAM, binary.',
        weeks: 'Wk 1-3', keyTerms: ['OS', 'RAM', 'Binary'],
        lessons: [
          { id: 'g9a1', title: 'Binary Bracelets', durationMin: 60,
            objectives: ['Convert numbers', 'Compare storage'],
            outline: ['Relay', 'Cards', 'Beads'],
            resources: ['Cards'], homework: 'Binary sheet.' } ],
        homeworkBank: ['RAM table.'], quizQuestions: ['OS does?'] },
    ] }],
};
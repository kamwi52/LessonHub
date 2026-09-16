import type { GradePlan } from './ict-curriculum';
export const GRADE8: GradePlan = {
  id: 'grade-8', grade: 'Grade 8', level: 'Lower Secondary',
  description: 'Spreadsheets, data, presentations, Python start.',
  terms: [{
    id: 't1', label: 'Term 1', theme: 'Spreadsheets + Data', weeks: 8, topics: [
      { id: 'g8-t1-a', title: 'Excel Budgets + SUM', overview: 'Cells, SUM, currency.',
        weeks: 'Wk 1-3', keyTerms: ['Cell', 'Formula', 'Range'],
        lessons: [
          { id: 'g8a1', title: 'Tuckshop Budget', durationMin: 60,
            objectives: ['Enter data', 'Use SUM'],
            outline: ['Cell demo', 'Build budget', 'Format'],
            resources: ['Excel'], homework: 'Track costs.', assessment: 'Totals check.' } ],
        homeworkBank: ['Fix formulas.'], quizQuestions: ['Formula starts with?'] },
    ] }],
};
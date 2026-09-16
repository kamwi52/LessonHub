import type { GradePlan } from './ict-curriculum';
export const GRADE7: GradePlan = {
  id: 'grade-7', grade: 'Grade 7', level: 'Lower Secondary',
  description: 'Foundations: parts, typing, safety.',
  terms: [{
    id: 't1', label: 'Term 1', theme: 'Foundations', weeks: 8, topics: [
      { id: 'g7-t1-a', title: 'Parts of a Computer', overview: 'Hardware, software, lab rules.',
        weeks: 'Wk 1-3', keyTerms: ['Hardware', 'CPU', 'Input', 'Output'],
        lessons: [
          { id: 'g7a1', title: 'Input vs Output', durationMin: 60,
            objectives: ['Name devices', 'State lab rules'],
            outline: ['Device hunt', 'Demo', 'Sort task'],
            resources: ['Lab PCs'], homework: 'Draw setup.', assessment: 'Exit ticket.' },
          { id: 'g7a2', title: 'Software Types', durationMin: 60,
            objectives: ['Open apps', 'Sort system vs app'],
            outline: ['Power routine', 'Notepad', 'Card sort'],
            resources: ['Notepad'], homework: 'List 5 apps.' } ],
        homeworkBank: ['Label diagram.', 'Write 5 rules.'],
        quizQuestions: ['3 inputs?', 'CPU means?'] },
    ] }],
};
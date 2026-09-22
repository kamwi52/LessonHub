/**
 * LessonsHub Export - Main Script
 * Run: node scripts/export-all.js
 */

const fs = require('fs');
const path = require('path');
const { schemeHTML, lessonHTML } = require('./html-gen');

const DATA_DIR = path.resolve(__dirname, '../src/data');
const EXPORT_DIR = path.resolve(__dirname, '../exports');

// Clean exports folder
if (fs.existsSync(EXPORT_DIR)) {
  fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(EXPORT_DIR, { recursive: true });

console.log('📚 LessonsHub Export\n=========================\n');

// Subject configs  
const subjects = [
  { name: 'Information & Communication Technology', code: 'ICT', ref: 'CDC Ordinary Level ICT Syllabus, Forms 1-4', lessonRef: "2024 CDC O-Level ICT Syllabus Forms 1-4", weeksFile: 'term3-weeks', grades: [{id:'form-1',n:'Form 1'},{id:'form-2',n:'Form 2'},{id:'form-3',n:'Form 3'},{id:'form-4',n:'Form 4'}] },
  { name: 'Mathematics', code: 'MATH', ref: 'CDC Ordinary Level Mathematics Syllabus, Forms 1-4', lessonRef: "2024 CDC O-Level Mathematics Syllabus Forms 1-4", weeksFile: 'math-t3-weeks', grades: [{id:'form-1',n:'Form 1'},{id:'form-2',n:'Form 2'},{id:'form-3',n:'Form 3'},{id:'form-4',n:'Form 4'}] },
  { name: 'Computer Studies', code: 'CS', ref: 'CDC Computer Studies Syllabus, Grades 8-12', lessonRef: "CDC Computer Studies Syllabus Grades 8-12", weeksFile: 'cs-t3-weeks', grades: [{id:'grade-8',n:'Grade 8'},{id:'grade-9',n:'Grade 9'},{id:'grade-10',n:'Grade 10'},{id:'grade-11',n:'Grade 11'},{id:'grade-12',n:'Grade 12'}] }
];

let totalS = 0, totalL = 0;

for (const subj of subjects) {
  console.log(`📖 ${subj.name} (${subj.code})`);
  try {
    // Load weeks data
    const modPath = path.join(DATA_DIR, `${subj.weeksFile}.ts`);
    const mod = require(modPath);
    
    let weeksData = {};
    if (mod.TERM3_WEEKS) weeksData = mod.TERM3_WEEKS;
    else if (mod.MATH_TERM3_WEEKS) weeksData = mod.MATH_TERM3_WEEKS;
    else if (mod.CS_TERM3_WEEKS) weeksData = mod.CS_TERM3_WEEKS;
    else {
      // Manually map from exports
      const map = { 'FORM1_T3':'form-1','FORM2_T3':'form-2','FORM3_T3':'form-3','FORM4_T3':'form-4',
                    'MATH_FORM1_T3':'form-1','MATH_FORM2_T3':'form-2','MATH_FORM3_T3':'form-3','MATH_FORM4_T3':'form-4',
                    'CS_GRADE8_T3':'grade-8','CS_GRADE9_T3':'grade-9','CS_GRADE10_T3':'grade-10',
                    'CS_GRADE11_T3':'grade-11','CS_GRADE12_T3':'grade-12' };
      for (const k of Object.keys(mod)) {
        if (map[k] && Array.isArray(mod[k])) weeksData[map[k]] = mod[k];
      }
    }
    
    console.log(`   ${Object.keys(weeksData).length} grades`);
    
    for (const grade of subj.grades) {
      const folder = path.join(EXPORT_DIR, `${subj.code}-${grade.n.replace(/\s/g,'')}`);
      fs.mkdirSync(folder, { recursive: true });
      
      const weeks = weeksData[grade.id];
      if (!weeks || !Array.isArray(weeks)) { console.log(`   ⚠️ ${grade.n}: no weeks`); continue; }
      
      console.log(`   📚 ${grade.n} (${weeks.length} weeks)`);
      
      // Scheme
      const sRows = weeks.map(w => ({
        week:w.week, type:w.type||'lesson', topic:w.title,
        competence:w.objectives.join('; '), keyConcept:w.focus,
        activity:w.development.join(' '), assessment:w.assessment||'Continuous Assessment',
        materials:w.resources.join(', '), expectedStandard:w.objectives.join('; '),
        reference:subj.ref
      }));
      fs.writeFileSync(path.join(folder, 'SCHEME_OF_WORK.html'), schemeHTML(subj, grade.n, sRows));
      totalS++;
      console.log(`      ✅ SCHEME_OF_WORK.html`);
      
      // Lesson plans
      weeks.forEach(w => {
        fs.writeFileSync(path.join(folder, `LESSON_PLAN_WEEK_${w.week}.html`), lessonHTML(subj, grade.n, w));
        totalL++;
      });
      console.log(`      ✅ ${weeks.length} Lesson Plans`);
    }
    console.log('');
  } catch (e) { console.log(`   ❌ ${e.message}\n`); }
}

console.log('=========================');
console.log(`✅ Done! ${totalS} schemes + ${totalL} lessons = ${totalS+totalL} files`);
console.log(`📁 ${EXPORT_DIR}`);
console.log('\n📁 To print: Open HTML → Ctrl+P → Save as PDF\n');

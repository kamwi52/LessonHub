/**
 * LessonsHub - Main Export Script
 * Generates ALL schemes and lesson plans
 * Usage: node scripts/export.js
 */

const fs = require('fs');
const path = require('path');

// Import HTML generators
const { schemeHTML } = require('./schemes');
const { lessonHTML } = require('./lessons');

const DATA_DIR = path.resolve(__dirname, '../src/data');
const EXPORT_DIR = path.resolve(__dirname, '../exports');

// Clean and recreate exports directory
if (fs.existsSync(EXPORT_DIR)) {
  fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(EXPORT_DIR, { recursive: true });

console.log('📚 LessonsHub - Generating All Schemes & Lesson Plans\n');

// Very simple inline parsing for TS data files
function parseWeeksFile(content) {
  console.log('Parsing weeks file, length: ' + content.length);
  
  // First, replace the wk() function calls with JSON object strings
  // wk(week, type, title, focus, objectives[], starter, development[], plenary, resources[], homework?, assessment?)
  let transformed = content.replace(/wk\(([\s\S]*?)\)/g, (match, args) => {
    // Split arguments by comma, but respect string literals and arrays
    const parts = [];
    let current = '';
    let inString = false;
    let stringChar = '';
    let inArray = false;
    let depth = 0;
    
    for (let i = 0; i < args.length; i++) {
      const ch = args[i];
      
      if (inArray) {
        current += ch;
        if (ch === '[') depth++;
        if (ch === ']') depth--;
        if (depth === 0) inArray = false;
      } else if (inString) {
        current += ch;
        if (ch === stringChar && (i === 0 || args[i-1] !== '\\')) inString = false;
      } else {
        if (ch === '"' || ch === "'") {
          inString = true;
          stringChar = ch;
          current += ch;
        } else if (ch === '[') {
          inArray = true;
          depth = 1;
          current += ch;
        } else if (ch === ',' && depth === 0) {
          parts.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
    }
    if (current.trim()) parts.push(current.trim());
    
    if (parts.length >= 9) {
      // wk(week, type, title, focus, objectives[], starter, development[], plenary, resources[], homework?, assessment?)
      const week = parts[0].trim();
      const type = parts[1].trim().replace(/['"]/g, '');
      const title = parts[2].trim().replace(/['"]/g, '');
      const focus = parts[3].trim().replace(/['"]/g, '');
      const objectives = parts[4].trim();
      const starter = parts[5].trim().replace(/['"]/g, '');
      const development = parts[6].trim();
      const plenary = parts[7].trim().replace(/['"]/g, '');
      const resources = parts[8].trim();
      const homework = parts[9] ? parts[9].trim().replace(/['"]/g, '') : 'null';
      const assessment = parts[10] ? parts[10].trim().replace(/['"]/g, '') : 'null';
      
      // Escape strings for JSON
      const esc = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
      
      return '{"week":' + week + ',"type":' + esc(type) + ',"title":' + esc(title) + ',"focus":' + esc(focus) + ',"objectives":' + objectives + ',"starter":' + esc(starter) + ',"development":' + development + ',"plenary":' + esc(plenary) + ',"resources":' + resources + ',"homework":' + homework + ',"assessment":' + assessment + '}';
    }
    return match;
  });
  
  console.log('Transformed wk() calls');
  
  // Now find and parse the array exports
  const exports = {};
  const arrayRegex = /export\s+const\s+(\w+)\s*(?::\s*\w+(?:\[\])?)?\s*=\s*(\[[\s\S]*?\])\s*;/g;
  let match;
  let count = 0;
  while ((match = arrayRegex.exec(transformed)) !== null) {
    count++;
    try {
      let arrStr = match[2];
      arrStr = arrStr.replace(/\.\.\.\[[\w,]+\]/g, '[]');
      arrStr = arrStr.replace(/undefined/g, 'null');
      exports[match[1]] = JSON.parse(arrStr);
      console.log('  Parsed array: ' + match[1] + ' (' + exports[match[1]].length + ' items)');
    } catch (e) {
      console.log('  Failed to parse ' + match[1] + ': ' + e.message);
    }
  }
  console.log('Found ' + count + ' array exports');
  
  // Build grade->weeks mapping
  const weeksObj = {};
  const gradeMap = {
    'FORM1_T3': 'form-1', 'FORM2_T3': 'form-2', 'FORM3_T3': 'form-3', 'FORM4_T3': 'form-4',
    'MATH_FORM1_T3': 'form-1', 'MATH_FORM2_T3': 'form-2', 'MATH_FORM3_T3': 'form-3', 'MATH_FORM4_T3': 'form-4',
    'CS_GRADE8_T3': 'grade-8', 'CS_GRADE9_T3': 'grade-9', 'CS_GRADE10_T3': 'grade-10',
    'CS_GRADE11_T3': 'grade-11', 'CS_GRADE12_T3': 'grade-12'
  };
  
  for (const [exportName, gradeId] of Object.entries(gradeMap)) {
    if (exports[exportName]) {
      weeksObj[gradeId] = exports[exportName];
    }
  }
  
  console.log('Built weeksObj with ' + Object.keys(weeksObj).length + ' grades');
  
  return weeksObj;
}

// Subject configurations
const subjects = [
  {
    id: 'ict', name: 'Information & Communication Technology', code: 'ICT',
    syllabusRef: 'CDC Ordinary Level ICT Syllabus, Forms 1-4',
    lessonRef: "2024 CDC O-Level ICT Syllabus Forms 1-4",
    weeksFile: 'term3-weeks',
    grades: [
      { id: 'form-1', name: 'Form 1' },
      { id: 'form-2', name: 'Form 2' },
      { id: 'form-3', name: 'Form 3' },
      { id: 'form-4', name: 'Form 4' }
    ]
  },
  {
    id: 'mathematics', name: 'Mathematics', code: 'MATH',
    syllabusRef: 'CDC Ordinary Level Mathematics Syllabus, Forms 1-4',
    lessonRef: "2024 CDC O-Level Mathematics Syllabus Forms 1-4",
    weeksFile: 'math-t3-weeks',
    grades: [
      { id: 'form-1', name: 'Form 1' },
      { id: 'form-2', name: 'Form 2' },
      { id: 'form-3', name: 'Form 3' },
      { id: 'form-4', name: 'Form 4' }
    ]
  },
  {
    id: 'computer-studies', name: 'Computer Studies', code: 'CS',
    syllabusRef: 'CDC Computer Studies Syllabus, Grades 8-12',
    lessonRef: "CDC Computer Studies Syllabus Grades 8-12",
    weeksFile: 'cs-t3-weeks',
    grades: [
      { id: 'grade-8', name: 'Grade 8' },
      { id: 'grade-9', name: 'Grade 9' },
      { id: 'grade-10', name: 'Grade 10' },
      { id: 'grade-11', name: 'Grade 11' },
      { id: 'grade-12', name: 'Grade 12' }
    ]
  }
];

let totalSchemes = 0, totalLessons = 0;

for (const subject of subjects) {
  console.log(`📖 ${subject.name} (${subject.code})`);
  
  try {
    // Read and parse the weeks file
    const weeksFilePath = path.join(DATA_DIR, `${subject.weeksFile}.ts`);
    const weeksContent = fs.readFileSync(weeksFilePath, 'utf8');
    const weeksData = parseWeeksFile(weeksContent);
    
    console.log(`   Loaded ${Object.keys(weeksData).length} grade entries`);
    
    for (const grade of subject.grades) {
      const gradeFolderName = `${subject.code}-${grade.name.replace(/\s/g, '')}`;
      const gradeFolder = path.join(EXPORT_DIR, gradeFolderName);
      fs.mkdirSync(gradeFolder, { recursive: true });
      
      const weeks = weeksData[grade.id];
      if (!weeks || !Array.isArray(weeks)) {
        console.log(`   ⚠️ No weeks for ${grade.name}`);
        continue;
      }
      
      console.log(`   📚 ${grade.name} (${weeks.length} weeks)`);
      
      // Generate Scheme of Work
      const schemeRows = weeks.map(w => ({
        week: w.week,
        type: w.type || 'lesson',
        topic: w.title,
        competence: w.objectives.join('; '),
        keyConcept: w.focus,
        activity: w.development.join(' '),
        assessment: w.assessment || 'Continuous Assessment',
        materials: w.resources.join(', '),
        expectedStandard: w.objectives.join('; '),
        reference: subject.syllabusRef
      }));
      
      const schemePath = path.join(gradeFolder, 'SCHEME_OF_WORK.html');
      fs.writeFileSync(schemePath, schemeHTML(subject, grade.name, schemeRows));
      totalSchemes++;
      console.log(`      ✅ SCHEME_OF_WORK.html`);
      
      // Generate Lesson Plans
      weeks.forEach(week => {
        const lessonPath = path.join(gradeFolder, `LESSON_PLAN_WEEK_${week.week}.html`);
        fs.writeFileSync(lessonPath, lessonHTML(subject, grade.name, week));
        totalLessons++;
      });
      console.log(`      ✅ ${weeks.length} Lesson Plans`);
    }
    console.log('');
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}\n`);
  }
}

console.log('=============================');
console.log(`✅ EXPORT COMPLETE!`);
console.log(`📁 Output: ${EXPORT_DIR}`);
console.log(`📊 Total: ${totalSchemes} schemes + ${totalLessons} lesson plans = ${totalSchemes + totalLessons} HTML files`);
console.log('\n📁 To print to PDF:');
console.log('   1. Open any HTML file in a browser');
console.log('   2. Press Ctrl+P (Windows) or Cmd+P (Mac)');
console.log('   3. Select "Save as PDF"');
console.log('   4. Click Save\n');

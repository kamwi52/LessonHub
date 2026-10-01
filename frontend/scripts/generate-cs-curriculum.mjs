import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const text = await readFile('c:/Users/Administrator/Documents/work/PLANS2026/cs_decoded.txt', 'utf8');
const lines = text.split(/\r?\n/);

const CLEAN_PAIRS = [
  [/=/g, ' '],
  [/\u00a8/g, '(c)'],
  [/\u00dc/g, 'fi'],
  [/\u00ec/g, 'ff'],
  [/\u00d3/g, "'"],
  [/\u00d2/g, '-'],
  [/\u00c8\)/g, ')'],
  [/\u00c8/g, ')'],
  [/\u00dd/g, 'y'],
  [/ArtiÜcial/gi, 'Artificial'],
  [/artiÜcial/gi, 'artificial'],
  [/ConÜgure/gi, 'Configure'],
  [/conÜgure/gi, 'configure'],
  [/ConÜguration/gi, 'Configuration'],
  [/conÜguration/gi, 'configuration'],
  [/ConÜguring/gi, 'Configuring'],
  [/conÜguring/gi, 'configuring'],
  [/dierent/gi, 'different'],
  [/Dierent/gi, 'Different'],
  [/eect/gi, 'effect'],
  [/Eect/gi, 'Effect'],
  [/eective/gi, 'effective'],
  [/Eective/gi, 'Effective'],
  [/eectively/gi, 'effectively'],
  [/Eectively/gi, 'Effectively'],
  [/ecient/gi, 'efficient'],
  [/Ecient/gi, 'Efficient'],
  [/eciently/gi, 'efficiently'],
  [/Eciently/gi, 'Efficiently'],
  [/identiÜed/gi, 'identified'],
  [/speciÜc/gi, 'specific'],
  [/signiÜcant/gi, 'significant'],
  [/proÜciency/gi, 'proficiency'],
  [/beneÜt/gi, 'benefit'],
  [/beneÜts/gi, 'benefits'],
  [/modiÜcation/gi, 'modification'],
  [/deÜnition/gi, 'definition'],
  [/deÜning/gi, 'defining'],
  [/veriÜcation/gi, 'verification'],
  [/certiÜcation/gi, 'certification'],
  [/di\s*൵\s*erent/gi, 'different'],
  [/e\s*൵\s*ect/gi, 'effect'],
  [/e\s*൵\s*ective/gi, 'effective'],
  [/e\s*൵\s*icient/gi, 'efficient'],
  [/e\s*൵\s*iciently/gi, 'efficiently'],
  [/di\s*ff\s*erent/gi, 'different'],
  [/e\s*ff\s*ect/gi, 'effect'],
  [/e\s*ff\s*ective/gi, 'effective'],
  [/e\s*ff\s*icient/gi, 'efficient'],
  [/e\s*ff\s*iciently/gi, 'efficiently'],
  [/tra“c/gi, 'traffic'],
  [/tra\s*“\s*c/gi, 'traffic'],
  [/tra\s*ff\s*ic/gi, 'traffic'],
  [/e“cient/gi, 'efficient'],
  [/o’line/gi, 'offline'],
  [/o\s*’\s*line/gi, 'offline'],
  [/di’erent/gi, 'different'],
  [/di\s*’\s*erent/gi, 'different'],
  [/e’ective/gi, 'effective'],
  [/e’ectively/gi, 'effectively'],
  [/e’ect/gi, 'effect'],
  [/e’ects/gi, 'effects'],
  [/e’icient/gi, 'efficient'],
  [/e’iciently/gi, 'efficiently'],
];

function clean(str) {
  let s = str || '';
  for (const [re, rep] of CLEAN_PAIRS) {
    s = s.replace(re, rep);
  }
  return s.replace(/\s+/g, ' ').trim();
}

// Canonical unit and subtopic titles based on syllabus table of contents & body
const CANONICAL_TOPICS = {
  // Form 1
  '1.1': 'Fundamentals of Computing',
  '1.1.1': 'Computer Basics',
  '1.1.2': 'Operating System and File Management',
  '1.1.3': 'Application Software',
  '1.1.4': 'Basic Troubleshooting',
  '1.2': 'Productivity Tools: Word Processing',
  '1.2.1': 'Word Processing',
  '1.3': 'Data Representation',
  '1.3.1': 'Number Systems',
  '1.4': 'Computer Networks',
  '1.4.1': 'Network Design and Implementation',
  '1.5': 'Cybersecurity',
  '1.5.1': 'Online Safety and Digital Footprint',
  '1.6': 'Data Processing',
  '1.6.1': 'Data Processing',
  '1.7': 'Web Design',
  '1.7.1': 'Web Design and Development',
  '1.8': 'Digital Citizenship',
  '1.8.1': 'Digital Ethics',
  '1.9': 'Databases',
  '1.9.1': 'Database Management',
  '1.10': 'Artificial Intelligence',
  '1.10.1': 'Artificial Intelligence (AI)',
  '1.11': 'Internet of Things (IoT)',
  '1.11.1': 'Basic Components of IoT',
  '1.12': 'Logic Gates',
  '1.12.1': 'Digital Control Systems',

  // Form 2
  '2.1': 'Productivity Tools: Spreadsheets',
  '2.1.1': 'Spreadsheets',
  '2.2': 'Data Representation',
  '2.2.1': 'Number Systems',
  '2.3': 'Introduction to Programming',
  '2.3.1': 'Block-based Programming',
  '2.4': 'Networking',
  '2.4.1': 'Network Configuration',
  '2.5': 'Cybersecurity',
  '2.5.1': 'Introduction to Cybersecurity',
  '2.6': 'Algorithms',
  '2.6.1': 'Fundamentals of Algorithms',
  '2.7': 'Web Development',
  '2.7.1': 'Cascading Style Sheets (CSS)',
  '2.8': 'Databases',
  '2.8.1': 'Database Design and Creation',
  '2.9': 'Artificial Intelligence (AI)',
  '2.9.1': 'AI Models',
  '2.10': 'Internet of Things (IoT)',
  '2.10.1': 'IoT Model',
  '2.11': 'Robotics',
  '2.11.1': 'Fundamentals of Robotics',

  // Form 3
  '3.1': 'Productivity Tools',
  '3.1.1': 'Desktop Publishing',
  '3.1.2': 'Presentation Software',
  '3.2': 'Logic Gates',
  '3.2.1': 'Design and Implementation of Logic Circuits',
  '3.3': 'Computer Networks & Internet',
  '3.3.1': 'The Internet & Content Sharing',
  '3.4': 'Cybersecurity',
  '3.4.1': 'Data Encryption and Protection',
  '3.5': 'Programming: Python',
  '3.5.1': 'Python Programming Concepts',
  '3.5.2': 'Coding in Python',
  '3.6': 'Web Development',
  '3.6.1': 'Web Scripting (JavaScript)',
  '3.7': 'Databases',
  '3.7.1': 'Implement and Maintain Databases',
  '3.8': 'Artificial Intelligence',
  '3.8.1': 'Deploying AI Models',
  '3.9': 'Internet of Things (IoT)',
  '3.9.1': 'IoT in the Real World',
  '3.10': 'Mobile Applications',
  '3.10.1': 'Mobile Application Development',
  '3.11': 'Cloud Computing',
  '3.11.1': 'Cloud Deployment and Operations',
  '3.12': 'Robotics',
  '3.12.1': 'Mechanical and Electronic Systems',

  // Form 4
  '4.1': 'Computer Systems',
  '4.1.1': 'Fundamentals of Computer Systems',
  '4.2': 'Productivity Tools: Databases',
  '4.2.1': 'Database Management Systems (DBMS)',
  '4.3': 'Computer Networking',
  '4.3.1': 'Advanced Network Design and Configuration',
  '4.4': 'Programming: C++',
  '4.4.1': 'Programming in C++',
  '4.5': 'Mobile Application Development',
  '4.5.1': 'Mobile Application Deployment and Security',
  '4.6': 'Emerging Technologies',
  '4.6.1': 'Fundamentals of Emerging Technologies',
  '4.7': 'Cloud Computing',
  '4.7.1': 'Cloud Platforms and Optimization',
};

const FORM_BOUNDS = [
  { form: 1, start: 569, end: 1197 },
  { form: 2, start: 1197, end: 1640 },
  { form: 3, start: 1640, end: 2236 },
  { form: 4, start: 2236, end: 2568 },
];

function extractForm(formNum, startLine, endLine) {
  const slice = lines.slice(startLine, endLine);
  let currentTopicNum = null;
  let currentSubtopicNum = null;
  let currentComp = null;
  const competences = [];

  for (let i = 0; i < slice.length; i++) {
    const raw = slice[i];
    const t = clean(raw);
    if (!t) continue;
    if (t.startsWith('=== PAGE')) continue;
    if (/^TOPIC\s+SUB/i.test(t)) continue;
    if (/^Computer Science\s+Syllab/i.test(t)) continue;
    if (/^Secondary Education Ordinary/i.test(t)) continue;
    if (/^\d{1,2}$/.test(t)) continue;
    if (/^SUMMARY OF KEY COMPETENCES/i.test(t)) break;

    const mComp = t.match(/^(\d\.\d+\.\d+\.\d+)\.?\s*(.*)/);
    const mSub = t.match(/^(\d\.\d+\.\d+)\.?\s*(.*)/);
    const mTopic = t.match(/^(\d\.\d+)\.?\s*(.*)/);

    if (mComp) {
      currentComp = {
        code: mComp[1],
        title: clean(mComp[2]),
        topicNum: currentTopicNum,
        subtopicNum: currentSubtopicNum || mComp[1].split('.').slice(0, 3).join('.'),
        activities: [],
        standard: '',
        rawLines: [],
      };
      competences.push(currentComp);
      continue;
    }

    if (mSub) {
      currentSubtopicNum = mSub[1];
      if (!currentTopicNum) currentTopicNum = mSub[1].split('.').slice(0, 2).join('.');
      continue;
    }

    if (mTopic) {
      currentTopicNum = mTopic[1];
      currentSubtopicNum = null;
      continue;
    }

    if (currentComp) currentComp.rawLines.push(raw);
  }

  for (const comp of competences) {
    let currentAct = '';
    const activities = [];
    const trailingProse = [];

    for (const raw of comp.rawLines) {
      const c = clean(raw);
      if (!c) continue;
      if (raw.includes('\u00a4') || raw.startsWith('•') || raw.startsWith('-') || raw.startsWith('r ') || raw.startsWith('±')) {
        if (currentAct) activities.push(currentAct);
        currentAct = clean(raw.replace(/^[\u00a4•\-r±\s]+/, ''));
      } else if (currentAct) {
        if (!/^[A-Z\s]{4,}$/.test(c) && !c.includes('demonstrated correctly') && !c.includes('successfully created') && !c.includes('appropriately') && !c.includes('resolved')) {
          currentAct += ' ' + c;
        } else {
          activities.push(currentAct);
          currentAct = '';
          trailingProse.push(c);
        }
      } else {
        trailingProse.push(c);
      }
    }
    if (currentAct) activities.push(currentAct);

    comp.activities = activities
      .map((a) => clean(a))
      .filter((a) => a.length > 5 && !/^PAGE \d+/i.test(a) && !/^(TOPIC|SUB-TOPIC|SPECIFIC|LEARNING|EXPECTED)/i.test(a));

    comp.standard = trailingProse.join(' ').trim();
  }

  return competences;
}

for (const b of FORM_BOUNDS) {
  const comps = extractForm(b.form, b.start, b.end);
  console.log(`\n=================== FORM ${b.form} (${comps.length} competences) ===================`);
  for (const c of comps) {
    console.log(`[${c.code}] ${c.title}`);
    console.log(`   Unit: ${c.topicNum} (${CANONICAL_TOPICS[c.topicNum] || '?'}) | Sub: ${c.subtopicNum} (${CANONICAL_TOPICS[c.subtopicNum] || '?'})`);
    console.log(`   Activities (${c.activities.length}):`);
    for (const a of c.activities) {
      console.log(`     - ${a}`);
    }
    console.log(`   Standard: ${c.standard}`);
  }
}




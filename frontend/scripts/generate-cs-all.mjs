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

const CANONICAL_TOPICS = {
  '1.1': 'Fundamentals of Computing', '1.1.1': 'Computer Basics', '1.1.2': 'Operating System and File Management',
  '1.1.3': 'Application Software', '1.1.4': 'Basic Troubleshooting', '1.2': 'Productivity Tools: Word Processing',
  '1.2.1': 'Word Processing', '1.3': 'Data Representation', '1.3.1': 'Number Systems',
  '1.4': 'Computer Networks', '1.4.1': 'Network Design and Implementation', '1.5': 'Cybersecurity',
  '1.5.1': 'Online Safety and Digital Footprint', '1.6': 'Data Processing', '1.6.1': 'Data Processing',
  '1.7': 'Web Design', '1.7.1': 'Web Design and Development', '1.8': 'Digital Citizenship',
  '1.8.1': 'Digital Ethics', '1.9': 'Databases', '1.9.1': 'Database Management',
  '1.10': 'Artificial Intelligence', '1.10.1': 'Artificial Intelligence (AI)', '1.11': 'Internet of Things (IoT)',
  '1.11.1': 'Basic Components of IoT', '1.12': 'Logic Gates', '1.12.1': 'Digital Control Systems',
  '2.1': 'Productivity Tools: Spreadsheets', '2.1.1': 'Spreadsheets', '2.2': 'Data Representation',
  '2.2.1': 'Number Systems', '2.3': 'Introduction to Programming', '2.3.1': 'Block-based Programming',
  '2.4': 'Networking', '2.4.1': 'Network Configuration', '2.5': 'Cybersecurity',
  '2.5.1': 'Introduction to Cybersecurity', '2.6': 'Algorithms', '2.6.1': 'Fundamentals of Algorithms',
  '2.7': 'Web Development', '2.7.1': 'Cascading Style Sheets (CSS)', '2.8': 'Databases',
  '2.8.1': 'Database Design and Creation', '2.9': 'Artificial Intelligence (AI)', '2.9.1': 'AI Models',
  '2.10': 'Internet of Things (IoT)', '2.10.1': 'IoT Model', '2.11': 'Robotics', '2.11.1': 'Fundamentals of Robotics',
  '3.1': 'Productivity Tools', '3.1.1': 'Desktop Publishing', '3.1.2': 'Presentation Software',
  '3.2': 'Logic Gates', '3.2.1': 'Design and Implementation of Logic Circuits', '3.3': 'Computer Networks & Internet',
  '3.3.1': 'The Internet & Content Sharing', '3.4': 'Cybersecurity', '3.4.1': 'Data Encryption and Protection',
  '3.5': 'Programming: Python', '3.5.1': 'Python Programming Concepts', '3.5.2': 'Coding in Python',
  '3.6': 'Web Development', '3.6.1': 'Web Scripting (JavaScript)', '3.7': 'Databases',
  '3.7.1': 'Implement and Maintain Databases', '3.8': 'Artificial Intelligence', '3.8.1': 'Deploying AI Models',
  '3.9': 'Internet of Things (IoT)', '3.9.1': 'IoT in the Real World', '3.10': 'Mobile Applications',
  '3.10.1': 'Mobile Application Development', '3.11': 'Cloud Computing', '3.11.1': 'Cloud Deployment and Operations',
  '3.12': 'Robotics', '3.12.1': 'Mechanical and Electronic Systems',
  '4.1': 'Computer Systems', '4.1.1': 'Fundamentals of Computer Systems', '4.2': 'Productivity Tools: Databases',
  '4.2.1': 'Database Management Systems (DBMS)', '4.3': 'Computer Networking',
  '4.3.1': 'Advanced Network Design and Configuration', '4.4': 'Programming: C++',
  '4.4.1': 'Programming in C++', '4.5': 'Mobile Application Development',
  '4.5.1': 'Mobile Application Deployment and Security', '4.6': 'Emerging Technologies',
  '4.6.1': 'Fundamentals of Emerging Technologies', '4.7': 'Cloud Computing',
  '4.7.1': 'Cloud Platforms and Optimization',
};
const OFFICIAL_TITLES = {
  '1.1.1.1': 'Demonstrate understanding of essential computer software and hardware',
  '1.1.2.1': 'Demonstrate proper management of operating system and files',
  '1.1.3.1': 'Operate commonly used application software',
  '1.1.4.1': 'Diagnose and resolve common computer problems',
  '1.2.1.1': 'Create documents using word processing software',
  '1.3.1.1': 'Apply number systems in computing',
  '1.4.1.1': 'Configure and install basic computer networks',
  '1.5.1.1': 'Apply online safety and security practices',
  '1.6.1.1': 'Collect and clean data for processing',
  '1.7.1.1': 'Design and structure web pages using HTML',
  '1.8.1.1': 'Demonstrate ethical practices and digital citizenship online',
  '1.9.1.1': 'Create and manage databases using relational DBMS',
  '1.10.1.1': 'Design and understand Artificial Intelligence models',
  '1.11.1.1': 'Demonstrate understanding of Internet of Things (IoT) systems',
  '1.12.1.1': 'Create digital control systems using logic gates',
  '2.1.1.1': 'Use spreadsheets for data entry, analysis, and visualization',
  '2.2.1.1': 'Apply number system operations and conversions',
  '2.3.1.1': 'Construct programs using block-based programming tools',
  '2.4.1.1': 'Develop and configure local area networks',
  '2.5.1.1': 'Utilize cybersecurity tools and practices',
  '2.6.1.1': 'Design algorithms to solve computational problems',
  '2.7.1.1': 'Apply CSS concepts to style web pages',
  '2.8.1.1': 'Design and create relational databases using SQL',
  '2.9.1.1': 'Develop Artificial Intelligence models for practical applications',
  '2.10.1.1': 'Develop an IoT model for real-world applications',
  '2.11.1.1': 'Design simple robots and control systems',
  '3.1.1.1': 'Design and create publications using Desktop Publishing tools',
  '3.1.2.1': 'Create and format dynamic multimedia presentations',
  '3.2.1.1': 'Design digital circuits using combinational logic gates',
  '3.3.1.1': 'Create and share data content online securely',
  '3.4.1.1': 'Mitigate and respond to cyber threats using data encryption',
  '3.5.1.1': 'Use Python to code and solve computational problems',
  '3.5.2.1': 'Develop practical Python applications',
  '3.6.1.1': 'Develop dynamic web pages using JavaScript',
  '3.7.1.1': 'Manage databases and integrate with applications',
  '3.8.1.1': 'Deploy Artificial Intelligence models in robotics and healthcare',
  '3.9.1.1': 'Create Internet of Things solutions for real-world problems',
  '3.10.1.1': 'Create mobile applications for smartphones and tablets',
  '3.11.1.1': 'Develop and manage cloud computing models and operations',
  '3.12.1.1': 'Implement control systems and robotics automation',
  '4.1.1.1': 'Demonstrate understanding of modern computer systems and architectures',
  '4.2.1.1': 'Create and manage databases with backend system integration',
  '4.3.1.1': 'Design and configure advanced computer networks (VLANs, VPNs, QoS)',
  '4.4.1.1': 'Develop C++ programs using object-oriented principles',
  '4.5.1.1': 'Develop mobile applications with advanced integrations and security',
  '4.6.1.1': 'Demonstrate understanding of emerging technologies (AR/VR, 3D Printing)',
  '4.7.1.1': 'Deploy cloud platforms, microservices, and APIs',
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
        title: OFFICIAL_TITLES[mComp[1]] || clean(mComp[2]),
        topicNum: currentTopicNum || mComp[1].split('.').slice(0, 2).join('.'),
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
        if (!/^[A-Z\s]{4,}$/.test(c) && !c.includes('demonstrated correctly') && !c.includes('successfully created') && !c.includes('appropriately') && !c.includes('resolved') && !c.includes('developed accordingly')) {
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
      .filter((a) => a.length > 5 && !/^PAGE \d+/i.test(a) && !/^(TOPIC|SUB-TOPIC|SPECIFIC|LEARNING|EXPECTED)/i.test(a) && !/^\d{1,2}$/.test(a));

    comp.standard = trailingProse.filter(s => !/^(TOPIC|SUB-TOPIC|SPECIFIC|LEARNING|EXPECTED|PAGE)/i.test(s)).join(' ').trim();
  }

  return competences;
}

const TERM_SPLITS = {
  1: [
    { id: 'form1-t1', label: 'Term 1', theme: 'Fundamentals of Computing, Productivity Tools (Word Processing)', codes: ['1.1.1.1', '1.1.2.1', '1.1.3.1', '1.1.4.1', '1.2.1.1'] },
    { id: 'form1-t2', label: 'Term 2', theme: 'Data Representation, Networks, Cybersecurity, Data Processing, Web Design', codes: ['1.3.1.1', '1.4.1.1', '1.5.1.1', '1.6.1.1', '1.7.1.1'] },
    { id: 'form1-t3', label: 'Term 3', theme: 'Digital Citizenship, Databases, Artificial Intelligence, IoT, Logic Gates', codes: ['1.8.1.1', '1.9.1.1', '1.10.1.1', '1.11.1.1', '1.12.1.1'] },
  ],
  2: [
    { id: 'form2-t1', label: 'Term 1', theme: 'Spreadsheets, Number Systems, Block-based Programming, Networking', codes: ['2.1.1.1', '2.2.1.1', '2.3.1.1', '2.4.1.1'] },
    { id: 'form2-t2', label: 'Term 2', theme: 'Cybersecurity, Algorithms, Web Development (CSS), Databases (SQL)', codes: ['2.5.1.1', '2.6.1.1', '2.7.1.1', '2.8.1.1'] },
    { id: 'form2-t3', label: 'Term 3', theme: 'Artificial Intelligence, Internet of Things, Robotics', codes: ['2.9.1.1', '2.10.1.1', '2.11.1.1'] },
  ],
  3: [
    { id: 'form3-t1', label: 'Term 1', theme: 'Desktop Publishing, Presentation Software, Logic Gates, Computer Networks', codes: ['3.1.1.1', '3.1.2.1', '3.2.1.1', '3.3.1.1'] },
    { id: 'form3-t2', label: 'Term 2', theme: 'Data Encryption, Python Programming, JavaScript Web Development', codes: ['3.4.1.1', '3.5.1.1', '3.5.2.1', '3.6.1.1'] },
    { id: 'form3-t3', label: 'Term 3', theme: 'Database Management, AI Deployment, IoT Solutions, Mobile Apps, Cloud Computing, Robotics', codes: ['3.7.1.1', '3.8.1.1', '3.9.1.1', '3.10.1.1', '3.11.1.1', '3.12.1.1'] },
  ],
  4: [
    { id: 'form4-t1', label: 'Term 1', theme: 'Computer Systems, Database Integration, Advanced Networking (VLANs, VPNs, QoS)', codes: ['4.1.1.1', '4.2.1.1', '4.3.1.1'] },
    { id: 'form4-t2', label: 'Term 2', theme: 'C++ Object-Oriented Programming, Mobile Application Development', codes: ['4.4.1.1', '4.5.1.1'] },
    { id: 'form4-t3', label: 'Term 3', theme: 'Emerging Technologies (AR/VR, 3D Printing), Cloud Platforms & APIs', codes: ['4.6.1.1', '4.7.1.1'] },
  ],
};

const FORM_DESCRIPTIONS = {
  1: 'Computer basics, OS & file management, productivity tools, data representation, networks, cybersecurity, data processing, web design, digital ethics, databases, AI, IoT and logic gates.',
  2: 'Spreadsheets, advanced number systems, block-based programming, local networking, cybersecurity tools, algorithms, CSS web styling, SQL databases, AI models, IoT models and robotics.',
  3: 'Desktop publishing, multimedia presentations, combinational logic, content sharing, data encryption, Python programming, JavaScript scripting, database management, AI deployment, IoT solutions, mobile apps, cloud computing and robotics.',
  4: 'Computer system architectures, enterprise DBMS integration, advanced networking (VLANs, VPNs, QoS), C++ OOP programming, mobile application development, emerging technologies and cloud platform deployment.',
};
function makeLesson(comp) {
  const objectives = comp.activities.length ? comp.activities.slice(0, 5) : [comp.title];
  const outline = comp.activities.length ? comp.activities : [comp.title];
  return {
    id: comp.code.replace(/\./g, '-'),
    title: comp.title,
    durationMin: 80,
    objectives,
    outline,
    resources: [
      'Computer Laboratory',
      'Desktop PCs / Laptops',
      'Software Tools & IDEs',
      'Whiteboard & Markers',
      'Pupil Reference Notes',
    ],
    homework: `Complete the practical task and summary questions on ${comp.title}.`,
    assessment: comp.standard || 'Competence demonstrated correctly in laboratory tasks.',
  };
}

function makeTopic(comp) {
  const topNum = comp.topicNum;
  const subNum = comp.subtopicNum;
  const topTitle = CANONICAL_TOPICS[topNum] || `Unit ${topNum}`;
  const subTitle = CANONICAL_TOPICS[subNum] || comp.title;
  const topicId = subNum.replace(/\./g, '-');

  return {
    id: topicId,
    title: subTitle,
    overview: `${topTitle} - ${subTitle}`,
    weeks: `Topic ${subNum}`,
    keyTerms: [topTitle, subTitle],
    lessons: [makeLesson(comp)],
    homeworkBank: [`Practice practical application of ${subTitle}.`],
    quizQuestions: [`Explain the core concepts of ${subTitle} and give one real-world example.`],
  };
}
function buildTerm3Weeks(formNum, term3Comps) {
  const aids = ['Computer Laboratory', 'Laptops / Desktop PCs', 'Software IDEs / Tools', 'Whiteboard & Markers'];
  const picks = Array.from({ length: 10 }, (_, index) => term3Comps[index % term3Comps.length]);

  const lessonWeek = (comp, week) => {
    const subTitle = CANONICAL_TOPICS[comp.subtopicNum] || comp.title;
    const topTitle = CANONICAL_TOPICS[comp.topicNum] || 'Computer Science';
    return {
      week,
      type: 'lesson',
      title: comp.title,
      focus: comp.code,
      objectives: comp.activities.length ? comp.activities.slice(0, 3) : [comp.title],
      starter: `Recall key concepts of ${subTitle} and review previous lesson outcomes.`,
      development: comp.activities.length ? comp.activities.slice(0, 6) : [
        `Explain theoretical foundations of ${subTitle}.`,
        `Demonstrate setup and practical execution in the computer laboratory.`,
        `Guide learners through hands-on exercises and troubleshooting.`,
        `Facilitate peer collaboration and problem solving.`,
      ],
      plenary: `Learners present their laboratory outputs and summarize the core principles of ${subTitle}.`,
      resources: [...aids, subTitle],
      homework: `Complete practical exercises on ${comp.title} and submit the lab report.`,
      assessment: comp.standard || 'Competence demonstrated correctly in laboratory tasks.',
    };
  };

  const examWeek = (week, type, title, note, focus) => ({
    week,
    type,
    title,
    focus,
    objectives: [`Assess learner competences and practical mastery in Form ${formNum} Computer Science`, 'Identify learning gaps and provide structured feedback'],
    starter: 'Explain examination rules, question structure, and practical assessment expectations.',
    development: [note, 'Learners complete written and practical tasks under standard examination conditions.'],
    plenary: 'Collect scripts, verify digital file submissions, and conclude the examination session.',
    resources: [...aids, 'Examination question papers', 'Marking guide'],
    homework: 'Review examination topics and compile revision questions on identified weak areas.',
    assessment: 'Marked scripts and recorded practical task scores.',
  });

  return [
    ...picks.slice(0, 6).map((comp, idx) => lessonWeek(comp, idx + 1)),
    examWeek(7, 'exam', 'Mid-Term Examination', 'Assess competences taught in Weeks 1 to 6.', 'Weeks 1-6'),
    ...picks.slice(6, 10).map((comp, idx) => lessonWeek(comp, idx + 8)),
    examWeek(12, 'revision', 'Revision & Consolidation', 'Consolidate key concepts and address common errors from the mid-term assessment.', 'Term 3 consolidation'),
    examWeek(13, 'exam', 'End of Year Examination', 'Comprehensive assessment covering the full Term 3 syllabus.', 'Terms 1-3'),
  ];
}

const grades = [];
const weeksRecord = {};

for (const b of FORM_BOUNDS) {
  const formNum = b.form;
  const comps = extractForm(formNum, b.start, b.end);
  const splits = TERM_SPLITS[formNum];

  const compMap = new Map(comps.map((c) => [c.code, c]));
  const terms = splits.map((sp) => {
    const termComps = sp.codes.map((code) => compMap.get(code)).filter(Boolean);
    return {
      id: sp.id,
      label: sp.label,
      theme: sp.theme,
      weeks: 12,
      topics: termComps.map((c) => makeTopic(c)),
    };
  });

  const gradePlan = {
    id: `form-${formNum}`,
    grade: `Form ${formNum}`,
    level: 'Ordinary Level',
    description: FORM_DESCRIPTIONS[formNum],
    terms,
  };
  grades.push(gradePlan);

  const term3Split = splits.find((sp) => sp.id.endsWith('-t3'));
  const term3Comps = (term3Split ? term3Split.codes.map((c) => compMap.get(c)).filter(Boolean) : comps);
  weeksRecord[`form-${formNum}`] = buildTerm3Weeks(formNum, term3Comps);
}

const json = (val) => JSON.stringify(val, null, 2);

const tsCurriculum = `// AUTO-GENERATED from COMPUTER_-SCIENCE-ORDINARY-SYLLABI-FORM-1-4.pdf (Forms 1-4). Do not edit by hand.
import type { GradePlan } from './ict-curriculum';

export const COMPUTER_STUDIES: GradePlan[] = ${json(grades)};
`;

const tsWeeks = `// AUTO-GENERATED Term 3 weekly lesson plans for Computer Science / Studies (Forms 1-4). Do not edit by hand.
import type { WeekPlan } from './ict-curriculum';

export const CS_TERM3_WEEKS: Record<string, WeekPlan[]> = ${json(weeksRecord)};
`;

const outDataDir = join(process.cwd(), 'src', 'data');
await writeFile(join(outDataDir, 'syllabus-computer-studies.ts'), tsCurriculum, 'utf8');
await writeFile(join(outDataDir, 'cs-t3-weeks.ts'), tsWeeks, 'utf8');

console.log('Successfully generated:');
console.log('  - src/data/syllabus-computer-studies.ts');
console.log('  - src/data/cs-t3-weeks.ts');
console.log(`Stats: ${grades.length} forms, ${grades.reduce((a, g) => a + g.terms.reduce((b, t) => b + t.topics.length, 0), 0)} topics, ${Object.values(weeksRecord).flat().length} weekly plans`);






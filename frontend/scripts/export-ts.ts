import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");
const EXPORT_DIR = path.resolve(__dirname, "../exports");

if (fs.existsSync(EXPORT_DIR)) { fs.rmSync(EXPORT_DIR, { recursive: true, force: true }); }
fs.mkdirSync(EXPORT_DIR, { recursive: true });

console.log("?? LessonsHub - Generating All Schemes & Lesson Plans\n");

export interface WeekPlan { week: number; type: string; title: string; focus: string; objectives: string[]; starter: string; development: string[]; plenary: string; resources: string[]; homework?: string; assessment?: string; }

export interface SubjectConfig { id: string; name: string; code: string; syllabusRef: string; lessonRef: string; weeksFile: string; grades: { id: string; name: string }[]; }

const subjects: SubjectConfig[] = [
  { id: "ict", name: "Information & Communication Technology", code: "ICT", syllabusRef: "CDC Ordinary Level ICT Syllabus, Forms 1-4", lessonRef: "2024 CDC O-Level ICT Syllabus Forms 1-4", weeksFile: "term3-weeks", grades: [{id:"form-1",name:"Form 1"},{id:"form-2",name:"Form 2"},{id:"form-3",name:"Form 3"},{id:"form-4",name:"Form 4"}] },
  { id: "mathematics", name: "Mathematics", code: "MATH", syllabusRef: "CDC Ordinary Level Mathematics Syllabus, Forms 1-4", lessonRef: "2024 CDC O-Level Mathematics Syllabus Forms 1-4", weeksFile: "math-t3-weeks", grades: [{id:"form-1",name:"Form 1"},{id:"form-2",name:"Form 2"},{id:"form-3",name:"Form 3"},{id:"form-4",name:"Form 4"}] },
  { id: "computer-studies", name: "Computer Studies", code: "CS", syllabusRef: "CDC Computer Studies Syllabus, Grades 8-12", lessonRef: "CDC Computer Studies Syllabus Grades 8-12", weeksFile: "cs-t3-weeks", grades: [{id:"grade-8",name:"Grade 8"},{id:"grade-9",name:"Grade 9"},{id:"grade-10",name:"Grade 10"},{id:"grade-11",name:"Grade 11"},{id:"grade-12",name:"Grade 12"}] }
];

console.log("Subjects loaded:", subjects.length);


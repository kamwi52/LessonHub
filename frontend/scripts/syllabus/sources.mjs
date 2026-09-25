// Source manifest: which Drive PDFs feed which app subject, in priority order.
// `priority` decides generation order — ICT/Computing, then Maths, then Sciences,
// then the remaining subjects.

const LEVELS = ['Ordinary Level'];
const GRADES = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

/** Curated UI metadata per subject (icon/colour/description used by the portal). */
const META = {
  ict: {
    name: 'Information & Communication Technology',
    shortCode: 'ICT',
    icon: '💻',
    color: 'blue',
    description:
      'Computer systems, networking, internet, productivity tools, digital citizenship and cybersecurity — Zambia CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level ICT Syllabus, Forms 1-4',
    lessonRef:
      "2024 CDC O-Level ICT Syllabus Forms 1-4; Teacher's Notes, Handouts & the Internet",
  },
  'computer-studies': {
    name: 'Computer Studies',
    shortCode: 'CS',
    icon: '🖥️',
    color: 'violet',
    description:
      'Hardware, operating systems, networking, programming, databases and multimedia — CDC Computer Science syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Computer Science Syllabus, Forms 1-4',
    lessonRef: '2024 CDC O-Level Computer Science Syllabus Forms 1-4; Digital Resources',
  },
  mathematics: {
    name: 'Mathematics',
    shortCode: 'MATH',
    icon: '📐',
    color: 'emerald',
    description:
      'Number, Algebra, Geometry, Statistics & Probability — Zambia CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Mathematics Syllabus, Forms 1-4',
    lessonRef:
      "2024 CDC O-Level Mathematics Syllabus Forms 1-4; Pupil's Textbook, Calculator & Graph Paper",
  },
  'integrated-science': {
    // No standalone Integrated Science syllabus exists in the Drive folder; the
    // "CIVIC EDUCATION SYLLABUS SCIENCE" PDF turned out to be Civic Education.
    name: 'Integrated Science',
    shortCode: 'SCI',
    icon: '🔬',
    color: 'cyan',
    description:
      'Biology, Chemistry and Physics foundations, scientific method and laboratory skills — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Science Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Science Syllabus Forms 1-4; Science Laboratory & Modules',
  },
  biology: {
    name: 'Biology',
    shortCode: 'BIO',
    icon: '🧬',
    color: 'green',
    description:
      'Cells, transport, nutrition, respiration, reproduction, genetics and ecology — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Biology Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Biology Syllabus Forms 1-4; Biology Laboratory & Specimens',
  },
  chemistry: {
    name: 'Chemistry',
    shortCode: 'CHEM',
    icon: '⚗️',
    color: 'amber',
    description:
      'Matter, atomic structure, reactions, stoichiometry, acids and bases, metals and organic chemistry — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Chemistry Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Chemistry Syllabus Forms 1-4; Chemistry Laboratory & Reagents',
  },
  physics: {
    name: 'Physics',
    shortCode: 'PHY',
    icon: '🧲',
    color: 'indigo',
    description:
      'Measurement, mechanics, heat, waves, electricity, magnetism and modern physics — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Physics Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Physics Syllabus Forms 1-4; Physics Laboratory & Apparatus',
  },
  'agricultural-science': {
    name: 'Agricultural Science',
    shortCode: 'AGR',
    icon: '🌾',
    color: 'lime',
    description:
      'Soil, crop production, animal husbandry, farm management and agricultural entrepreneurship — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Agricultural Science Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Agricultural Science Syllabus Forms 1-4; School Farm & Modules',
  },
  english: {
    name: 'English Language',
    shortCode: 'ENG',
    icon: '📖',
    color: 'rose',
    description:
      'Listening, speaking, reading, writing, grammar, composition and literature — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level English Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level English Syllabus Forms 1-4; Class Readers & Dictionaries',
  },
  geography: {
    name: 'Geography',
    shortCode: 'GEO',
    icon: '🌍',
    color: 'teal',
    description:
      'Map work, physical geography, climate, population, settlement, resources and regional geography of Zambia — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Geography Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Geography Syllabus Forms 1-4; Atlases, Maps & Modules',
  },
  history: {
    name: 'History',
    shortCode: 'HIST',
    icon: '📜',
    color: 'stone',
    description:
      'Zambian, African and world history — pre-colonial societies, colonial rule, nationalism and post-independence development — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level History Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level History Syllabus Forms 1-4; Source Books & Modules',
  },
  'religious-education': {
    name: 'Religious Education',
    shortCode: 'RE',
    icon: '🕊️',
    color: 'sky',
    description:
      'Religious traditions, sacred texts, ethics, morality and personal development — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Religious Education Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Religious Education Syllabus Forms 1-4; Sacred Texts & Modules',
  },
  commerce: {
    name: 'Commerce & Principles of Accounts',
    shortCode: 'CPA',
    icon: '📊',
    color: 'orange',
    description:
      'Trade, business organisation, banking, insurance, book-keeping and final accounts — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Commerce & Principles of Accounts Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Commerce & Accounts Syllabus Forms 1-4; Ledger Books & Modules',
  },
  'art-and-design': {
    name: 'Art and Design',
    shortCode: 'ART',
    icon: '🎨',
    color: 'pink',
    description:
      'Drawing, painting, design, print making, sculpture and art appreciation — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Art and Design Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Art and Design Syllabus Forms 1-4; Studio Materials & Modules',
  },
  'design-and-technology': {
    name: 'Design and Technology',
    shortCode: 'DT',
    icon: '🛠️',
    color: 'slate',
    description:
      'Technical drawing, materials, tools, manufacturing processes and project design — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Design and Technology Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Design and Technology Syllabus Forms 1-4; Workshop Tools & Modules',
  },
  'food-and-nutrition': {
    name: 'Food and Nutrition',
    shortCode: 'FN',
    icon: '🥗',
    color: 'red',
    description:
      'Nutrition, meal planning, food preparation, hygiene, storage and consumer education — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Food and Nutrition Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Food and Nutrition Syllabus Forms 1-4; Food Lab & Modules',
  },
  'literature-in-english': {
    name: 'Literature in English',
    shortCode: 'LIT',
    icon: '🎭',
    color: 'fuchsia',
    description:
      'Prose, poetry and drama analysis, literary devices, themes and critical appreciation — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Literature in English Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Literature in English Syllabus Forms 1-4; Set Texts & Modules',
  },
  'zambian-languages': {
    name: 'Zambian Languages',
    shortCode: 'ZAM',
    icon: '🗣️',
    color: 'yellow',
    description:
      'Zambian language structures, oral literature, composition, reading and cultural expression — CDC O Level syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Zambian Languages Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Zambian Languages Syllabus Forms 1-4; Readers & Modules',
  },
  'civic-education': {
    name: 'Civic Education',
    shortCode: 'CIV',
    icon: '🏛️',
    color: 'purple',
    description:
      'Citizenship, governance, human rights, democracy, the constitution and civic responsibility — CDC syllabus (Forms 1-4).',
    syllabusRef: 'CDC Ordinary Level Civic Education Syllabus, Forms 1-4',
    lessonRef: 'CDC O-Level Civic Education Syllabus Forms 1-4; Constitution & Modules',
  },
};

/** Drive filename -> app subject. One entry per subject the pipeline generates. */
const FILES = [
  // ---------- Priority 1: ICT & computing ----------
  { id: 'ict', slug: 'ict-o-level-2024', priority: 1, drive: 'ICT_Ordinary_Level_Syllabus_(2024).pdf' },
  {
    id: 'computer-studies',
    slug: 'computer-science-o-level-2024',
    priority: 1,
    drive: 'Computer_Science_Syllabus_(2024)_Ordinary_Level.pdf',
  },

  // ---------- Priority 2: Mathematics ----------
  {
    id: 'mathematics',
    slug: 'mathematics-o-level',
    priority: 2,
    // The "Final O-LEVEL MATH" PDF ships a broken font map; this copy extracts cleanly.
    drive: 'Maths_STEM_FINALISED_Copy[1].pdf',
  },

  // ---------- Priority 3: Sciences ----------
  {
    id: 'biology',
    slug: 'biology-o-level',
    priority: 3,
    drive: 'CAMERA READY O LEVEL BIOLOGY SYLABUS 5-02-2024 FINAL CORRECTED FOR PRINTING.pdf',
  },
  {
    id: 'chemistry',
    slug: 'chemistry-o-level',
    priority: 3,
    drive: 'CHEMISTRY SYLLABUS  FINAL 06-02-2024.pdf',
  },
  {
    id: 'physics',
    slug: 'physics-o-level',
    priority: 3,
    drive: 'PHYSICS SYLLABUS  O LEVEL FORM 1-4 CAMERA READY.pdf',
  },
];

/** Optional extras — generate with `--all` once the priority subjects look right. */
const EXTRA_FILES = [
  {
    id: 'agricultural-science',
    slug: 'agricultural-science-o-level',
    priority: 4,
    drive: 'AGRICULTURAL SCIENCE   O LEVEL  SYLLABUS FORM 1-4.pdf',
  },
  {
    id: 'english',
    slug: 'english-o-level',
    priority: 4,
    drive: 'ENGLISH SYLABUS FORM 1-4  O LEVELCAMERA READY.pdf',
  },
  {
    id: 'geography',
    slug: 'geography-o-level',
    priority: 4,
    drive: 'GEOGRAPHY SYLLABUS 5-02-2024 FINAL CORRECTED FOR PRINTING.pdf',
  },
  { id: 'history', slug: 'history-o-level', priority: 4, drive: 'HISTORY_SYLLABUS.pdf' },
  {
    id: 'religious-education',
    slug: 'religious-education-o-level',
    priority: 4,
    drive: 'RELIGIOUS EDUCATION SYLLABUS 5-02-2024 FINAL CORRECTED FOR PRINTING.pdf',
  },
  {
    id: 'commerce',
    slug: 'commerce-accounts-o-level',
    priority: 4,
    drive: 'COMMERCE AND PRINCIPLES OF ACCOUNTS SYLABUS CAMERA READY O LEVEL FORM 1-4.pdf',
  },
  {
    id: 'art-and-design',
    slug: 'art-and-design-o-level',
    priority: 4,
    drive: 'ART AND DESIGN SYLLABUS  FINAL 06-02-2024.pdf',
  },
  {
    id: 'design-and-technology',
    slug: 'design-and-technology-o-level',
    priority: 4,
    drive: 'DESIGN AND TECHNOLOGY STUDIES 5-02-2024 FINAL CORRECTED FOR PRINTING.pdf',
  },
  {
    id: 'food-and-nutrition',
    slug: 'food-and-nutrition-o-level',
    priority: 4,
    drive: 'FOOD AND NUTRITION SYLLABUS FINAL 07-02-2024.pdf',
  },
  {
    id: 'literature-in-english',
    slug: 'literature-in-english-o-level',
    priority: 4,
    drive:
      'CAMERA READY O LEVEL LITERATURE IN ENGLISH SYLABUS 5-02-2024 FINAL CORRECTED FOR PRINTING.pdf',
  },
  {
    id: 'zambian-languages',
    slug: 'zambian-languages-o-level',
    priority: 4,
    drive: "ZAMBIAN LANGUAGES SEC O'LEVEL SYLLABUS FINAL.pdf",
  },
  {
    id: 'civic-education',
    slug: 'civic-education-o-level',
    priority: 4,
    drive: 'CIVIC EDUCATION SYLLABUS SCIENCE   O LEVEL  SYLLABUS FORM 1-4.pdf',
  },
];

const decorate = (f) => ({
  ...f,
  kind: 'syllabus',
  meta: { ...META[f.id], grades: [...GRADES], levels: [...LEVELS] },
});

const byPriority = (a, b) => a.priority - b.priority || a.meta.name.localeCompare(b.meta.name);

/** Priority subjects: ICT/computing, Mathematics, the Sciences. */
export const SOURCES = FILES.map(decorate).sort(byPriority);

/** Everything the Drive folder can feed, priority subjects first. */
export const ALL_SOURCES = [...FILES, ...EXTRA_FILES].map(decorate).sort(byPriority);

export const byId = (id) => ALL_SOURCES.find((s) => s.id === id);
export const bySlug = (slug) => ALL_SOURCES.find((s) => s.slug === slug);

/** Resolve the sources a CLI run should touch (`--all` = every mapped subject). */
export function selectSources({ all = false, only = [] } = {}) {
  const base = all ? ALL_SOURCES : SOURCES;
  if (!only.length) return base;
  const wanted = new Set(only.map((o) => o.toLowerCase()));
  const picked = base.filter((s) => wanted.has(s.id) || wanted.has(s.slug));
  const unknown = [...wanted].filter(
    (w) => !base.some((s) => s.id === w || s.slug === w),
  );
  if (unknown.length) throw new Error(`Unknown subject(s): ${unknown.join(', ')}`);
  return picked;
}


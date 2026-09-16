// Mathematics Curriculum Framework (Zambia CDC O-Level, Forms 1-4).
// Follows the same GradePlan shape as ICT so it reuses all existing pages/components.
import type { GradePlan } from './ict-curriculum';
import { MATH_TERM3_WEEKS } from './math-t3-weeks';

export const FORM1_MATH: GradePlan = {
  id: 'form-1',
  grade: 'Form 1',
  level: 'Ordinary Level',
  description: 'Mathematics: Number, Algebra, Geometry, Statistics & Probability.',
  terms: [
    {
      id: 'form1-t1',
      label: 'Term 1',
      theme: 'Number & Algebra Foundations',
      weeks: 12,
      topics: [
        {
          id: '1-1-1',
          title: 'Number Bases',
          overview: 'Number Bases - Converting and operating with numbers in different bases',
          weeks: 'Wk 1-2',
          keyTerms: ['Base', 'Denary', 'Binary', 'Octal', 'Hexadecimal'],
          lessons: [{
            id: '1-1-1-1',
            title: 'Convert numbers between base-ten and other bases',
            durationMin: 60,
            objectives: [
              'Convert numbers from base-ten to base-two, base-eight and base-twelve',
              'Convert numbers from any base back to base-ten',
              'Apply number base conversions to real-life situations',
            ],
            outline: [], resources: [], assessment: 'Conversion exercises assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-2-1',
          title: 'Fractions, Decimals and Percentages',
          overview: 'Number - Operations and conversions with fractions, decimals and percentages',
          weeks: 'Wk 3-4',
          keyTerms: ['Fraction', 'Decimal', 'Percentage', 'Recurring', 'Terminating'],
          lessons: [{
            id: '1-2-1-1',
            title: 'Perform operations with fractions and decimals',
            durationMin: 60,
            objectives: [
              'Add, subtract, multiply and divide fractions and mixed numbers',
              'Convert fractions to decimals and vice-versa',
              'Solve word problems involving fractions and decimals',
            ],
            outline: [], resources: [], assessment: 'Problem-solving accuracy assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-3-1',
          title: 'Ratio, Rate and Proportion',
          overview: 'Number - Working with ratios, rates and proportions in context',
          weeks: 'Wk 5-6',
          keyTerms: ['Ratio', 'Rate', 'Proportion', 'Unit rate'],
          lessons: [{
            id: '1-3-1-1',
            title: 'Solve problems involving ratio and proportion',
            durationMin: 60,
            objectives: [
              'Express ratios in their simplest form',
              'Divide a quantity in a given ratio',
              'Solve problems involving direct proportion',
            ],
            outline: [], resources: [], assessment: 'Ratio problems assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-4-1',
          title: 'HCF and LCM',
          overview: 'Number - Finding highest common factor and lowest common multiple',
          weeks: 'Wk 7-8',
          keyTerms: ['HCF', 'LCM', 'Prime factorization', 'Common factor'],
          lessons: [{
            id: '1-4-1-1',
            title: 'Find HCF and LCM using prime factorisation',
            durationMin: 60,
            objectives: [
              'Find the prime factorisation of a number',
              'Determine HCF and LCM of two or more numbers',
              'Apply HCF and LCM to solve real-life problems',
            ],
            outline: [], resources: [], assessment: 'Factorisation assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
      ],
    },
    {
      id: 'form1-t2',
      label: 'Term 2',
      theme: 'Geometry & Measurement',
      weeks: 12,
      topics: [
        {
          id: '1-1-2',
          title: 'Lines, Angles and Bearing',
          overview: 'Geometry - Angle properties, parallel lines, bearings',
          weeks: 'Wk 1-2',
          keyTerms: ['Angle', 'Parallel', 'Bearing', 'Compass'],
          lessons: [],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-2-2',
          title: 'Triangles, Quadrilaterals and Polygons',
          overview: 'Geometry - Properties and classification of shapes',
          weeks: 'Wk 3-4',
          keyTerms: ['Isosceles', 'Equilateral', 'Parallelogram', 'Rhombus', 'Polygon'],
          lessons: [],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-3-2',
          title: 'Perimeter and Area',
          overview: 'Measurement - Perimeter and area of plane figures',
          weeks: 'Wk 5-6',
          keyTerms: ['Perimeter', 'Area', 'Sector', 'Segment'],
          lessons: [],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-4-2',
          title: 'Pythagoras Theorem',
          overview: 'Geometry - Pythagoras theorem and applications',
          weeks: 'Wk 7-8',
          keyTerms: ['Pythagoras', 'Hypotenuse', 'Pythagorean triple'],
          lessons: [{
            id: '1-4-2-1',
            title: 'Apply Pythagoras theorem to solve problems',
            durationMin: 60,
            objectives: [
              'State Pythagoras theorem',
              'Use Pythagoras theorem to find unknown sides in right-angled triangles',
              'Solve real-life problems involving right-angled triangles',
            ],
            outline: [], resources: [], assessment: 'Pythagoras problem solving assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-5-2',
          title: 'Time and Speed',
          overview: 'Measurement - Time, speed, distance, travel graphs',
          weeks: 'Wk 9-10',
          keyTerms: ['24-hour clock', 'Time zone', 'Speed', 'Distance', 'Travel graph'],
          lessons: [],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '1-6-2',
          title: 'Financial Mathematics',
          overview: 'Number - Percentage profit, loss, discount, commission',
          weeks: 'Wk 11-12',
          keyTerms: ['Profit', 'Loss', 'Discount', 'Commission', 'VAT'],
          lessons: [{
            id: '1-6-2-1',
            title: 'Calculate percentage profit and loss',
            durationMin: 60,
            objectives: [
              'Calculate percentage profit and loss',
              'Determine selling price given cost price and percentage profit/loss',
              'Solve problems involving discounts, commission and hire purchase',
            ],
            outline: [], resources: [], assessment: 'Financial mathematics assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
      ],
    },
    {
      id: 'form1-t3',
      label: 'Term 3',
      theme: 'Geometry, Statistics & Probability',
      weeks: 13,
      topics: [
        {
          id: '1-4-1',
          title: 'Pythagoras Theorem',
          overview: 'Geometry - Pythagoras theorem and geometric constructions',
          weeks: 'Wk 1-2, 6',
          keyTerms: ['Pythagoras', 'Hypotenuse', 'Right angle', 'Construction'],
          lessons: [
            {
              id: '1-4-1-1',
              title: 'Introduction to Pythagoras theorem',
              durationMin: 60,
              objectives: [
                'Recall the theorem: a² + b² = c²',
                'Identify the hypotenuse in a right-angled triangle',
                'Use the theorem to find unknown sides',
              ],
              outline: [], resources: [], assessment: 'Pythagoras problems assessed',
            },
            {
              id: '1-4-1-2',
              title: 'Geometric constructions',
              durationMin: 60,
              objectives: [
                'Bisect line segments and angles using a ruler and compasses',
                'Construct perpendicular and parallel lines',
                'Construct triangles from given measurements',
              ],
              outline: [], resources: [], assessment: 'Construction accuracy assessed',
            },
          ],
          homeworkBank: ['Solve 5 Pythagoras problems from the textbook exercise'],
          quizQuestions: [
            'State the Pythagoras theorem',
            'Find the hypotenuse when the shorter sides are 3 cm and 4 cm',
          ],
        },
        {
          id: '1-3-2',
          title: 'Area and Perimeter',
          overview: 'Measurement - Area and perimeter of plane figures',
          weeks: 'Wk 3-4',
          keyTerms: ['Perimeter', 'Area', 'Circumference', 'Radius'],
          lessons: [
            {
              id: '1-3-2-1',
              title: 'Area and perimeter of rectangles and triangles',
              durationMin: 60,
              objectives: [
                'Calculate the perimeter and area of rectangles and triangles',
                'Solve problems involving composite shapes',
                'Convert between units of area',
              ],
              outline: [], resources: [], assessment: 'Area and perimeter problems assessed',
            },
            {
              id: '1-3-2-2',
              title: 'Area and circumference of circles',
              durationMin: 60,
              objectives: [
                'Calculate the circumference of a circle given the radius or diameter',
                'Calculate the area of a circle',
                'Solve problems involving semicircles and quadrants',
              ],
              outline: [], resources: [], assessment: 'Circle problems assessed',
            },
          ],
          homeworkBank: ['Measure and calculate the area of the classroom floor'],
          quizQuestions: [
            'Find the area of a circle of radius 7 cm',
            'Find the perimeter of a 12 cm by 5 cm rectangle',
          ],
        },
        {
          id: '1-4-2',
          title: 'Polygons and Angle Sums',
          overview: 'Geometry - Interior and exterior angles of polygons',
          weeks: 'Wk 5',
          keyTerms: ['Polygon', 'Interior angle', 'Exterior angle', 'Regular polygon'],
          lessons: [
            {
              id: '1-4-2-1',
              title: 'Angle sums of polygons',
              durationMin: 60,
              objectives: [
                'Derive the formula for the sum of interior angles of a polygon',
                'Find the size of an interior or exterior angle of a regular polygon',
                'Solve problems involving angles of polygons',
              ],
              outline: [], resources: [], assessment: 'Polygon angle problems assessed',
            },
          ],
          homeworkBank: ['Draw three regular polygons and label the interior and exterior angles'],
          quizQuestions: ['Find the sum of the interior angles of a hexagon'],
        },
        {
          id: '4-1-1',
          title: 'Data Collection and Presentation',
          overview: 'Statistics - Collecting, presenting and interpreting data',
          weeks: 'Wk 8-9',
          keyTerms: ['Data', 'Frequency table', 'Bar chart', 'Pie chart', 'Mean'],
          lessons: [
            {
              id: '4-1-1-1',
              title: 'Collect, organise and present data',
              durationMin: 60,
              objectives: [
                'Collect data using tally charts and frequency tables',
                'Present data using bar charts and pie charts',
                'Interpret data presented in tables and charts',
              ],
              outline: [], resources: [], assessment: 'Data presentation task assessed',
            },
            {
              id: '4-1-1-2',
              title: 'Mean, median, mode and range',
              durationMin: 60,
              objectives: [
                'Calculate the mean, median, mode and range of a data set',
                'Interpret averages in real-life contexts',
                'Compare two data sets using averages',
              ],
              outline: [], resources: [], assessment: 'Averages assessed',
            },
          ],
          homeworkBank: ['Collect data on the number of siblings in 20 households and present it in a frequency table'],
          quizQuestions: [
            'Find the mean of 4, 7, 9 and 10',
            'Which average is affected most by an extreme value?',
          ],
        },
        {
          id: '4-2-1',
          title: 'Probability',
          overview: 'Statistics - Simple probability and compound events',
          weeks: 'Wk 10-11',
          keyTerms: ['Probability', 'Outcome', 'Sample space', 'Event'],
          lessons: [
            {
              id: '4-2-1-1',
              title: 'Introduction to probability',
              durationMin: 60,
              objectives: [
                'Define probability and describe the probability scale',
                'List the sample space of a simple experiment',
                'Calculate the probability of a single event',
              ],
              outline: [], resources: [], assessment: 'Simple probability assessed',
            },
            {
              id: '4-2-1-2',
              title: 'Probability of compound events',
              durationMin: 60,
              objectives: [
                'Calculate probabilities of mutually exclusive events',
                'Calculate probabilities of independent events',
                'Solve problems using tree diagrams and tables',
              ],
              outline: [], resources: [], assessment: 'Compound probability assessed',
            },
          ],
          homeworkBank: ['Toss a coin 50 times, record the outcomes and compare with the theoretical probability'],
          quizQuestions: ['A die is rolled once: find the probability of getting a prime number'],
        },
      ],
    },
  ],
};

export const FORM2_MATH: GradePlan = {
  id: 'form-2',
  grade: 'Form 2',
  level: 'Ordinary Level',
  description: 'Mathematics: Number II, Algebra II, Geometry II, Statistics & Probability.',
  terms: [
    {
      id: 'form2-t1',
      label: 'Term 1',
      theme: 'Algebra II & Number II',
      weeks: 12,
      topics: [
        {
          id: '2-1-1',
          title: 'Standard Form and Significant Figures',
          overview: 'Number - Standard form and significant figures',
          weeks: 'Wk 1-2',
          keyTerms: ['Standard form', 'Significant figures', 'Scientific notation'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-2-1',
          title: 'Factorisation',
          overview: 'Algebra - Factorising quadratic expressions',
          weeks: 'Wk 3-4',
          keyTerms: ['Factorisation', 'Quadratic', 'Common factor', 'Difference of squares'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-3-1',
          title: 'Quadratic Equations',
          overview: 'Algebra - Solving quadratic equations by factorisation',
          weeks: 'Wk 5-6',
          keyTerms: ['Quadratic equation', 'Root', 'Zero product property'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-4-1',
          title: 'Sequences and Patterns',
          overview: 'Algebra - Arithmetic and geometric sequences',
          weeks: 'Wk 7-8',
          keyTerms: ['Sequence', 'Arithmetic progression', 'Geometric progression', 'Common difference'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-5-1',
          title: 'Simultaneous Equations',
          overview: 'Algebra - Solving simultaneous equations in two unknowns',
          weeks: 'Wk 9-10',
          keyTerms: ['Simultaneous equations', 'Elimination', 'Substitution', 'Graphical method'],
          lessons: [{
            id: '2-5-1-1',
            title: 'Solve simultaneous equations by elimination and substitution',
            durationMin: 60,
            objectives: [
              'Solve simultaneous equations using the elimination method',
              'Solve simultaneous equations using the substitution method',
              'Apply simultaneous equations to word problems',
            ],
            outline: [], resources: [], assessment: 'Simultaneous equations assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-6-1',
          title: 'Inequalities',
          overview: 'Algebra - Linear and quadratic inequalities',
          weeks: 'Wk 11-12',
          keyTerms: ['Inequality', 'Solution set', 'Number line', 'Interval notation'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
      ],
    },
    {
      id: 'form2-t2',
      label: 'Term 2',
      theme: 'Trigonometry & Geometry',
      weeks: 12,
      topics: [
        {
          id: '2-1-2',
          title: 'Trigonometric Ratios',
          overview: 'Geometry - Sine, cosine, tangent of acute angles',
          weeks: 'Wk 1-3',
          keyTerms: ['Sine', 'Cosine', 'Tangent', 'SOHCAHTOA', 'Hypotenuse'],
          lessons: [{
            id: '2-1-2-1',
            title: 'Apply trigonometric ratios to find unknown sides and angles',
            durationMin: 60,
            objectives: [
              'Define sine, cosine and tangent for acute angles in right-angled triangles',
              'Use trigonometric ratios to find unknown sides and angles',
              'Solve problems involving angles of elevation and depression',
            ],
            outline: [], resources: [], assessment: 'Trigonometric problem-solving assessed',
          }],
          homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-2-2',
          title: 'Congruence and Similarity',
          overview: 'Geometry - Congruent and similar triangles',
          weeks: 'Wk 4-5',
          keyTerms: ['Congruent', 'Similar', 'SSS', 'SAS', 'Scale factor'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-3-2',
          title: 'Circles and Trigonometry',
          overview: 'Geometry - Chord properties and trigonometry applications',
          weeks: 'Wk 6-7',
          keyTerms: ['Chord', 'Tangent', 'Arc', 'Segment', 'Sector'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-4-2',
          title: 'Mensuration',
          overview: 'Geometry - Surface area and volume of solids',
          weeks: 'Wk 8-9',
          keyTerms: ['Surface area', 'Volume', 'Cylinder', 'Cone', 'Sphere'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-5-2',
          title: 'Statistics II',
          overview: 'Statistics - Histograms, cumulative frequency, measures of spread',
          weeks: 'Wk 10-11',
          keyTerms: ['Histogram', 'Cumulative frequency', 'Median', 'Interquartile range'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
        {
          id: '2-6-2',
          title: 'Probability II',
          overview: 'Statistics - Probability trees and combined events',
          weeks: 'Wk 12',
          keyTerms: ['Probability tree', 'Independent', 'Mutually exclusive', 'Combined events'],
          lessons: [], homeworkBank: [], quizQuestions: [],
        },
      ],
    },
    {
      id: 'form2-t3',
      label: 'Term 3',
      theme: 'Trigonometry, Mensuration & Statistics',
      weeks: 13,
      topics: [
        {
          id: '2-1-2',
          title: 'Trigonometric Ratios',
          overview: 'Geometry - Sine, cosine and tangent of acute angles',
          weeks: 'Wk 1-4',
          keyTerms: ['Sine', 'Cosine', 'Tangent', 'SOHCAHTOA', 'Angle of elevation'],
          lessons: [
            {
              id: '2-1-2-1',
              title: 'Trigonometric ratios in right-angled triangles',
              durationMin: 60,
              objectives: [
                'Define sine, cosine and tangent for acute angles',
                'Find unknown sides using trigonometric ratios',
                'Find unknown angles using the inverse ratios',
              ],
              outline: [], resources: [], assessment: 'Trigonometric ratios assessed',
            },
            {
              id: '2-1-2-2',
              title: 'Trigonometry problems in two and three dimensions',
              durationMin: 60,
              objectives: [
                'Solve problems involving angles of elevation and depression',
                'Solve two-dimensional problems using trigonometric ratios',
                'Solve simple three-dimensional problems involving right-angled triangles',
              ],
              outline: [], resources: [], assessment: 'Trigonometry problem solving assessed',
            },
          ],
          homeworkBank: ['A ladder leans against a wall: use trigonometry to find the height reached'],
          quizQuestions: ['Find the angle whose sine is 0.5'],
        },
        {
          id: '2-4-2',
          title: 'Mensuration',
          overview: 'Geometry - Surface area and volume of solids',
          weeks: 'Wk 5-6',
          keyTerms: ['Surface area', 'Volume', 'Prism', 'Cylinder', 'Cone', 'Sphere'],
          lessons: [
            {
              id: '2-4-2-1',
              title: 'Surface area of solids',
              durationMin: 60,
              objectives: [
                'Calculate the total surface area of prisms and cylinders',
                'Calculate the curved surface area of cones',
                'Solve real-life problems involving surface area',
              ],
              outline: [], resources: [], assessment: 'Surface area problems assessed',
            },
            {
              id: '2-4-2-2',
              title: 'Volume of solids',
              durationMin: 60,
              objectives: [
                'Calculate the volume of prisms and cylinders',
                'Calculate the volume of cones and spheres',
                'Solve problems involving capacity',
              ],
              outline: [], resources: [], assessment: 'Volume problems assessed',
            },
          ],
          homeworkBank: ['Find the volume of a cylindrical water tank in your community'],
          quizQuestions: ['Find the volume of a cylinder of radius 7 cm and height 10 cm'],
        },
        {
          id: '4-3-1',
          title: 'Statistics II - Grouped Data',
          overview: 'Statistics - Grouped data, histograms and cumulative frequency',
          weeks: 'Wk 8-9',
          keyTerms: ['Class interval', 'Histogram', 'Cumulative frequency', 'Quartile'],
          lessons: [
            {
              id: '4-3-1-1',
              title: 'Grouped data and histograms',
              durationMin: 60,
              objectives: [
                'Construct frequency tables for grouped data',
                'Draw and interpret histograms',
                'Estimate the mode from a histogram',
              ],
              outline: [], resources: [], assessment: 'Histogram task assessed',
            },
            {
              id: '4-3-1-2',
              title: 'Cumulative frequency and measures of dispersion',
              durationMin: 60,
              objectives: [
                'Draw cumulative frequency curves',
                'Estimate the median and quartiles from a cumulative frequency curve',
                'Calculate the range and interquartile range',
              ],
              outline: [], resources: [], assessment: 'Cumulative frequency assessed',
            },
          ],
          homeworkBank: ['Collect height data for the class and draw a cumulative frequency curve'],
          quizQuestions: ['What does the interquartile range measure?'],
        },
        {
          id: '4-4-1',
          title: 'Probability II',
          overview: 'Statistics - Probability trees and combined events',
          weeks: 'Wk 10-11',
          keyTerms: ['Probability tree', 'Independent events', 'Mutually exclusive', 'Expected frequency'],
          lessons: [
            {
              id: '4-4-1-1',
              title: 'Probability tree diagrams',
              durationMin: 60,
              objectives: [
                'Draw tree diagrams for two-stage experiments',
                'Use tree diagrams to calculate probabilities',
                'Distinguish between independent and dependent events',
              ],
              outline: [], resources: [], assessment: 'Tree diagram problems assessed',
            },
            {
              id: '4-4-1-2',
              title: 'Combined events and expected frequency',
              durationMin: 60,
              objectives: [
                'Use the addition and multiplication rules for probability',
                'Calculate expected frequency from probability',
                'Solve real-life problems involving combined events',
              ],
              outline: [], resources: [], assessment: 'Combined events assessed',
            },
          ],
          homeworkBank: ['Draw a tree diagram for tossing two coins and find the probability of two heads'],
          quizQuestions: ['Two dice are rolled: find the probability that the total is 7'],
        },
      ],
    },
  ],
};

export const MATH_CURRICULUM: GradePlan[] = [FORM1_MATH, FORM2_MATH];

// Attach the Term 3 weekly lesson plans (weeks 1-13) to each form's Term 3 planner,
// mirroring how the ICT curriculum splices TERM3_WEEKS in ict-curriculum.ts.
for (const g of MATH_CURRICULUM) {
  const weeks = MATH_TERM3_WEEKS[g.id];
  if (!weeks) continue;
  const t3 = g.terms.find((t) => t.id.endsWith('-t3'));
  if (t3) {
    t3.weekPlans = weeks;
    t3.weeks = 13; // 1-6 lessons, 7 mid-term, 8-11 lessons, 12 revision, 13 exams
  }
}


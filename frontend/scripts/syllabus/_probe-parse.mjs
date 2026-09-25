// Throwaway probe: run the parser over every extracted syllabus and report.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { textDir } from './paths.mjs';
import { SOURCES } from './sources.mjs';
import { parseSyllabus } from './parse.mjs';

const out = [];
for (const s of SOURCES) {
  const text = readFileSync(join(textDir, `${s.slug}.txt`), 'utf8');
  const { grades, stats } = parseSyllabus(text, { subjectName: s.meta.name });
  out.push(
    `\n## ${s.id}  forms=${stats.forms} units/topics=${stats.topics} lessons=${stats.lessons} ` +
      `noActivities=${stats.records - stats.withActivities} noStandard=${stats.records - stats.withStandard} unnamedTopics=${stats.unnamedTopics}`,
  );
  for (const g of grades) {
    out.push(`  ${g.grade}: ${g.description.slice(0, 110)}`);
    for (const t of g.terms) {
      const topicTitles = t.topics.slice(0, 4).map((x) => `${x.id}="${x.title}"`).join(' | ');
      out.push(`    ${t.label} [${t.topics.length} topics] theme="${t.theme.slice(0, 80)}"`);
      out.push(`      ${topicTitles}`);
    }
    // first lesson of each form, fully expanded
    const firstTopic = g.terms[0]?.topics[0];
    if (firstTopic) {
      const l = firstTopic.lessons[0];
      out.push(`      first lesson: id=${l.id} title="${l.title}"`);
      out.push(`        objectives=${JSON.stringify(l.objectives.slice(0, 3))}`);
      out.push(`        assessment="${l.assessment ?? ''}"`);
    }
  }
}
writeFileSync(join(textDir, '_parse-report.md'), out.join('\n'), 'utf8');
console.log('written');

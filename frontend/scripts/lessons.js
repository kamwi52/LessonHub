/**
 * LessonsHub Export - Lesson Plan HTML Generator
 */

// Generate lesson plan HTML
function lessonHTML(subject, gradeName, week) {
  const ref = subject.lessonRef;
  const examLabel = week.type === 'exam' ? ' (EXAMINATION)' : '';
  
  const contentRows = [
    {
      part: 'Introduction',
      time: '10 min',
      content: week.starter ? [week.starter, ...week.objectives.map(o => `Objective: ${o}`)] : week.objectives,
      method: 'Questioning, Prior Knowledge',
      learner: 'Answering questions',
      aids: 'Projector, Chalkboard'
    },
    {
      part: 'Development',
      time: '40 min',
      content: week.development,
      method: 'Demonstration, Lecture, Group Discussion',
      learner: 'Active participation, Note-taking',
      aids: week.resources.join(', ')
    },
    {
      part: 'Application',
      time: '20 min',
      content: week.homework ? [week.homework] : 
               (week.type === 'exam' ? ['Exam task under timed conditions'] : 
                ['Practical exercise applying the lesson content on the computer']),
      method: week.type === 'exam' ? 'Exam supervision' : 'Hands-on practice, Using the computer',
      learner: 'Individual/practical work',
      aids: week.resources.join(', ')
    },
    {
      part: 'Conclusion',
      time: '10 min',
      content: [week.plenary],
      method: 'Lecture, Q/A',
      learner: 'Recap and asking questions',
      aids: ''
    }
  ];
  
  let tableRows = '';
  contentRows.forEach(row => {
    const items = row.content.map(c => `<li style="margin-bottom:3px">${c}</li>`).join('');
    tableRows += `<tr>
      <td style="font-weight:bold;border:1px solid #94a3b8;padding:4px;width:10%">${row.part}</td>
      <td style="border:1px solid #94a3b8;padding:4px;width:10%">${row.time}</td>
      <td style="border:1px solid #94a3b8;padding:4px"><ul style="margin:0;padding-left:15px">${items}</ul></td>
      <td style="border:1px solid #94a3b8;padding:4px">${row.method}</td>
      <td style="border:1px solid #94a3b8;padding:4px">${row.learner}</td>
      <td style="border:1px solid #94a3b8;padding:4px">${row.aids}</td>
    </tr>`;
  });
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lesson Plan - ${subject.name} ${gradeName} Week ${week.week}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #1e293b; }
    .header { text-align: center; border-bottom: 2px solid #1e40af; padding: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; font-weight: bold; margin: 5px 0; color: #1e293b; }
    .header h2 { font-size: 14px; color: #1e40af; margin: 5px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0; font-size: 12px; background: #f8fafc; padding: 10px; border-radius: 5px; }
    .info-grid span { display: block; }
    .info-grid strong { color: #475569; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px; }
    th { background: #64748b; color: white; padding: 6px; text-align: left; }
    td { padding: 4px; border: 1px solid #cbd5e1; vertical-align: top; }
    .critique { margin-top: 15px; }
    .critique strong { color: #1e40af; }
    .critique-box { border: 1px solid #cbd5e1; height: 60px; margin-top: 5px; padding: 5px; background: #f8fafc; }
    .signatures { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; }
    .sig-box { border-top: 1px solid #1e293b; padding-top: 5px; width: 200px; }
    .footer { margin-top: 20px; font-size: 10px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>LINDA SECONDARY SCHOOL</h1>
    <h2>LESSON PLAN${examLabel}</h2>
  </div>
  <div class="info-grid">
    <span><strong>Teacher:</strong> ${gradeName} Teacher</span>
    <span><strong>Subject:</strong> ${subject.name}</span>
    <span><strong>Class:</strong> ${gradeName}</span>
    <span><strong>Date:</strong> _______________</span>
    <span><strong>Duration:</strong> 80 MINUTES</span>
    <span><strong>Week:</strong> ${week.week}</span>
  </div>
  <div style="margin-bottom:15px;font-size:12px">
    <strong>Topic:</strong> ${week.title}<br>
    <strong>Subtopic:</strong> ${week.focus}<br>
    <strong>Objectives:</strong> ${week.objectives.join('; ')}<br>
    <strong>Teaching Aids/Resources:</strong> ${week.resources.join(', ')}
  </div>
  <table>
    <thead>
      <tr>
        <th>PART</th><th>TIME</th><th>LESSON CONTENT</th>
        <th>METHODOLOGY</th><th>LEARNER ACTIVITY</th><th>REF/ AIDS</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
  <div class="critique">
    <strong>LESSON CRITIQUE / REMARKS:</strong>
    <div class="critique-box"></div>
  </div>
  <div class="signatures">
    <div class="sig-box">Prepared by: _______________</div>
    <div class="sig-box">Checked by (HoD): _______________</div>
    <div class="sig-box">Approved by (Principal): _______________</div>
  </div>
  <div class="footer">
    Reference: ${ref} | Generated by LessonsHub | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`;
}

module.exports = { lessonHTML };

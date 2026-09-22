/**
 * LessonsHub - HTML Generators
 */

function schemeHTML(s, gn, rows) {
  const ref = s.ref;
  let tr = '';
  rows.forEach((r, i) => {
    const bg = r.type === 'exam' ? 'background:#fef2f2' : r.type === 'revision' ? 'background:#fffbeb' : i % 2 ? 'background:#f8fafc' : '';
    tr += `<tr style="${bg}"><td style="font-weight:bold;border:1px solid #cbd5e1;padding:3px">${r.week}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.topic}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.competence}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.keyConcept}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.activity}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.assessment}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.materials}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.expectedStandard}</td><td style="border:1px solid #cbd5e1;padding:3px">${r.reference}</td></tr>`;
  });
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Scheme - ${s.name} ${gn}</title><style>body{font-family:Arial;margin:20px;color:#1e293b}.h{text-align:center;border-bottom:2px solid #1e40af;padding:15px;margin-bottom:20px}.h h1{font-size:20px;font-weight:bold;margin:5px 0}.h h2{font-size:14px;color:#1e40af;margin:5px 0}.h p{font-size:12px;margin:5px 0}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#1e40af;color:white;padding:5px;text-align:left}td{padding:3px;border:1px solid #cbd5e1}.f{margin-top:20px;font-size:10px;color:#64748b;text-align:center;border-top:1px solid #e2e8f0;padding-top:10px}</style></head><body><div class="h"><h1>LINDA SECONDARY SCHOOL</h1><h2>SCHEMES OF WORK</h2><p>SUBJECT: ${s.name.toUpperCase()} | LEVEL: ${gn.toUpperCase()} | TERM: 3 | YEAR: 2026</p></div><table><thead><tr><th>WK</th><th>TOPIC</th><th>COMPETENCES</th><th>KEY CONCEPTS</th><th>ACTIVITY</th><th>ASSESSMENT</th><th>MATERIALS</th><th>STANDARD</th><th>REF</th></tr></thead><tbody>${tr}</tbody></table><div class="f">Reference: ${ref} | Generated: ${new Date().toLocaleDateString()}</div></body></html>`;
}

function lessonHTML(s, gn, w) {
  const ref = s.lessonRef;
  const exam = w.type === 'exam' ? ' (EXAMINATION)' : '';
  const rows = [
    {p:'Introduction',t:'10 min',c:w.starter?[w.starter,...w.objectives.map(o => `Objective: ${o}`)]:w.objectives,m:'Questioning',l:'Answering',a:'Projector'},
    {p:'Development',t:'40 min',c:w.development,m:'Demo/Lecture',l:'Participation',a:w.resources.join(', ')},
    {p:'Application',t:'20 min',c:w.homework?[w.homework]:w.type==='exam'?['Exam task']:['Practical'],m:w.type==='exam'?'Exam':'Hands-on',l:'Individual',a:w.resources.join(', ')},
    {p:'Conclusion',t:'10 min',c:[w.plenary],m:'Summary',l:'Q/A',a:''}
  ].map(r => `<tr><td style="font-weight:bold;border:1px solid #94a3b8;padding:4px;width:10%">${r.p}</td><td style="border:1px solid #94a3b8;padding:4px;width:10%">${r.t}</td><td style="border:1px solid #94a3b8;padding:4px"><ul style="margin:0;padding-left:15px">${r.c.map(c=>`<li style="margin-bottom:3px">${c}</li>`).join('')}</ul></td><td style="border:1px solid #94a3b8;padding:4px">${r.m}</td><td style="border:1px solid #94a3b8;padding:4px">${r.l}</td><td style="border:1px solid #94a3b8;padding:4px">${r.a}</td></tr>`).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Lesson Plan - ${s.name} ${gn} W${w.week}</title><style>body{font-family:Arial;margin:20px;color:#1e293b}.h{text-align:center;border-bottom:2px solid #1e40af;padding:15px;margin-bottom:20px}.h h1{font-size:20px;font-weight:bold;margin:5px 0;color:#1e293b}.h h2{font-size:14px;color:#1e40af;margin:5px 0}.info{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:10px 0;font-size:12px;background:#f8fafc;padding:8px}.info span{display:block}.info strong{color:#475569}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#64748b;color:white;padding:5px;text-align:left}td{padding:4px;border:1px solid #cbd5e1}.sig{margin-top:30px;display:flex;justify-content:space-between;font-size:11px}.sig div{border-top:1px solid #1e293b;padding-top:3px;width:150px}.f{margin-top:20px;font-size:10px;color:#64748b;text-align:center;border-top:1px solid #e2e8f0;padding-top:8px}</style></head><body><div class="h"><h1>LINDA SECONDARY SCHOOL</h1><h2>LESSON PLAN${exam}</h2></div><div class="info"><span><strong>Teacher:</strong> ${gn} Teacher</span><span><strong>Subject:</strong> ${s.name}</span><span><strong>Class:</strong> ${gn}</span><span><strong>Date:</strong> ___</span><span><strong>Duration:</strong> 80 MIN</span><span><strong>Week:</strong> ${w.week}</span></div><div style="margin-bottom:15px;font-size:12px"><strong>Topic:</strong> ${w.title}<br><strong>Objectives:</strong> ${w.objectives.join('; ')}<br><strong>Resources:</strong> ${w.resources.join(', ')}</div><table><thead><tr><th>PART</th><th>TIME</th><th>LESSON CONTENT</th><th>METHOD</th><th>LEARNER</th><th>REF</th></tr></thead><tbody>${rows}</tbody></table><div style="margin-top:15px"><strong>Critique:</strong><div style="border:1px solid #cbd5e1;height:40px;margin-top:5px"></div></div><div class="sig"><div>Prepared: ___</div><div>HoD: ___</div><div>Principal: ___</div></div><div class="f">Reference: ${ref} | Generated: ${new Date().toLocaleDateString()}</div></body></html>`;
}

module.exports = { schemeHTML, lessonHTML };

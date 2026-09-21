'use client';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays, Printer } from 'lucide-react';
import { useAuthStore } from '@/store';
import SubjectTabs from '@/components/SubjectTabs';
import { PageHero } from '@/components/ui';
import { SubjectTile } from '@/components/subject-theme';
import { resolveSubjectId, SUBJECTS } from '@/data/subjects';
import {
  SCHOOL_NAME, buildSchemeRows, getForms, getGradeById, getSubjectName, getSyllabusRef, getTerm3,
} from '@/data/scheme';

export default function SchemeOfWorkPage() {
  // useSearchParams needs a Suspense boundary when the route is prerendered.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchemeOfWorkPageInner />
    </Suspense>
  );
}

function SchemeOfWorkPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const subjectId = resolveSubjectId(searchParams.get('subject'));
  const forms = useMemo(() => getForms(subjectId), [subjectId]);
  const [gradeId, setGradeId] = useState('');
  const grade = getGradeById(subjectId, gradeId) ?? forms[0];
  const term = getTerm3(subjectId, grade?.id ?? gradeId);
  const rows = useMemo(
    () => buildSchemeRows(subjectId, grade?.id ?? gradeId, term?.id ?? ''),
    [subjectId, grade, gradeId, term],
  );

  if (!hasHydrated) { return <div>Loading...</div>; }
  if (!user) { router.push('/login'); return <div>Redirecting...</div>; }

  return (
    <div className="space-y-5">
      {/* Screen chrome — hidden when printing */}
      <div className="no-print">
        <PageHero
          eyebrow="Printable Document"
          title={<span className="flex items-center gap-3"><SubjectTile id={subjectId} size={24} />Schemes of Work</span>}
          description={(SUBJECTS.find((s) => s.id === subjectId)?.name ?? 'Subject') + ' · Term 3 · 2026. Pick a class, review the table, then print.'}
          actions={
            <button className="btn btn-small bg-amber-400 text-slate-900 hover:bg-amber-300 font-extrabold" onClick={() => window.print()}>
              <Printer size={14} /> Print Scheme
            </button>
          }
        />
        <SubjectTabs current={subjectId} />

        <div className="card !p-5 flex flex-wrap gap-4 items-end">
          <div className="min-w-[170px]">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Class</label>
            <select value={grade?.id ?? ''} onChange={(e) => setGradeId(e.target.value)} className="w-48">
              {forms.map((g) => <option key={g.id} value={g.id}>{g.grade}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Term</label>
            <input value="Term 3" readOnly className="w-32 bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Year</label>
            <input value="2026" readOnly className="w-24 bg-slate-50" />
          </div>
          <div className="flex-1" />
          <span className="chip bg-indigo-50 text-indigo-700 border border-indigo-100"><CalendarDays size={13} /> {rows.length} weeks</span>
        </div>
      </div>

      {/* Print target. `data-printable` marks the document for the print
          stylesheet (white background, black text, un-pinned height); on-screen
          chrome is marked `no-print` instead, and `id` lets you deep-link to it. */}
      <div
        id="printable-scheme"
        data-printable
        className="card bg-white p-6 rounded-2xl shadow-card border border-slate-100"
      >
        <div className="no-print mt-4 flex justify-end">
          <span className="chip bg-indigo-50 text-indigo-700 border border-indigo-100"><CalendarDays size={13} /> {rows.length} weeks</span>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-lg font-extrabold tracking-wide">{SCHOOL_NAME}</h1>
          <h2 className="text-base font-extrabold text-indigo-700">SCHEMES OF WORK</h2>
          <p className="text-[13px] font-bold text-slate-700 mt-1">
            SUBJECT: {getSubjectName(subjectId).toUpperCase()} &nbsp;·&nbsp; LEVEL: {(grade?.grade ?? '').toUpperCase()} &nbsp;·&nbsp; TERM: 3 &nbsp;·&nbsp; YEAR: 2026
          </p>
        </div>

        <table className="doc-table w-full text-xs">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1.5">WK</th>
              <th className="px-2 py-1.5">TOPIC</th>
              <th className="px-2 py-1.5">SPECIFIC COMPETENCES</th>
              <th className="px-2 py-1.5">KEY CONCEPTS</th>
              <th className="px-2 py-1.5">LEARNING ACTIVITY</th>
              <th className="px-2 py-1.5">ASSESSMENT</th>
              <th className="px-2 py-1.5">TEACHING/LEARNING MATERIALS</th>
              <th className="px-2 py-1.5">EXPECTED STANDARD</th>
              <th className="px-2 py-1.5">REFERENCE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.week} className={(r.type === 'exam' ? 'bg-red-50/70' : r.type === 'revision' ? 'bg-amber-50/70' : i % 2 === 1 ? 'bg-slate-50/70' : '')}>
                <td className="border border-slate-300 px-2 py-1 align-top font-bold">{r.week}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.topic}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.competence}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.keyConcept}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.activity}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.assessment}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.materials}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.expectedStandard}</td>
                <td className="border border-slate-300 px-2 py-1 align-top">{r.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 mt-3">Reference: {getSyllabusRef(subjectId)}</p>
      </div>
    </div>
  );
}

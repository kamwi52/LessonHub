'use client';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PenLine, Printer } from 'lucide-react';
import { WeekPlan } from '@/data/ict-curriculum';
import { useAuthStore } from '@/store';
import SubjectTabs from '@/components/SubjectTabs';
import { PageHero } from '@/components/ui';
import { SubjectTile } from '@/components/subject-theme';
import { resolveSubjectId, SUBJECTS } from '@/data/subjects';
import {
  LESSONS_PER_WEEK, SCHOOL_NAME, buildWeekLessonPlans, getForms, getGradeById, getLessonRef, getTerm3,
} from '@/data/scheme';

export default function LessonPlansPage() {
  // useSearchParams needs a Suspense boundary when the route is prerendered.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonPlansPageInner />
    </Suspense>
  );
}

function LessonPlansPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const subjectId = resolveSubjectId(searchParams.get('subject'));
  const forms = useMemo(() => getForms(subjectId), [subjectId]);
  const [gradeId, setGradeId] = useState('');
  const [teacher, setTeacher] = useState('Siayuya Kamwi');
  const [date, setDate] = useState('');
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const grade = getGradeById(subjectId, gradeId) ?? forms[0];
  const term = getTerm3(subjectId, grade?.id ?? gradeId);
  const weeks: WeekPlan[] = term?.weekPlans ?? [];

  if (!hasHydrated) { return <div>Loading...</div>; }
  if (!user) { router.push('/login'); return <div>Redirecting...</div>; }

  const printAll = () => {
    // Print everything currently mounted (all 13 weeks × 2 lessons = 26 plans).
    // window.print() must run synchronously inside the click's user gesture —
    // Chrome ignores it from timers/timeouts (blank preview). All plans are
    // always in the DOM (hidden with CSS when filtered); no state change needed.
    window.print();
  };

  const printLesson = (week: number, lesson: number) => {
    // Print ONE lesson plan without unmounting anything: tag the target node
    // synchronously in the click handler, then call window.print() in the
    // SAME gesture. The print stylesheet below hides every non-target lesson,
    // so Chrome snapshots exactly one plan. (Earlier code setState-then-print:
    // React hadn't re-rendered yet, so the preview captured the wrong DOM and
    // came out blank. Never call window.print() from a timer/effect.)
    const targetId = `printable-week-${week}-lesson-${lesson}`;
    try {
      document.body.classList.add('print-single-week');
      document.querySelectorAll('[data-printable][id^="printable-week-"]').forEach((el) => {
        el.classList.toggle('print-target', el.id === targetId);
      });
    } catch { /* non-browser env */ }
    const cleanup = () => {
      try {
        document.body.classList.remove('print-single-week');
        document.querySelectorAll('.print-target').forEach((el) => el.classList.remove('print-target'));
      } catch { /* ignore */ }
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    // Safety net if afterprint never fires: restore screen classes without
    // touching React state (state changes would re-render mid-preview).
    setTimeout(() => {
      try {
        if (document.body.classList.contains('print-single-week')) cleanup();
      } catch { /* ignore */ }
    }, 60000);
  };

  return (
    <div className="space-y-5">
      {/* Screen chrome — hidden when printing */}
      <div className="no-print">
        <PageHero
          eyebrow="Printable Documents"
          title={<span className="flex items-center gap-3"><SubjectTile id={subjectId} size={24} />Lesson Plans</span>}
          description={(SUBJECTS.find((s) => s.id === subjectId)?.name ?? 'Subject') + ` · Term 3 Linda format — ${LESSONS_PER_WEEK} lessons of 80 minutes every week. Set the teacher and start date, then print one lesson or all ${weeks.length * LESSONS_PER_WEEK} plans.`}
          actions={
            <button className="btn btn-small bg-amber-400 text-slate-900 hover:bg-amber-300 font-extrabold" onClick={printAll}>
              <Printer size={14} /> Print All Plans
            </button>
          }
        />
        <SubjectTabs current={subjectId} />

        <div className="card !p-5 flex flex-wrap gap-4 items-end">
          <div className="w-40">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Class</label>
            <select value={grade?.id ?? ''} onChange={(e) => setGradeId(e.target.value)}>
              {forms.map((g) => <option key={g.id} value={g.id}>{g.grade}</option>)}
            </select>
          </div>
          <div className="w-56">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Teacher</label>
            <input value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          </div>
          <div className="w-44">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Date (Lesson 1 of each week)</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex-1" />
          <span className="chip bg-indigo-50 text-indigo-700 border border-indigo-100"><PenLine size={13} /> {weeks.length} weeks · {weeks.length * LESSONS_PER_WEEK} plans</span>
        </div>
      </div>

      {weeks.flatMap((w) =>
        buildWeekLessonPlans(subjectId, grade?.id ?? gradeId, term?.id ?? '', w, grade?.grade ?? '').map((doc) => {
          // Lesson 1 falls on the week's start date; Lesson 2 two days later.
          const lessonDate = date
            ? new Date(new Date(date).getTime() + (w.week - 1) * 7 * 86400000 + (doc.lesson - 1) * 2 * 86400000)
                .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : "__/__/____";
          const filtered = openWeek !== null && openWeek !== w.week;
          const printId = `printable-week-${w.week}-lesson-${doc.lesson}`;
          return (
            <div
              key={printId}
              id={printId}
              data-printable
              className={`print-doc bg-white p-8 rounded-lg shadow ${filtered ? "hidden-on-filter" : ""} ${openWeek === w.week ? "" : "page-break"}`}
            >
            <div className="text-center mb-4">
              <h1 className="text-base font-bold">{SCHOOL_NAME}</h1>
              <h2 className="text-sm font-bold">LESSON PLAN{doc.type === 'exam' ? ' (EXAM WEEK)' : ''} — LESSON {doc.lesson} OF {doc.lessonsInWeek}</h2>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-xs font-semibold uppercase mb-2">
              <span>Teacher: {teacher}</span>
              <span className="text-center">Subject: {doc.subject}</span>
              <span className="text-right">Class: {doc.className}</span>
              <span>Date: {lessonDate}</span>
              <span className="text-center">Duration: {doc.duration}</span>
              <span className="text-right">Week: {w.week}</span>
            </div>
            <div className="text-xs font-semibold uppercase grid grid-cols-2 gap-y-1 mb-2">
              <span>Topic: {doc.topic}</span>
              <span>Subtopic: {doc.subtopic}</span>
            </div>
            <p className="text-xs mb-1"><strong>REFERENCES:</strong> {getLessonRef(subjectId)}</p>
            <p className="text-xs mb-1"><strong>OBJECTIVE(S):</strong> {doc.objectives}</p>
            <p className="text-xs mb-3"><strong>TEACHING AIDS/RESOURCES:</strong> {doc.aids}</p>
            <table className="w-full text-xs mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-500 px-2 py-1 w-14">PART</th>
                  <th className="border border-gray-500 px-2 py-1 w-16">TIME</th>
                  <th className="border border-gray-500 px-2 py-1">LESSON CONTENT</th>
                  <th className="border border-gray-500 px-2 py-1 w-36">METHODOLOGY</th>
                  <th className="border border-gray-500 px-2 py-1 w-36">LEARNER ACTIVITY</th>
                  <th className="border border-gray-500 px-2 py-1 w-32">REF/AIDS</th>
                </tr>
              </thead>
              <tbody>
                {doc.rows.map((r) => (
                  <tr key={r.part}>
                    <td className="border border-gray-500 px-2 py-1 align-top font-semibold">{r.part}</td>
                    <td className="border border-gray-500 px-2 py-1 align-top">{r.time}</td>
                    <td className="border border-gray-500 px-2 py-1 align-top">
                      <ul className="list-disc list-inside space-y-0.5">
                        {r.content.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </td>
                    <td className="border border-gray-500 px-2 py-1 align-top">{r.methodology}</td>
                    <td className="border border-gray-500 px-2 py-1 align-top">{r.learner}</td>
                    <td className="border border-gray-500 px-2 py-1 align-top">{r.refAids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-small btn-secondary" onClick={() => setOpenWeek(openWeek === w.week ? null : w.week)}>
                {openWeek === w.week ? 'Show all weeks' : 'Show only this week'}
              </button>
              <button className="btn btn-small btn-primary" onClick={() => printLesson(w.week, doc.lesson)}>
                🖨️ Print this lesson
              </button>
            </div>
            <p className="text-xs mt-3"><strong>Lesson critique:</strong></p>
            <p className="text-xs border-b border-dotted border-gray-400 h-6"></p>
            </div>
          );
        }),
      )}
    </div>
  );
}

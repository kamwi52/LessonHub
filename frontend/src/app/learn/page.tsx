'use client';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { WeekPlan } from '@/data/ict-curriculum';
import { SUBJECTS, getSubjectGrades, resolveSubjectId } from '@/data/subjects';
import SubjectTabs from '@/components/SubjectTabs';
import { PageHero, SectionHeading, SearchInput, EmptyState } from '@/components/ui';
import { SubjectTile, SubjectPill, subjectTheme } from '@/components/subject-theme';
import { BookOpen, CalendarDays, Clock3, GraduationCap, Layers3, PenLine, Target } from 'lucide-react';

import { useAuthStore } from '@/store';

export default function LearnPortal() {
  // useSearchParams needs a Suspense boundary when the route is prerendered.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnPortalInner />
    </Suspense>
  );
}

function LearnPortalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const subjectId = resolveSubjectId(searchParams.get('subject'));
  const subject = SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];
  const grades = useMemo(() => getSubjectGrades(subjectId), [subjectId]);
  const [gradeId, setGradeId] = useState('');
  const [termId, setTermId] = useState('');
  const [q, setQ] = useState('');

  const grade = useMemo(
    () => grades.find((g) => g.id === gradeId) ?? grades[0],
    [grades, gradeId],
  );
  const term = useMemo(
    () => grade?.terms.find((t) => t.id === (termId || grade.terms[0]?.id)) ?? grade?.terms[0],
    [grade, termId],
  );

  if (!hasHydrated) { return <div>Loading...</div>; }
  if (!user) { router.push('/login'); return <div>Redirecting...</div>; }

  const query = q.trim().toLowerCase();
  const topics = (term?.topics ?? []).filter((t) =>
    !query ||
    t.title.toLowerCase().includes(query) ||
    t.overview.toLowerCase().includes(query) ||
    t.keyTerms.some((k) => k.toLowerCase().includes(query)),
  );
  void subjectTheme;
  const totalLessons = (term?.topics ?? []).reduce((n, t) => n + t.lessons.length, 0);
  const totalWeeks = term?.weekPlans?.length ?? term?.weeks ?? 0;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow={subject.shortCode + ' · Lesson Portal'}
        title={<span className="flex items-center gap-3"><SubjectTile id={subjectId} size={24} />{subject.name}</span>}
        description={subject.description + ' Pick a grade, then a term, then jump straight into a topic.'}
        actions={
          <>
            <Link href={'/learn/schemes?subject=' + subjectId} className="btn btn-small bg-white/15 text-white border border-white/25 hover:bg-white/25 no-underline">
              <CalendarDays size={14} /> Schemes
            </Link>
            <Link href={'/learn/lesson-plans?subject=' + subjectId} className="btn btn-small bg-amber-400 text-slate-900 hover:bg-amber-300 no-underline font-extrabold">
              <PenLine size={14} /> Lesson Plans
            </Link>
          </>
        }
        stats={[
          { label: 'Grades', value: String(grades.length) },
          { label: 'Topics', value: String(term?.topics.length ?? 0) },
          { label: 'Lessons', value: String(totalLessons) },
          { label: 'Weeks', value: String(totalWeeks) },
        ]}
      />

      <SubjectTabs current={subjectId} />

      <div className="card !p-5 flex flex-wrap gap-4 items-end">
        <div className="min-w-[190px]">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Grade</label>
          <select value={grade?.id ?? ''} onChange={(e) => { setGradeId(e.target.value); setTermId(''); }}>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>{g.grade} — {g.level}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[220px]">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Term</label>
          <select value={term?.id ?? ''} onChange={(e) => setTermId(e.target.value)}>
            {(grade?.terms ?? []).map((t) => (
              <option key={t.id} value={t.id}>{t.label} — {t.theme}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Search topics</label>
          <SearchInput value={q} onChange={setQ} placeholder="e.g. spreadsheets, scratch, safety" />
        </div>
      </div>

      {grade && term ? (
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <SubjectPill id={subjectId} code={subject.shortCode} />
          <span className="chip bg-white border border-slate-200 text-slate-600"><GraduationCap size={13} /> {grade.grade}</span>
          <span className="chip bg-white border border-slate-200 text-slate-600"><Layers3 size={13} /> {term.label}: {term.theme}</span>
          <span className="chip bg-white border border-slate-200 text-slate-600"><Clock3 size={13} /> {term.weeks} weeks · {topics.length} topics</span>
        </div>
      ) : (
        <EmptyState icon={<BookOpen size={26} />} title="No curriculum data yet" body="Paste your syllabus and I will load it here." />
      )}

      {term?.weekPlans && term.weekPlans.length > 0 && (
        <WeeklyPlan weeks={term.weekPlans} gradeLabel={grade.grade} termLabel={term.label} />
      )}

      <div>
        <div className="mb-3">
          <SectionHeading icon={<BookOpen size={17} />} title="Topics" sub={topics.length + ' topics in this term'} />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((t) => (
          <Link
            key={t.id}
            href={'/learn/' + (grade?.id ?? '') + '/' + (term?.id ?? '') + '/' + t.id + '?subject=' + subjectId}
            className="card card-hover no-underline group"
          >
            <div className="flex items-start gap-3">
              <span className="subject-tile !w-11 !h-11 group-hover:scale-105 transition-transform bg-gradient-to-br from-indigo-500 to-violet-600">
                <BookOpen size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">{t.weeks}</p>
                <h3 className="font-extrabold text-slate-900 group-hover:text-primary transition-colors">{t.title}</h3>
                <p className="text-[13px] text-secondary mt-0.5 leading-relaxed">{t.overview}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {t.keyTerms.slice(0, 5).map((k) => (
                <span key={k} className="text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2.5 py-0.5">{k}</span>
              ))}
            </div>
            <p className="text-[13px] mt-3 text-primary font-bold">
              {t.lessons.length} lessons
            </p>
          </Link>
        ))}
      </div>
      </div>

      {grade && term && topics.length === 0 && (
        <EmptyState icon={<Target size={26} />} title="No topics match your search" body="Try a different keyword, or clear the search box." />
      )}
    </div>
  );
}

const TYPE_STYLES: Record<string, { badge: string; border: string; label: string }> = {
  lesson: { badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200', border: 'border-l-4 border-indigo-500', label: 'Lesson' },
  exam: { badge: 'bg-red-100 text-red-800', border: 'border-l-4 border-red-500', label: 'Exam' },
  revision: { badge: 'bg-amber-100 text-amber-800', border: 'border-l-4 border-amber-500', label: 'Revision' },
};

function WeeklyPlan({ weeks, gradeLabel, termLabel }: { weeks: WeekPlan[]; gradeLabel: string; termLabel: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="card !p-5">
      <h2 className="text-lg font-extrabold mb-1">
        Weekly Lesson Plan — {termLabel} ({gradeLabel})
      </h2>
      <p className="text-sm text-secondary mb-3">
        Weeks 1-6 lessons · Week 7 mid-term exams · Weeks 8-11 lessons · Week 12 revision · Week 13 end-of-year exams.
        Click a week to see the full lesson plan.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {weeks.map((w) => {
          const s = TYPE_STYLES[w.type] ?? TYPE_STYLES.lesson;
          const isOpen = open === w.week;
          return (
            <div key={w.week} className={`card ${s.border} ${isOpen ? 'md:col-span-2' : ''}`}>
              <button
                className="w-full text-left flex items-start justify-between gap-3"
                onClick={() => setOpen(isOpen ? null : w.week)}
              >
                <div>
                  <span className={`text-xs font-semibold rounded px-2 py-0.5 ${s.badge}`}>
                    Week {w.week} · {s.label}
                  </span>
                  <h3 className="font-extrabold text-slate-900 mt-1.5">{w.title}</h3>
                  <p className="text-xs text-secondary">Syllabus focus: {w.focus}</p>
                </div>
                <span className="text-secondary text-sm shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Objectives</p>
                    <ul className="list-disc list-inside text-secondary">
                      {w.objectives.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Starter (5 min)</p>
                    <p className="text-secondary">{w.starter}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Development</p>
                    <ol className="list-decimal list-inside text-secondary space-y-0.5">
                      {w.development.map((d, i) => <li key={i}>{d}</li>)}
                    </ol>
                  </div>
                  <div>
                    <p className="font-semibold">Plenary (5 min)</p>
                    <p className="text-secondary">{w.plenary}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <p className="text-secondary"><span className="font-semibold text-gray-900">Resources:</span> {w.resources.join(', ')}</p>
                  </div>
                  {w.homework && (
                    <p className="text-secondary"><span className="font-semibold text-gray-900">Homework:</span> {w.homework}</p>
                  )}
                  {w.assessment && (
                    <p className="text-secondary"><span className="font-semibold text-gray-900">Assessment:</span> {w.assessment}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

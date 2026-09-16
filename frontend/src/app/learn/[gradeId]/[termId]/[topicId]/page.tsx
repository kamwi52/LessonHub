'use client';
import Link from 'next/link';
import { Printer, CalendarDays, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getSubjectGrade, getSubjectTerm, getSubjectTopic, resolveSubjectId } from '@/data/subjects';
import { getSubjectName } from '@/data/scheme';
import { useAuthStore } from '@/store';
import { SubjectTile, SubjectPill } from '@/components/subject-theme';

export default function TopicPage() {
  // useSearchParams needs a Suspense boundary when the route is prerendered.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopicPageInner />
    </Suspense>
  );
}

function TopicPageInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const gradeId = params.gradeId as string;
  const termId = params.termId as string;
  const topicId = params.topicId as string;
  const subjectId = resolveSubjectId(searchParams.get('subject'));
  const subjectName = getSubjectName(subjectId);

  if (!hasHydrated) { return <div>Loading...</div>; }
  if (!user) { router.push('/login'); return <div>Redirecting...</div>; }

  const grade = getSubjectGrade(subjectId, gradeId);
  const term = getSubjectTerm(subjectId, gradeId, termId);
  const topic = getSubjectTopic(subjectId, gradeId, termId, topicId);

  if (!topic || !grade || !term) {
    return (
      <div className="card text-center">
        <p>Topic not found.</p>
        <Link href={'/learn?subject=' + subjectId}>Back to {subjectName} Portal</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={'/learn?subject=' + subjectId} className="no-underline inline-flex items-center gap-1.5 text-sm font-bold">
        <ArrowLeft size={15} /> Back to {subjectName} Portal
      </Link>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SubjectPill id={subjectId} code={grade.grade} />
            <span className="chip bg-white/15 text-white border border-white/25">{term.label}</span>
            <span className="chip bg-white/15 text-white border border-white/25">{topic.weeks}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight flex items-start gap-3">
            <SubjectTile id={subjectId} size={24} />{topic.title}
          </h1>
          <p className="text-indigo-100/90 mt-2 max-w-2xl text-sm md:text-[15px]">{topic.overview}</p>
          {topic.keyTerms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {topic.keyTerms.map((k) => (
                <span key={k} className="text-[11px] font-semibold bg-white/15 border border-white/25 text-white rounded-full px-2.5 py-1">{k}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {topic.practicalTask && (
        <div className="card border-l-4 !border-l-amber-500 !bg-amber-50/50">
          <h3 className="font-extrabold text-slate-900">Class practical</h3>
          <p className="text-sm mt-1 text-slate-700">{topic.practicalTask}</p>
        </div>
      )}

      <div className="space-y-4">
        {topic.lessons.map((l, i) => (
          <div key={l.id} className="card card-hover">
            <div className="flex items-center gap-2">
              <span className="chip bg-indigo-50 text-indigo-700 border border-indigo-100">Lesson {i + 1}</span>
              <span className="text-xs text-secondary">{l.durationMin} min</span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 mt-1.5">{l.title}</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <p className="font-bold text-slate-900 text-[13px] uppercase tracking-wide">Objectives</p>
                <ul className="list-disc ml-5 mt-1.5 text-slate-700 space-y-0.5">{l.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <p className="font-bold text-slate-900 text-[13px] uppercase tracking-wide">Lesson flow</p>
                <ol className="list-decimal ml-5 mt-1.5 text-slate-700 space-y-0.5">{l.outline.map((o) => <li key={o}>{o}</li>)}</ol>
              </div>
            </div>
            <p className="text-sm mt-3"><span className="font-semibold">Resources: </span>{l.resources.join(', ')}</p>
            {l.homework && <p className="text-sm mt-1"><span className="font-semibold">Homework: </span>{l.homework}</p>}
            {l.assessment && <p className="text-sm mt-1"><span className="font-semibold">Check: </span>{l.assessment}</p>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-extrabold text-slate-900">Homework bank</h3>
          <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-0.5">{topic.homeworkBank.map((h) => <li key={h}>{h}</li>)}</ul>
        </div>
        <div className="card">
          <h3 className="font-extrabold text-slate-900">Quick quiz</h3>
          <ol className="list-decimal ml-5 mt-2 text-sm text-slate-700 space-y-0.5">{topic.quizQuestions.map((qq) => <li key={qq}>{qq}</li>)}</ol>
        </div>
      </div>

      <div className="no-print card !p-4 flex flex-wrap items-center gap-2">
        <Link href={'/learn/schemes?subject=' + subjectId} className="btn btn-secondary btn-small no-underline">
          <CalendarDays size={14} /> View Schemes
        </Link>
        <Link href={'/learn/lesson-plans?subject=' + subjectId} className="btn btn-primary btn-small no-underline">
          <Printer size={14} /> Printable Lesson Plans
        </Link>
      </div>
    </div>
  );
}

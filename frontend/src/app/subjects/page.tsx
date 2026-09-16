'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LibraryBig, Printer, PenLine, Clock3, Layers3 } from 'lucide-react';
import { SUBJECTS, FEATURED_SUBJECTS } from '@/data/subjects';
import { PageHero, SectionHeading, EmptyState } from '@/components/ui';
import { SubjectTile, SubjectPill, subjectTheme } from '@/components/subject-theme';

export default function SubjectsPage() {
  const [filter, setFilter] = useState<'all' | 'ready'>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? SUBJECTS
        : SUBJECTS.filter((s) => s.status === 'ready'),
    [filter],
  );

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Curriculum Library"
        title="Subjects"
        description="Browse every subject library. Enter a portal for topics, schemes of work and printable weekly lesson plans."
        stats={[
          { label: 'Subjects', value: String(SUBJECTS.length) },
          { label: 'Ready now', value: String(SUBJECTS.filter((s) => s.status === 'ready').length) },
          { label: 'Portals', value: String(FEATURED_SUBJECTS.length) },
          { label: 'Term', value: '3' },
        ]}
      />

      {/* Filter toggle */}
      <div className="card !py-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-bold text-slate-700">Show:</span>
        {(['all', 'ready'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              (f === filter ? 'btn btn-primary' : 'btn btn-secondary') + ' btn-small'
            }
          >
            {f === 'all' ? 'All Subjects' : 'Ready Only'}
          </button>
        ))}
        <span className="ml-auto text-xs text-secondary">{visible.length} shown</span>
      </div>

      {visible.length === 0 && (
        <EmptyState
          icon={<LibraryBig size={26} />}
          title="No subjects match this filter"
          body="Try showing all subjects instead."
          action={<button className="btn btn-secondary btn-small" onClick={() => setFilter('all')}>Show all</button>}
        />
      )}

      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((subject) => {
          const isReady = subject.status === 'ready';
          const t = subjectTheme(subject.id);
          return (
            <div
              key={subject.id}
              className={
                'card card-hover !p-5 flex flex-col ' +
                (isReady ? '' : 'opacity-70')
              }
            >
              <div className="h-1.5 -mx-5 -mt-5 mb-4 rounded-t-2xl bg-gradient-to-r overflow-hidden" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                <div className={`h-full w-full bg-gradient-to-r ${t.gradient}`} />
              </div>
              <div className="flex items-start justify-between mb-3">
                <SubjectTile id={subject.id} size={22} />
                <span
                  className={
                    'chip ' +
                    (isReady ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200')
                  }
                >
                  <span className={'w-1.5 h-1.5 rounded-full ' + (isReady ? 'bg-emerald-500' : 'bg-slate-400')} />
                  {isReady ? 'Ready' : 'Coming Soon'}
                </span>
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">{subject.name}</h2>
              <div className="mt-1.5 mb-2"><SubjectPill id={subject.id} code={subject.shortCode} /></div>
              <p className="text-[13px] text-secondary leading-relaxed mb-3">{subject.description}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary mb-4">
                <span className="inline-flex items-center gap-1"><Layers3 size={13} /> {subject.grades.join(', ')}</span>
                <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {subject.levels.join(', ')}</span>
              </div>

              <div className="mt-auto">
                {isReady ? (
                  <Link href={'/learn?subject=' + subject.id} className="btn btn-primary btn-small w-full no-underline">
                    Enter {subject.shortCode} Portal <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button disabled className="btn btn-secondary btn-small w-full cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick-access to ready subjects' schemes / lesson plans */}
      {FEATURED_SUBJECTS.filter((s) => s.status === 'ready').length > 0 && (
        <div className="card">
          <SectionHeading
            icon={<Printer size={17} />}
            title="Quick Access"
            sub="Jump straight to printable Term 3 documents."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {FEATURED_SUBJECTS.filter((s) => s.status === 'ready').map((s) => (
              <div key={s.id + '-quick'} className="flex gap-2">
                <Link
                  href={'/learn/schemes?subject=' + s.id}
                  className="btn btn-secondary btn-small flex-1 text-center no-underline"
                >
                  <Printer size={14} /> {s.shortCode} Schemes
                </Link>
                <Link
                  href={'/learn/lesson-plans?subject=' + s.id}
                  className="btn btn-secondary btn-small flex-1 text-center no-underline"
                >
                  <PenLine size={14} /> {s.shortCode} Plans
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

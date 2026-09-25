'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle, ClipboardList, LibraryBig, CalendarDays, PenLine,
  Map as MapIcon, ArrowRight, Sparkles, GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Plan } from '@/types';
import { SUBJECTS } from '@/data/subjects';
import { PageHero, ActionCard, StatCard, EmptyState } from '@/components/ui';
import { SubjectTile } from '@/components/subject-theme';
export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [plans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push('/login');
    }
  }, [user, hasHydrated, router]);

  useEffect(() => {
    // Load plans
    setIsLoading(false);
  }, []);

  if (!hasHydrated || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Linda Secondary School"
        title={<>Welcome back, {user.first_name}!</>}
        description={
          user.role === 'teacher'
            ? 'Your Term 3 schemes, lesson plans and teaching resources — ready to print and teach.'
            : user.role === 'coordinator'
            ? 'Monitor curriculum coverage and departmental planning across every subject.'
            : 'Manage school-wide planning and compliance from one place.'
        }
        actions={
          <>
            <Link href="/plans/create" className="btn btn-small bg-amber-400 text-slate-900 hover:bg-amber-300 no-underline font-extrabold">
              <PlusCircle size={15} /> New Plan
            </Link>
            <Link href="/subjects" className="btn btn-small bg-white/15 text-white border border-white/25 hover:bg-white/25 no-underline">
              Browse Subjects
            </Link>
          </>
        }
        stats={[
          { label: 'Subjects ready', value: String(SUBJECTS.filter((s) => s.status === 'ready').length) },
          { label: 'My plans', value: String(plans.length) },
          { label: 'Term', value: '3' },
          { label: 'Year', value: '2026' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<ClipboardList size={22} />} label="Lesson plans" value={String(plans.length)} sub="Saved in My Plans" tone="from-indigo-500 to-violet-600" />
        <StatCard icon={<LibraryBig size={22} />} label="Subjects" value={String(SUBJECTS.length)} sub={SUBJECTS.map((s) => s.shortCode).join(' · ')} tone="from-sky-500 to-indigo-600" />
        <StatCard icon={<CalendarDays size={22} />} label="Schemes of work" value="Term 3" sub="Printable, per class" tone="from-amber-500 to-orange-600" />
      </div>

      {/* Subjects strip */}
      <div className="card !p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Sparkles size={17} />
            </span>
            <div>
              <h2 className="font-extrabold text-slate-900 leading-tight">Jump into a subject</h2>
              <p className="text-xs text-secondary">Every portal has schemes, weekly plans and topics.</p>
            </div>
          </div>
          <Link href="/subjects" className="text-sm font-bold inline-flex items-center gap-1 no-underline">
            All subjects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SUBJECTS.map((s) => (
            <Link key={s.id} href={'/learn?subject=' + s.id} className="no-underline group">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-200 hover:shadow-pop p-3.5 transition-all group-hover:-translate-y-0.5">
                <SubjectTile id={s.id} size={20} />
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-slate-900 text-sm truncate">{s.shortCode}</span>
                  <span className="block text-xs text-secondary truncate">{s.name}</span>
                </span>
                <ArrowRight size={15} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="Create New Plan"
          description="Start a new lesson or unit plan from scratch."
          action="Create"
          href="/plans/create"
          icon={<PlusCircle size={22} />}
        />
        <ActionCard
          title="My Plans"
          description="View and edit your existing plans."
          action="Browse"
          href="/plans"
          icon={<ClipboardList size={22} />}
          tone="from-sky-500 to-indigo-600"
        />
        <ActionCard
          title="Subjects"
          description="ICT, Mathematics and more — every portal in one place."
          action="Browse"
          href="/subjects"
          icon={<LibraryBig size={22} />}
          tone="from-violet-500 to-purple-700"
        />
        <ActionCard
          title="Schemes of Work"
          description="Term 3 syllabus-aligned scheme, printable."
          action="View"
          href="/learn/schemes"
          icon={<CalendarDays size={22} />}
          tone="from-amber-500 to-orange-600"
        />
        <ActionCard
          title="Lesson Plans"
          description="Two 80-minute lesson plans per week, printable."
          action="View"
          href="/learn/lesson-plans"
          icon={<PenLine size={22} />}
          tone="from-emerald-500 to-teal-600"
        />
        {user.role === 'coordinator' && (
          <ActionCard
            title="Curriculum Mapping"
            description="View department coverage and gaps."
            action="View"
            href="/coordinator"
            icon={<MapIcon size={22} />}
            tone="from-rose-500 to-red-600"
          />
        )}
      </div>

      {/* Recent Plans */}
      <div className="card">
        <h2 className="text-lg font-extrabold">Recent Plans</h2>
        <p className="text-xs text-secondary mb-4">Your latest saved work, at a glance.</p>
        {plans.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={26} />}
            title="No plans yet"
            body="Create your first plan to get started — or open a subject portal for ready-made Term 3 content."
            action={<Link href="/plans/create" className="btn btn-primary btn-small no-underline">Create your first plan</Link>}
          />
        ) : (
          <div className="space-y-2">
            {plans.map((plan) => (
              <div key={plan.id} className="p-3 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl cursor-pointer transition-colors">
                <p className="font-bold text-slate-900 text-sm">{plan.title}</p>
                <p className="text-xs text-secondary">
                  {plan.subject} • Grade {plan.grade}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

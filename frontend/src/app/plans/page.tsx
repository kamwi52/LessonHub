'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';
import { ClipboardList, PlusCircle, Inbox } from 'lucide-react';
import { PageHero, EmptyState } from '@/components/ui';

export default function PlansPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="My Workspace"
        title={<span className="flex items-center gap-3"><ClipboardList size={26} /> My Plans</span>}
        description="All the lesson plans you have created, in one place."
        actions={
          <button className="btn btn-small bg-amber-400 text-slate-900 hover:bg-amber-300 font-extrabold" onClick={() => router.push('/plans/create')}>
            <PlusCircle size={15} /> New Plan
          </button>
        }
      />

      <EmptyState
        icon={<Inbox size={26} />}
        title="No plans yet"
        body="Create your first lesson plan to get started."
        action={<button className="btn btn-primary btn-small" onClick={() => router.push('/plans/create')}>Create First Plan</button>}
      />
    </div>
  );
}

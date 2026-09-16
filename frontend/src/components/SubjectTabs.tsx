'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUBJECTS } from '@/data/subjects';
import { subjectTheme } from '@/components/subject-theme';
import { BookOpenText } from 'lucide-react';

/**
 * Subject switcher for the learn pages. It keeps the current path and only swaps
 * the ?subject= query, so every subject reuses the same grade/term/topic pages.
 */
export default function SubjectTabs({ current }: { current: string }) {
  const pathname = usePathname();

  return (
    <div className="no-print card !py-3.5 !px-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
        <BookOpenText size={14} /> Subject
      </span>
      {SUBJECTS.map((s) => {
        if (s.status !== 'ready') {
          return (
            <span key={s.id} className="btn btn-small btn-secondary opacity-60 cursor-not-allowed">
              {s.shortCode} (soon)
            </span>
          );
        }
        const t = subjectTheme(s.id);
        const Icon = t.Icon;
        const active = s.id === current;
        return (
          <Link
            key={s.id}
            href={pathname + '?subject=' + s.id}
            className={
              'btn btn-small no-underline !rounded-full !px-4 ' +
              (active
                ? 'btn-primary'
                : 'btn-secondary')
            }
          >
            <Icon size={14} /> {s.shortCode}
          </Link>
        );
      })}
    </div>
  );
}
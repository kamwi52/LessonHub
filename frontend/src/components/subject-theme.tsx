import React from 'react';
import { Calculator, Cpu, GraduationCap, Monitor } from 'lucide-react';

export type SubjectTheme = {
  gradient: string;
  soft: string;
  dot: string;
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
};

/** Visual theme per subject id. Data (names, descriptions) still comes from the registry. */
export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  ict: {
    gradient: 'from-sky-500 to-indigo-600',
    soft: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    Icon: Monitor,
  },
  mathematics: {
    gradient: 'from-emerald-500 to-teal-600',
    soft: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    Icon: Calculator,
  },
  'computer-studies': {
    gradient: 'from-violet-500 to-purple-700',
    soft: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    Icon: Cpu,
  },
};

export const DEFAULT_THEME: SubjectTheme = {
  gradient: 'from-indigo-500 to-violet-600',
  soft: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  dot: 'bg-indigo-500',
  Icon: GraduationCap,
};

export function subjectTheme(id: string): SubjectTheme {
  return SUBJECT_THEMES[id] ?? DEFAULT_THEME;
}

/** Gradient icon tile for a subject. */
export function SubjectTile({ id, size = 20 }: { id: string; size?: number }) {
  const t = subjectTheme(id);
  const Icon = t.Icon;
  return (
    <span className={`subject-tile bg-gradient-to-br ${t.gradient}`}>
      <Icon size={size} />
    </span>
  );
}

/** Small pill showing the subject short code. */
export function SubjectPill({ id, code }: { id: string; code: string }) {
  const t = subjectTheme(id);
  return (
    <span className={`chip border ${t.soft}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
      {code}
    </span>
  );
}

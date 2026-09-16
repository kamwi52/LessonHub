import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

/** Gradient hero header used at the top of pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  stats,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  stats?: { label: string; value: string }[];
}) {
  return (
    <div className="page-hero">
      <div className="page-hero-inner">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-200 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
                {eyebrow}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</h1>
            {description && <p className="text-indigo-100/90 mt-2 max-w-2xl text-sm md:text-[15px]">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
        </div>
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-xl md:text-2xl font-extrabold">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-indigo-100/80 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Small section heading with an icon tile. */
export function SectionHeading({
  icon,
  title,
  sub,
  right,
}: {
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 leading-tight">{title}</h2>
          {sub && <p className="text-[13px] text-secondary">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/** Stat tile for dashboards. */
export function StatCard({
  icon,
  label,
  value,
  sub,
  tone = 'from-indigo-500 to-violet-600',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}) {
  return (
    <div className="card card-hover flex items-center gap-4 !p-5">
      <span className={`subject-tile bg-gradient-to-br ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-[13px] font-bold text-slate-700 mt-1">{label}</p>
        {sub && <p className="text-xs text-secondary truncate">{sub}</p>}
      </div>
    </div>
  );
}

/** Friendly empty state block. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card text-center py-12">
      {icon && (
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <p className="font-extrabold text-slate-900 text-lg">{title}</p>
      {body && <p className="text-secondary text-sm mt-1 max-w-md mx-auto">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Search input with a leading icon. */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="!pl-9" />
    </div>
  );
}

/** Action card with gradient icon tile (dashboard / hubs). */
export function ActionCard({
  title,
  description,
  action,
  href,
  icon,
  tone = 'from-indigo-500 to-violet-600',
}: {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: React.ReactNode;
  tone?: string;
}) {
  return (
    <Link href={href} className="card card-hover group block no-underline">
      <span className={`subject-tile bg-gradient-to-br ${tone} mb-4 group-hover:scale-105 transition-transform`}>
        {icon}
      </span>
      <h3 className="font-extrabold text-slate-900">{title}</h3>
      <p className="text-[13px] text-secondary mt-1 mb-4 leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
        {action} <ArrowRight size={15} />
      </span>
    </Link>
  );
}

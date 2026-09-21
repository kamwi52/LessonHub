'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, LibraryBig, GraduationCap, CalendarDays, PenLine,
  ClipboardList, PlusCircle, SearchCheck, ShieldCheck, LogOut, X, Menu,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { SUBJECTS } from '@/data/subjects';
import { subjectTheme } from '@/components/subject-theme';

const NAV_TEACH = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', Icon: LibraryBig },
  { href: '/learn', label: 'Lesson Portal', Icon: GraduationCap },
  { href: '/learn/schemes', label: 'Schemes', Icon: CalendarDays },
  { href: '/learn/lesson-plans', label: 'Lesson Plans', Icon: PenLine },
];

const NAV_PLAN = [
  { href: '/plans', label: 'My Plans', Icon: ClipboardList },
  { href: '/plans/create', label: 'Create Plan', Icon: PlusCircle },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const { sidebarOpen, toggleSidebar } = useUIStore();

  // Wait for persisted session to rehydrate before deciding layout,
  // otherwise first paint flashes "no user" and pages bounce to /login.
  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-pop mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <p className="text-xl font-extrabold text-white">LessonsHub</p>
          <p className="text-indigo-200 text-sm mt-1 loading-dots">Loading your session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen print-shell">
      {user && (
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 bg-slate-950/50 z-20 md:hidden" onClick={toggleSidebar} />
          )}
          <aside
            className={
              'no-print z-30 flex flex-col shrink-0 transition-all duration-300 max-md:fixed max-md:inset-y-0 max-md:left-0 ' +
              (sidebarOpen ? 'w-64 max-md:translate-x-0' : 'w-20 max-md:-translate-x-full')
            }
            style={{
              background: 'linear-gradient(180deg, #0d1730 0%, #101d3d 45%, #141a45 100%)',
              boxShadow: '4px 0 24px -8px rgba(13, 23, 48, 0.55)',
            }}
          >
            <div className="px-4 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-amber-500 shadow-pop shrink-0">
                  <GraduationCap size={22} className="text-white" />
                </span>
                {sidebarOpen && (
                  <span className="min-w-0">
                    <span className="block text-[15px] font-extrabold text-white leading-tight">LessonsHub</span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300">Linda Secondary</span>
                  </span>
                )}
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
              {sidebarOpen && <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Teach</p>}
              {NAV_TEACH.map((n) => (
                <NavLink key={n.href} href={n.href} label={n.label} Icon={n.Icon} open={sidebarOpen} />
              ))}
              {sidebarOpen && <p className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Plan</p>}
              {NAV_PLAN.map((n) => (
                <NavLink key={n.href} href={n.href} label={n.label} Icon={n.Icon} open={sidebarOpen} />
              ))}
              {user.role === 'coordinator' && (
                <NavLink href="/coordinator" label="Curriculum" Icon={SearchCheck} open={sidebarOpen} />
              )}
              {user.role === 'admin' && (
                <NavLink href="/admin" label="Admin" Icon={ShieldCheck} open={sidebarOpen} />
              )}
              {sidebarOpen && <SubjectShortcuts />}
            </nav>
          <div className="p-3 border-t border-white/10">
              <div className={'rounded-xl bg-white/5 border border-white/10 p-2.5 ' + (sidebarOpen ? '' : 'flex justify-center')}>
                {sidebarOpen ? (
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-extrabold shrink-0">
                      {(user.first_name?.[0] ?? 'T') + (user.last_name?.[0] ?? '')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-white truncate">{user.first_name} {user.last_name}</span>
                      <span className="block text-[11px] text-indigo-300 capitalize">{user.role}</span>
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-extrabold">
                    {(user.first_name?.[0] ?? 'T') + (user.last_name?.[0] ?? '')}
                  </span>
                )}
                <button
                  onClick={() => {
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                  }}
                  className={
                    'mt-2 w-full flex items-center gap-2 px-2.5 py-1.5 text-red-300 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-400/30 rounded-lg text-[13px] font-semibold transition-colors ' +
                    (sidebarOpen ? '' : 'justify-center')
                  }
                >
                  <LogOut size={15} />
                  {sidebarOpen && 'Logout'}
                </button>
              </div>
              <button
                onClick={toggleSidebar}
                className="mt-2 w-full hidden md:flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white py-1"
              >
                <ChevronLeft size={14} className={sidebarOpen ? '' : 'rotate-180'} />
                {sidebarOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </aside>
        </>
      )}
      <main className="flex-1 overflow-auto app-main min-w-0 print-main">
        {user ? (
          <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">{children}</div>
        ) : (
          <div className="flex items-center justify-center h-full">{children}</div>
        )}
      </main>
    </div>
  );
}

function NavLink({ href, label, Icon, open }: { href: string; label: string; Icon: React.ComponentType<{ size?: number | string; className?: string }>; open: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      title={open ? undefined : label}
      className={'side-link no-underline ' + (active ? 'side-link-active' : '') + (open ? '' : ' justify-center px-2')}
    >
      <Icon size={18} className="shrink-0" />
      {open && <span className="truncate">{label}</span>}
    </Link>
  );
}

function SubjectShortcuts() {
  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">My subjects</p>
        <div className="mt-2.5 space-y-1.5">
          {SUBJECTS.filter((s) => s.status === 'ready').map((s) => {
            const t = subjectTheme(s.id);
            const Icon = t.Icon;
            return (
              <Link
                key={s.id}
                href={'/learn?subject=' + s.id}
                className="flex items-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-2 no-underline transition-colors"
              >
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${t.gradient} shrink-0`}>
                  <Icon size={14} className="text-white" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-bold text-white leading-tight truncate">{s.shortCode}</span>
                  <span className="block text-[10.5px] text-indigo-200 truncate">{s.grades.join(' · ') || s.levels.join(' · ')}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

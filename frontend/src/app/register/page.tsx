'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, UserPlus, Mail, Lock, AlertCircle, User, PenLine } from 'lucide-react';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api';
import { Role, SELF_REGISTER_ROLES, ROLE_LABELS } from '@/types';

/** Short blurb shown under each role so the choice is self-explanatory. */
const ROLE_BLURB: Record<string, string> = {
  student: 'View schemes and lesson plans',
  teacher: 'Create and manage your own plans',
};

const ROLE_ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  student: GraduationCap,
  teacher: PenLine,
};

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('teacher');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        school_id: 1,
        role,
      });
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-amber-500/15 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-pop p-8 border border-white/40 my-8">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-pop mb-4">
          <GraduationCap size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-center text-slate-900">Create Account</h1>
        <p className="text-center text-secondary mb-2">Join LessonsHub</p>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-400 mb-6">Linda Secondary School</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">First Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  disabled={isLoading}
                  className="!pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Last Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  disabled={isLoading}
                  className="!pl-9"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@school.local"
                required
                disabled={isLoading}
                className="!pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                disabled={isLoading}
                className="!pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {SELF_REGISTER_ROLES.map((r) => {
                const Icon = ROLE_ICONS[r] ?? User;
                const selected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    disabled={isLoading}
                    aria-pressed={selected}
                    className={
                      'text-left rounded-2xl border p-3 transition-all disabled:opacity-50 ' +
                      (selected
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/30'
                        : 'border-border bg-white hover:border-indigo-300')
                    }
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={
                          'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ' +
                          (selected
                            ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
                            : 'bg-slate-100 text-slate-500')
                        }
                      >
                        <Icon size={16} />
                      </span>
                      <span className="block text-[13px] font-bold text-slate-900">{ROLE_LABELS[r]}</span>
                    </span>
                    <span className="block mt-2 text-[11.5px] leading-snug text-secondary">{ROLE_BLURB[r]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary disabled:opacity-50"
          >
            <UserPlus size={16} /> {isLoading ? 'Creating account...' : `Create ${ROLE_LABELS[role]} Account`}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

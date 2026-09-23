'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-pop p-8 border border-white/40">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-pop mb-4">
          <GraduationCap size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-center text-slate-900">LessonsHub</h1>
        <p className="text-center text-secondary mb-2">Lesson Planning Made Simple</p>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-400 mb-6">Linda Secondary School</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

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
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="!pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary disabled:opacity-50"
          >
            <LogIn size={16} /> {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-secondary">
          Demo credentials (development):
          <p className="font-mono text-xs mt-2 bg-slate-100 rounded-lg py-1.5">teacher1@devschool.local</p>
        </div>

        <p className="mt-6 text-center text-sm text-secondary">
          Demo credentials:
          <p className="font-mono text-xs mt-2 bg-slate-100 rounded-lg py-1.5">teacher1@devschool.local / devpass123</p>
        </p>
      </div>
    </div>
  );
}

'use client';

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-pop mb-4">
          <GraduationCap size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
        <p className="text-xl font-bold text-white mb-2">Page Not Found</p>
        <p className="text-indigo-200 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl shadow-lg hover:from-indigo-600 hover:to-violet-600 transition-all"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className="inline-block mt-3 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

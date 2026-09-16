'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [user, router]);

  return <div>Redirecting...</div>;
}

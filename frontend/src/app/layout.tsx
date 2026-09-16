import type { Metadata } from 'next';
import './globals.css';
import AppShell from './shell';

export const metadata: Metadata = {
  title: 'LessonsHub - Lesson Planning System',
  description: 'Digital lesson planning and curriculum mapping system for teachers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}


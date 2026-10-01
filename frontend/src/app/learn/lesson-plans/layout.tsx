import type { Metadata } from 'next';

/*
 * Printed lesson plans carry the browser's own page header/footer whenever the print
 * dialog has "Headers and footers" ticked, and that header prints the document title.
 * Overriding the title here keeps the product name ("LessonsHub") off the paper —
 * the sheet reads "Lesson Plans — Ministry of Education" instead.
 */
export const metadata: Metadata = {
  title: 'Lesson Plans — Ministry of Education',
};

export default function LessonPlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

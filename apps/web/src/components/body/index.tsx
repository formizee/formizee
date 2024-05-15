import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui';
import { cn } from '@/lib/ui';
import { ThemeProvider } from '../theme';

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const className = cn(
  'min-h-screen bg-background font-sans antialiased',
  font.variable
);

export function Body({
  children,
  fallback
}: Readonly<{ children: React.ReactNode; fallback: React.ReactNode }>) {
  return (
    <body className={className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </ThemeProvider>
      <Toaster />
    </body>
  );
}

export default Body;

import {Inter} from 'next/font/google';
import {Suspense} from 'react';
import {Toaster} from '@formizee/ui/toaster';
import {cn} from '@formizee/ui';
import {ThemeProvider} from '../theme';

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
}: Readonly<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}>): JSX.Element {
  return (
    <body className={className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Suspense fallback={fallback}>{children}</Suspense>
        <Toaster />
      </ThemeProvider>
    </body>
  );
}

export default Body;

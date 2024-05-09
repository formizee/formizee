import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui';
import {Inter} from 'next/font/google';
import {cn} from '@/lib/ui';

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const className = cn(
  'min-h-screen bg-background font-sans antialiased',
  font.variable
);

export const BaseBody = ({children}: Readonly<{children: React.ReactNode}>) => (
  <body className={className}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
    <Toaster />
  </body>
);

export default BaseBody;

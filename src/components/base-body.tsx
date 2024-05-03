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
  <body className={className}>{children}</body>
);

export default BaseBody;

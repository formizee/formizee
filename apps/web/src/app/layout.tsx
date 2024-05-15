import type { Metadata } from 'next';
import { Body } from '@/components';
import Loading from './loading';
import './globals.css';

export const metadata: Metadata = {
  title: 'Formizee.',
  description: 'Form Backend built for developers.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <Body fallback={<Loading />}>{children}</Body>
    </html>
  );
}

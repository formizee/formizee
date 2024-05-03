import {BaseBody} from '@/components';
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Formizee',
  description: 'Form Backend built for developers.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <BaseBody>{children}</BaseBody>
    </html>
  );
}

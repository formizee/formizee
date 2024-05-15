'use client';

import type { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): JSX.Element {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

export default ThemeProvider;

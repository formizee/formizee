'use client';

import {ThemeProvider as NextThemeProvider} from 'next-themes';
import type {ThemeProviderProps} from 'next-themes/dist/types';

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): JSX.Element {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

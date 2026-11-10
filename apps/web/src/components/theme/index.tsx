'use client';

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps
} from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): JSX.Element {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

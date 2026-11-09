'use client';

import {ThemeProvider as NextThemeProvider} from 'next-themes';
import type {ThemeProviderProps} from 'next-themes';
export * from './toggle';

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): React.JSX.Element {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

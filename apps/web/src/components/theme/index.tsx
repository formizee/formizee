'use client';

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps
} from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): React.JSX.Element {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

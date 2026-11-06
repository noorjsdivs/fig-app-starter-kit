import { createContext, type ReactNode, useContext, useMemo } from 'react';

import { dark, light, type Palette, type ThemeName } from './tokens';

interface ThemeValue {
  name: ThemeName;
  c: Palette;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeValue>({ name: 'light', c: light, isDark: false });

export function AppThemeProvider({ children }: { children: ReactNode }) {
  // Light for now; once the store exists this reads the saved preference.
  const name: ThemeName = 'light';
  const value = useMemo<ThemeValue>(() => ({ name, c: name === 'light' ? light : dark, isDark: false }), [name]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useApp } from '@/store/app-store';

import { dark, light, type Palette, type ThemeName } from './tokens';

interface ThemeValue {
  name: ThemeName;
  c: Palette;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeValue>({ name: 'light', c: light, isDark: false });

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const pref = useApp((s) => s.theme);
  const system = useColorScheme();
  const name: ThemeName = pref === 'system' ? (system === 'dark' ? 'dark' : 'light') : pref;
  const value = useMemo<ThemeValue>(() => ({ name, c: name === 'dark' ? dark : light, isDark: name === 'dark' }), [name]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

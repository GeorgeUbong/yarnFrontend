'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Theme } from '@mui/material/styles';
import {
  lightTheme,
  darkTheme,
  BRAND_COLORS,
  ACCENT_COLORS,
} from '../theme/theme';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: ResolvedTheme;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  brandColors: typeof BRAND_COLORS;
  accentColors: typeof ACCENT_COLORS;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'yarnnaija_theme_mode';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultMode = 'light',
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [systemMode, setSystemMode] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Read initial stored mode and listen for system preference
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        setModeState(stored);
      }
    } catch {
      // Ignore localStorage access issues if disabled in browser
    }

    // Media query for system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemMode(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedMode: ResolvedTheme = useMemo(() => {
    if (!mounted) return defaultMode === 'dark' ? 'dark' : 'light';
    if (mode === 'system') return systemMode;
    return mode;
  }, [mounted, defaultMode, mode, systemMode]);

  const isDark = resolvedMode === 'dark';

  // Apply theme class and data-theme attribute to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (resolvedMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [resolvedMode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // Storage access exception safe guard
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(resolvedMode === 'light' ? 'dark' : 'light');
  }, [resolvedMode, setMode]);

  const activeTheme = useMemo(() => {
    return resolvedMode === 'dark' ? darkTheme : lightTheme;
  }, [resolvedMode]);

  const value = useMemo<ThemeContextType>(
    () => ({
      mode,
      resolvedMode,
      isDark,
      setMode,
      toggleTheme,
      brandColors: BRAND_COLORS,
      accentColors: ACCENT_COLORS,
      theme: activeTheme,
    }),
    [mode, resolvedMode, isDark, setMode, toggleTheme, activeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the ThemeContext
 */
export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Convenience alias
export const useThemeMode = useThemeContext;

export default ThemeContext;


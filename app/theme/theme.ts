'use client';

import { createTheme, Theme } from '@mui/material/styles';

export const BRAND_COLORS = {
  50: '#F9FFFA',
  200: '#A5D6A7',
  400: '#66BB6A',
  900: '#1B5E20',
} as const;

export const BASE_COLORS = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

declare module '@mui/material/styles' {
  interface Palette {
    brand: typeof BRAND_COLORS;
  }
  interface PaletteOptions {
    brand?: typeof BRAND_COLORS;
  }
}

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    brand: BRAND_COLORS,
    primary: {
      main: BRAND_COLORS[900],
      light: BRAND_COLORS[400],
      dark: '#0E3C12',
      contrastText: BASE_COLORS.white,
    },
    secondary: {
      main: BRAND_COLORS[400],
      light: BRAND_COLORS[200],
      dark: BRAND_COLORS[900],
      contrastText: BASE_COLORS.black,
    },
    background: {
      default: BRAND_COLORS[50],
      paper: BASE_COLORS.white,
    },
    text: {
      primary: '#121814',
      secondary: '#4A554E',
    },
    divider: '#E0E6E1',
  },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    brand: BRAND_COLORS,
    primary: {
      main: BRAND_COLORS[400],
      light: BRAND_COLORS[200],
      dark: BRAND_COLORS[200], // lighter hover keeps dark text readable
      contrastText: BASE_COLORS.black,
    },
    secondary: {
      main: BRAND_COLORS[200],
      light: BRAND_COLORS[50],
      dark: BRAND_COLORS[400],
      contrastText: BASE_COLORS.black,
    },
    background: {
      default: '#0A160D',
      paper: '#141D17',
    },
    text: {
      primary: '#E8F5E9',
      secondary: '#9EAE9F',
    },
    divider: '#233328',
  },
});
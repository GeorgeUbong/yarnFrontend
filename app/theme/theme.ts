'use client';

import { createTheme, Theme } from '@mui/material/styles';

/**
 * Brand Color Palette extracted from the brand color scheme image:
 * 1. #E8F5E9 - Brand 50 (Very light mint, subtle background tint, light container surface)
 * 2. #A5D6A7 - Brand 200 (Soft light green, borders, secondary accent, muted tags)
 * 3. #66BB6A - Brand 400 (Vibrant green, action highlight, primary in dark mode)
 * 4. #1B5E20 - Brand 900 (Deep forest green, primary in light mode, brand headers)
 */
export const BRAND_COLORS = {
  50: '#E8F5E9',
  200: '#A5D6A7',
  400: '#66BB6A',
  900: '#1B5E20',
} as const;

/**
 * Accent colors for Error and Info states
 */
export const ACCENT_COLORS = {
  error: {
    light: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
      contrastText: '#FFFFFF',
      surface: '#FFEBEE',
      border: '#FFCDD2',
    },
    dark: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
      surface: '#2C0B0E',
      border: '#7F1D1D',
    },
  },
  info: {
    light: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
      contrastText: '#FFFFFF',
      surface: '#E1F5FE',
      border: '#B3E5FC',
    },
    dark: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
      contrastText: '#000000',
      surface: '#082132',
      border: '#0369A1',
    },
  },
} as const;

// Module augmentation for TypeScript support with custom brand palette
declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      50: string;
      200: string;
      400: string;
      900: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      50: string;
      200: string;
      400: string;
      900: string;
    };
  }
}

/**
 * Shared typography and shape configuration
 */
const sharedThemeOptions = {
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
};

/**
 * Material UI Light Theme
 */
export const lightTheme: Theme = createTheme({
  ...sharedThemeOptions,
  palette: {
    mode: 'light',
    brand: {
      50: BRAND_COLORS[50],
      200: BRAND_COLORS[200],
      400: BRAND_COLORS[400],
      900: BRAND_COLORS[900],
    },
    primary: {
      main: BRAND_COLORS[900], // Deep forest green (#1B5E20)
      light: BRAND_COLORS[400], // Vibrant green (#66BB6A)
      dark: '#0e3c12',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: BRAND_COLORS[400], // #66BB6A
      light: BRAND_COLORS[200], // #A5D6A7
      dark: BRAND_COLORS[900], // #1B5E20
      contrastText: '#FFFFFF',
    },
    error: {
      main: ACCENT_COLORS.error.light.main,
      light: ACCENT_COLORS.error.light.light,
      dark: ACCENT_COLORS.error.light.dark,
      contrastText: ACCENT_COLORS.error.light.contrastText,
    },
    info: {
      main: ACCENT_COLORS.info.light.main,
      light: ACCENT_COLORS.info.light.light,
      dark: ACCENT_COLORS.info.light.dark,
      contrastText: ACCENT_COLORS.info.light.contrastText,
    },
    success: {
      main: BRAND_COLORS[900],
      light: BRAND_COLORS[400],
      dark: '#0e3c12',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    background: {
      default: BRAND_COLORS[50], // #E8F5E9
      paper: '#FFFFFF',
    },
    text: {
      primary: '#121814',
      secondary: '#4A554E',
    },
    divider: '#E0E6E1',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(27, 94, 32, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #E0E6E1',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

/**
 * Material UI Dark Theme
 */
export const darkTheme: Theme = createTheme({
  ...sharedThemeOptions,
  palette: {
    mode: 'dark',
    brand: {
      50: BRAND_COLORS[50],
      200: BRAND_COLORS[200],
      400: BRAND_COLORS[400],
      900: BRAND_COLORS[900],
    },
    primary: {
      main: BRAND_COLORS[400], // Vibrant green legible in dark mode (#66BB6A)
      light: BRAND_COLORS[200], // #A5D6A7
      dark: BRAND_COLORS[900], // #1B5E20
      contrastText: '#09170C',
    },
    secondary: {
      main: BRAND_COLORS[200], // #A5D6A7
      light: BRAND_COLORS[50], // #E8F5E9
      dark: BRAND_COLORS[400], // #66BB6A
      contrastText: '#09170C',
    },
    error: {
      main: ACCENT_COLORS.error.dark.main,
      light: ACCENT_COLORS.error.dark.light,
      dark: ACCENT_COLORS.error.dark.dark,
      contrastText: ACCENT_COLORS.error.dark.contrastText,
    },
    info: {
      main: ACCENT_COLORS.info.dark.main,
      light: ACCENT_COLORS.info.dark.light,
      dark: ACCENT_COLORS.info.dark.dark,
      contrastText: ACCENT_COLORS.info.dark.contrastText,
    },
    success: {
      main: BRAND_COLORS[400],
      light: BRAND_COLORS[200],
      dark: BRAND_COLORS[900],
      contrastText: '#09170C',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    background: {
      default: '#0A160D', // Corresponding deep brand green for dark mode
      paper: '#141D17',
    },
    text: {
      primary: '#E8F5E9',
      secondary: '#9EAE9F',
    },
    divider: '#233328',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(102, 187, 106, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #233328',
          backgroundColor: '#141D17',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

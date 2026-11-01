'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import TextField from '@mui/material/TextField';
import MuiButton from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useThemeContext } from './Context/themeContext';
import { Button } from './components/button';

export default function Home() {
  const { mode, resolvedMode, isDark, toggleTheme, setMode, brandColors, accentColors } =
    useThemeContext();

  const brandSwatches = [
    {
      code: brandColors[50],
      name: 'Brand 50 (Mint Surface)',
      description: 'Used for subtle surface fills, light container backgrounds, and soft badge tints.',
    },
    {
      code: brandColors[200],
      name: 'Brand 200 (Soft Green Accent)',
      description: 'Borders, secondary accents, hover highlights, and muted secondary buttons.',
    },
    {
      code: brandColors[400],
      name: 'Brand 400 (Vibrant Green)',
      description: 'Dark mode primary brand color, interactive badges, and vibrant accents.',
    },
    {
      code: brandColors[900],
      name: 'Brand 900 (Deep Forest Green)',
      description: 'Light mode primary brand color, headings, high-contrast buttons, and brand identity.',
    },
  ];

  return (
    <main className="min-h-screen py-12 px-4 sm:px-8 transition-colors duration-200">
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: brandColors[900] }}
              />
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                YarnNaija
              </Typography>
              <Chip
                label="Sprint 1 Theme Setup"
                size="small"
                sx={{
                  bgcolor: isDark ? 'brand.200' : 'brand.50',
                  color: 'brand.900',
                  fontWeight: 600,
                }}
              />
            </div>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
              Brand color system, Light &amp; Dark mode tokens, Error &amp; Info accents, and Material UI configuration.
            </Typography>
          </div>

          {/* Theme Mode Toggle Controls */}
          <Card variant="outlined" sx={{ p: 1, borderRadius: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <MuiButton
                size="small"
                variant={mode === 'light' ? 'contained' : 'text'}
                color="primary"
                onClick={() => setMode('light')}
                sx={{ minWidth: 70 }}
              >
                Light
              </MuiButton>
              <MuiButton
                size="small"
                variant={mode === 'dark' ? 'contained' : 'text'}
                color="primary"
                onClick={() => setMode('dark')}
                sx={{ minWidth: 70 }}
              >
                Dark
              </MuiButton>
              <MuiButton
                size="small"
                variant={mode === 'system' ? 'contained' : 'text'}
                color="primary"
                onClick={() => setMode('system')}
                sx={{ minWidth: 75 }}
              >
                System
              </MuiButton>
              <Divider orientation="vertical" flexItem />
              <Button variant="accent" size="small" onClick={toggleTheme}>
                Toggle ({resolvedMode})
              </Button>
            </Stack>
          </Card>
        </Box>

        {/* Section 1: Brand Colors Scheme */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
            Brand Color Scheme (From Image Palette)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            The 4 core brand hex codes extracted from the brand identity image and mapped into CSS variables and Material UI tokens:
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {brandSwatches.map((swatch) => (
              <Card
                key={swatch.code}
                variant="outlined"
                className="overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div
                  className="h-28 flex items-center justify-center p-4 border-b border-border/40"
                  style={{ backgroundColor: swatch.code }}
                >
                  <span
                    className="font-mono font-bold text-lg px-3 py-1 rounded-md shadow-sm"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      color: '#121814',
                    }}
                  >
                    {swatch.code}
                  </span>
                </div>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {swatch.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {swatch.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Box>

        {/* Section 2: Accent Colors (Error & Info) */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
            Accent Colors: Error &amp; Info
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Accessible, stateful accent colors calibrated for both light and dark modes:
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Error Accent Card */}
            <Card variant="outlined" sx={{ p: 3, borderLeft: 5, borderLeftColor: 'error.main' }}>
              <div className="flex items-center justify-between mb-3">
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                  Error Accent
                </Typography>
                <Chip
                  label={resolvedMode === 'dark' ? accentColors.error.dark.main : accentColors.error.light.main}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </div>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Used for form validation errors, destructive dialogs, network failures, and critical alert badges.
              </Typography>
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Error Alert Demonstration</AlertTitle>
                This alert uses the configured error accent color in {resolvedMode} mode.
              </Alert>
              <Stack direction="row" spacing={2}>
                <Button variant="error" size="small">
                  Error Action
                </Button>
                <MuiButton variant="outlined" color="error" size="small">
                  Outlined Error
                </MuiButton>
              </Stack>
            </Card>

            {/* Info Accent Card */}
            <Card variant="outlined" sx={{ p: 3, borderLeft: 5, borderLeftColor: 'info.main' }}>
              <div className="flex items-center justify-between mb-3">
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                  Info Accent
                </Typography>
                <Chip
                  label={resolvedMode === 'dark' ? accentColors.info.dark.main : accentColors.info.light.main}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </div>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Used for tooltips, system notices, helpful prompts, active updates, and informational guides.
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Info Alert Demonstration</AlertTitle>
                This alert uses the configured info accent color in {resolvedMode} mode.
              </Alert>
              <Stack direction="row" spacing={2}>
                <Button variant="info" size="small">
                  Info Action
                </Button>
                <MuiButton variant="outlined" color="info" size="small">
                  Outlined Info
                </MuiButton>
              </Stack>
            </Card>
          </div>
        </Box>

        {/* Section 3: Material UI & Brand Component Showcase */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
            Material UI Integration &amp; Brand Components
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Theme variables and typography work seamlessly across Material UI components and Tailwind classes:
          </Typography>

          <Card variant="outlined" sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Button Variants */}
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
                  BRAND BUTTON VARIANTS (app/components/button.tsx)
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                  <Button variant="primary">Primary ({brandColors[900]} / {brandColors[400]})</Button>
                  <Button variant="secondary">Secondary ({brandColors[400]} / {brandColors[200]})</Button>
                  <Button variant="accent">Brand Mint ({brandColors[50]})</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="primary" isLoading>Loading State</Button>
                  <Button variant="text">Text Button</Button>
                </Stack>
              </div>

              <Divider />

              {/* Material UI Input Fields & Controls */}
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
                  MATERIAL UI CONTROLS &amp; FORMS
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 1 }}>
                  <TextField
                    label="Username"
                    defaultValue="yarn_creator"
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Info Notice Field"
                    placeholder="Enter details..."
                    helperText="Active focus ring uses brand green"
                    size="small"
                    fullWidth
                  />
                  <TextField
                    error
                    label="Error Validation"
                    defaultValue="invalid_entry"
                    helperText="Uses configured error color"
                    size="small"
                    fullWidth
                  />
                </Stack>
              </div>

              <Divider />

              {/* Status Chips */}
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
                  BRAND &amp; STATE CHIPS
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Brand Primary" color="primary" />
                  <Chip label="Brand Secondary" color="secondary" />
                  <Chip label="Error State" color="error" />
                  <Chip label="Info State" color="info" />
                  <Chip label="Success State" color="success" />
                  <Chip label="Warning State" color="warning" />
                  <Chip
                    label="Custom Brand 50 / 900"
                    sx={{
                      bgcolor: 'brand.50',
                      color: 'brand.900',
                      border: '1px solid',
                      borderColor: 'brand.200',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </div>
            </Stack>
          </Card>
        </Box>
      </Container>
    </main>
  );
}

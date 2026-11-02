'use client';

import React, { useState } from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import type { Theme } from '@mui/material/styles';

export type BrandInputVariant = 'outlined' | 'soft' | 'underlined';

export interface InputFieldProps
  extends Omit<MuiTextFieldProps, 'variant' | 'color' | 'InputProps'> {
  /** Brand visual style. Defaults to 'outlined'. */
  variant?: BrandInputVariant;
  /** Shows a spinner at the end of the field and disables input. */
  isLoading?: boolean;
  /** Element rendered at the start of the field (e.g. an icon). */
  startAdornment?: React.ReactNode;
  /** Element rendered at the end of the field (e.g. an icon or unit). */
  endAdornment?: React.ReactNode;
  /** Visual success state (green border + helper text color). */
  success?: boolean;
}

export function InputField({
  variant = 'outlined',
  isLoading = false,
  startAdornment,
  endAdornment,
  success = false,
  type = 'text',
  disabled,
  error,
  fullWidth = true,
  size = 'medium',
  sx,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  // Determine custom sx based on brand variant (mirrors Button's getVariantStyles)
  const getVariantStyles = () => {
    switch (variant) {
      case 'soft':
        return {
          '& .MuiOutlinedInput-root': {
            bgcolor: 'brand.50',
            '& fieldset': {
              borderColor: 'brand.200',
            },
            '&:hover': {
              bgcolor: (theme: Theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(102, 187, 106, 0.08)'
                  : theme.palette.brand[50],
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused': {
              bgcolor: 'background.paper',
            },
          },
        };
      case 'underlined':
        return {
          '& .MuiOutlinedInput-root': {
            bgcolor: 'transparent',
            borderRadius: 0,
            '& fieldset': {
              border: 'none',
              borderBottom: '1.5px solid',
              borderColor: 'divider',
              borderRadius: 0,
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderBottomWidth: '2px',
            },
          },
        };
      case 'outlined':
      default:
        return {
          '& .MuiOutlinedInput-root': {
            bgcolor: 'transparent',
            '& fieldset': {
              borderWidth: '1.5px',
              borderColor: 'brand.200',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        };
    }
  };

  // Focus / error / success / disabled states apply to every variant
  const getStateStyles = () => ({
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '2px',
      },
      ...(success &&
        !error && {
          '& fieldset': { borderColor: 'success.main' },
          '&:hover fieldset': { borderColor: 'success.dark' },
          '&.Mui-focused fieldset': { borderColor: 'success.main' },
        }),
      ...(error && {
        '& fieldset': { borderColor: 'error.main' },
        '&:hover fieldset': { borderColor: 'error.dark' },
        '&.Mui-focused fieldset': { borderColor: 'error.main' },
      }),
      '&.Mui-disabled': {
        opacity: 0.6,
        bgcolor: 'action.disabledBackground',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: error ? 'error.main' : success ? 'success.main' : 'primary.main',
    },
    '& .MuiFormHelperText-root': {
      ml: 0.5,
      ...(success && !error && { color: 'success.main' }),
    },
  });

  const hasEnd = Boolean(endAdornment) || isPassword || isLoading;
  const customSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <MuiTextField
      variant="outlined"
      type={resolvedType}
      size={size}
      fullWidth={fullWidth}
      error={error}
      disabled={disabled || isLoading}
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.2s ease-in-out',
          },
          '& .MuiInputBase-input': {
            fontWeight: 500,
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        },
        getVariantStyles(),
        getStateStyles(),
        ...customSx,
      ]}
      slotProps={{
        input: {
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: hasEnd ? (
            <InputAdornment position="end">
              {isLoading && <CircularProgress size={18} color="inherit" />}
              {isPassword && !isLoading && (
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  size="small"
                  disabled={disabled || isLoading}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a15.7 15.7 0 01-3 3.8" />
                        <path d="M6.2 6.2C3.9 7.7 2 12 2 12s3.5 7 10 7a10.7 10.7 0 004.1-.8" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </IconButton>
              )}
              {!isLoading && !isPassword && endAdornment}
            </InputAdornment>
          ) : undefined,
        },
      }}
      {...props}
    />
  );
}

export default InputField;
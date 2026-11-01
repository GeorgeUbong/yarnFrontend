'use client';

import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export type BrandButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outlined'
  | 'text'
  | 'error'
  | 'info';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: BrandButtonVariant;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  sx,
  ...props
}: ButtonProps) {
  // Determine custom sx based on brand variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        };
      case 'secondary':
        return {
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          '&:hover': {
            bgcolor: 'secondary.dark',
          },
        };
      case 'accent':
        return {
          bgcolor: 'brand.50',
          color: 'brand.900',
          border: '1px solid',
          borderColor: 'brand.200',
          '&:hover': {
            bgcolor: 'brand.200',
            color: 'brand.900',
          },
        };
      case 'outlined':
        return {
          bgcolor: 'transparent',
          color: 'primary.main',
          border: '1.5px solid',
          borderColor: 'primary.main',
          '&:hover': {
            bgcolor: (theme: any) =>
              theme.palette.mode === 'dark'
                ? 'rgba(102, 187, 106, 0.08)'
                : 'brand.50',
            borderColor: 'primary.main',
          },
        };
      case 'error':
        return {
          bgcolor: 'error.main',
          color: 'error.contrastText',
          '&:hover': {
            bgcolor: 'error.dark',
          },
        };
      case 'info':
        return {
          bgcolor: 'info.main',
          color: 'info.contrastText',
          '&:hover': {
            bgcolor: 'info.dark',
          },
        };
      case 'text':
      default:
        return {
          bgcolor: 'transparent',
          color: 'primary.main',
          '&:hover': {
            bgcolor: (theme: any) =>
              theme.palette.mode === 'dark'
                ? 'rgba(102, 187, 106, 0.08)'
                : 'brand.50',
          },
        };
    }
  };

  const muiVariant = variant === 'outlined' ? 'outlined' : variant === 'text' ? 'text' : 'contained';

  return (
    <MuiButton
      variant={muiVariant}
      disabled={disabled || isLoading}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        px: 2.5,
        py: 1,
        transition: 'all 0.2s ease-in-out',
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <CircularProgress size={18} color="inherit" />
          {children}
        </span>
      ) : (
        children
      )}
    </MuiButton>
  );
}

export default Button;


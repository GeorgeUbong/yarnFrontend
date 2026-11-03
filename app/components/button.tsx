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
  const muiVariant = variant === 'outlined' ? 'outlined' : variant === 'text' ? 'text' : 'contained';
  const color =
    variant === 'secondary' || variant === 'accent'
      ? 'secondary'
      : variant === 'error' || variant === 'info'
        ? variant
        : 'primary';

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      disabled={disabled || isLoading}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        px: 2.5,
        py: 1,
        transition: 'all 0.2s ease-in-out',
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


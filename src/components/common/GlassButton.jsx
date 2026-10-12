import React from 'react';
import { Button, IconButton, Box } from '@mui/material';

export default function GlassButton({
  children,
  onClick,
  variant = 'glass', // 'glass' | 'primary' | 'circle'
  size = 'medium',
  iconOnly = false,
  sx = {},
  ...props
}) {
  if (variant === 'circle' || iconOnly) {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#ffffff',
          width: size === 'small' ? 36 : size === 'large' ? 48 : 42,
          height: size === 'small' ? 36 : size === 'large' ? 48 : 42,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            transform: 'scale(1.08)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </IconButton>
    );
  }

  const isPrimary = variant === 'primary';

  return (
    <Button
      onClick={onClick}
      sx={{
        borderRadius: 9999,
        px: size === 'small' ? 2 : size === 'large' ? 3.5 : 2.5,
        py: size === 'small' ? 0.6 : size === 'large' ? 1.2 : 0.9,
        fontSize: size === 'small' ? '0.82rem' : size === 'large' ? '1rem' : '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        backgroundColor: isPrimary
          ? '#ffffff'
          : 'rgba(255, 255, 255, 0.12)',
        color: isPrimary ? '#0b0d14' : '#ffffff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${
          isPrimary
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(255, 255, 255, 0.2)'
        }`,
        boxShadow: isPrimary
          ? '0 10px 25px rgba(255, 255, 255, 0.2)'
          : '0 8px 20px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          backgroundColor: isPrimary
            ? '#f0f2f5'
            : 'rgba(255, 255, 255, 0.22)',
          transform: 'scale(1.04)',
          boxShadow: isPrimary
            ? '0 14px 30px rgba(255, 255, 255, 0.3)'
            : '0 12px 28px rgba(0, 0, 0, 0.35)',
        },
        '&:active': {
          transform: 'scale(0.97)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

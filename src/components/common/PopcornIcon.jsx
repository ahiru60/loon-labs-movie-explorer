import React from 'react';
import { Box } from '@mui/material';

/**
 * Custom High-Resolution Popcorn Icon
 * Matches CinePop modern glassmorphic theme.
 */
export default function PopcornIcon({ size = 20, sx = {}, ...props }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {/* Fluffy Golden Popcorn Kernels (Top) */}
      <path
        d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4"
        fill="#fef08a"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Popcorn Tub Body */}
      <path
        d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z"
        fill="#ffffff"
        fillOpacity="0.22"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tub Vertical Stripes */}
      <path
        d="M10 22L9 8"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 22L15 8"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Box>
  );
}

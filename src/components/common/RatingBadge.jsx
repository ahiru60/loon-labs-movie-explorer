import React from 'react';
import { Box, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { formatRating } from '../../utils/helpers';

export default function RatingBadge({ rating, size = 'medium' }) {
  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 9999,
        px: isSmall ? 1 : 1.3,
        py: isSmall ? 0.3 : 0.5,
      }}
    >
      <StarRoundedIcon
        sx={{
          color: '#fbbf24', // Amber gold
          fontSize: isSmall ? '1rem' : '1.2rem',
        }}
      />
      <Typography
        component="span"
        sx={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: isSmall ? '0.75rem' : '0.85rem',
          letterSpacing: '0.02em',
        }}
      >
        {formatRating(rating)}
      </Typography>
    </Box>
  );
}

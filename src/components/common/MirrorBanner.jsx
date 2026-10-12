import React from 'react';
import { Box, Typography } from '@mui/material';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';

export default function MirrorBanner() {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        backgroundColor: 'rgba(15, 18, 26, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 9999,
        px: { xs: 2, sm: 3 },
        py: 0.9,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        mx: 'auto',
      }}
    >
      <RocketLaunchRoundedIcon
        sx={{
          color: '#818cf8',
          fontSize: '1.1rem',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.75)',
          fontSize: { xs: '0.78rem', sm: '0.85rem' },
          fontWeight: 500,
        }}
      >
        Bookmark our mirrors:{' '}
        <Typography
          component="span"
          sx={{
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            mx: 0.5,
            cursor: 'pointer',
            '&:hover': { color: '#818cf8' },
          }}
        >
          shuttletv.pk
        </Typography>
        {' • '}
        <Typography
          component="span"
          sx={{
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            mx: 0.5,
            cursor: 'pointer',
            '&:hover': { color: '#818cf8' },
          }}
        >
          shuttletv.me
        </Typography>
      </Typography>
    </Box>
  );
}

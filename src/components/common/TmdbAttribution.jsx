import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TmdbAttribution() {
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
        py: 0.8,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        mx: 'auto',
      }}
    >
      {/* Official TMDB Logo Badge */}
      <Box
        component="img"
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        alt="TMDB Logo"
        sx={{
          height: 16,
          width: 'auto',
          display: 'block',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.75)',
          fontSize: { xs: '0.75rem', sm: '0.82rem' },
          fontWeight: 500,
        }}
      >
        Powered by{' '}
        <Typography
          component="span"
          sx={{
            color: '#01b4e4', // Official TMDB cyan color
            fontWeight: 700,
          }}
        >
          TMDb API
        </Typography>
        {' • Live metadata & official cinema streams'}
      </Typography>
    </Box>
  );
}

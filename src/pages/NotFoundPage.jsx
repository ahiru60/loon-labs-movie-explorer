import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate } from 'react-router-dom';
import GlassButton from '../components/common/GlassButton';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 500 }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: '6rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 4 }}>
          The movie or page you are looking for does not exist or has been moved.
        </Typography>
        <GlassButton
          variant="primary"
          size="large"
          onClick={() => navigate('/')}
          startIcon={<HomeRoundedIcon />}
        >
          Back to Home
        </GlassButton>
      </Box>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { login } from '../features/auth/authSlice';
import GlassButton from '../components/common/GlassButton';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setFormError('Please enter a username or email address.');
      return;
    }
    if (!password.trim()) {
      setFormError('Please enter your password.');
      return;
    }

    dispatch(
      login({
        username: username.trim(),
        name: username.includes('@') ? username.split('@')[0] : username,
      })
    );
  };

  const handleDemoLogin = () => {
    dispatch(
      login({
        username: 'LoonLabs_Intern',
        name: 'Interview Evaluator',
        email: 'evaluator@loonlabs.com',
      })
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: { xs: 12, md: 8 },
        pb: 12,
        px: 2,
      }}
    >
      <Box
        className={isDark ? 'apple-glass-pill' : 'apple-glass-light'}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3.5, sm: 5 },
          borderRadius: 5,
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          }}
        >
          <LockOutlinedIcon sx={{ color: '#ffffff', fontSize: '1.8rem' }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          CineGlass Sign In
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
            mb: 3,
          }}
        >
          Access personalized recommendations and synced watchlists
        </Typography>

        {(formError || error) && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {formError || error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. adithya or intern@loonlabs.com"
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <PersonOutlineRoundedIcon
                    sx={{ color: '#818cf8', mr: 1, fontSize: '1.2rem' }}
                  />
                ),
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <LockOutlinedIcon
                    sx={{ color: '#818cf8', mr: 1, fontSize: '1.2rem' }}
                  />
                ),
              },
            }}
          />

          <GlassButton
            variant="primary"
            type="submit"
            fullWidth
            size="large"
            sx={{ py: 1.3, mb: 2.5 }}
          >
            Sign In
          </GlassButton>
        </Box>

        <Divider
          sx={{
            my: 2.5,
            color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            fontSize: '0.8rem',
          }}
        >
          EVALUATOR QUICK ACCESS
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleDemoLogin}
          startIcon={<AutoAwesomeRoundedIcon sx={{ color: '#ec4899' }} />}
          sx={{
            py: 1.2,
            borderRadius: 3,
            borderColor: 'rgba(99, 102, 241, 0.5)',
            color: isDark ? '#ffffff' : '#0f172a',
            backgroundColor: isDark
              ? 'rgba(99, 102, 241, 0.1)'
              : 'rgba(99, 102, 241, 0.05)',
            fontWeight: 700,
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
            },
          }}
        >
          1-Click Demo Login (Loon Labs)
        </Button>
      </Box>
    </Box>
  );
}

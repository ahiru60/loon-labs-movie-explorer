import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Alert,
  Divider,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginWithSupabase,
  signupWithSupabase,
  login,
  closeLoginModal,
  clearAuthMessages,
} from '../../features/auth/authSlice';
import { openSettingsModal } from '../../features/settings/settingsSlice';
import GlassButton from '../common/GlassButton';

export default function LoginModal() {
  const dispatch = useDispatch();
  const { isLoginModalOpen, error, successMessage, isLoading, isSupabaseConfigured } =
    useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [tabIndex, setTabIndex] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formError, setFormError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
    setFormError('');
    dispatch(clearAuthMessages());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    dispatch(clearAuthMessages());

    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setFormError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (tabIndex === 0) {
      // Sign In
      dispatch(
        loginWithSupabase({
          email: email.trim(),
          password: password.trim(),
        })
      );
    } else {
      // Sign Up
      dispatch(
        signupWithSupabase({
          email: email.trim(),
          password: password.trim(),
          displayName: displayName.trim(),
        })
      );
    }
  };

  const handleDemoLogin = () => {
    setFormError('');
    dispatch(clearAuthMessages());

    if (isSupabaseConfigured) {
      // Attempt login or fallback
      dispatch(
        loginWithSupabase({
          email: 'evaluator@cineglass.tv',
          password: 'Password123!',
        })
      );
    } else {
      // Instant local demo session
      dispatch(
        login({
          username: 'LoonLabs_Evaluator',
          name: 'Interview Candidate',
          email: 'candidate@loonlabs.com',
        })
      );
    }
  };

  const textFieldSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.04)',
      backdropFilter: 'blur(10px)',
      '& fieldset': {
        borderColor: isDark
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(0, 0, 0, 0.12)',
      },
      '&:hover fieldset': {
        borderColor: '#6366f1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },
    },
    '& .MuiInputLabel-root': {
      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    },
    '& input': {
      color: isDark ? '#ffffff' : '#0f172a',
    },
  };

  return (
    <Dialog
      open={isLoginModalOpen}
      onClose={() => dispatch(closeLoginModal())}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            backgroundColor: isDark
              ? 'rgba(16, 20, 29, 0.96)'
              : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
            }`,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            p: { xs: 2, sm: 3 },
            position: 'relative',
          },
        },
      }}
    >
      <IconButton
        onClick={() => dispatch(closeLoginModal())}
        sx={{
          position: 'absolute',
          top: 14,
          right: 14,
          color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          '&:hover': { color: isDark ? '#ffffff' : '#000000' },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <DialogContent sx={{ p: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            }}
          >
            <LockOutlinedIcon sx={{ color: '#ffffff', fontSize: '1.5rem' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {tabIndex === 0 ? 'Welcome to CineGlass' : 'Create an Account'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              mt: 0.5,
            }}
          >
            {tabIndex === 0
              ? 'Sign in to access your Watchlist and synced library'
              : 'Register to access your personal Watchlist and history'}
          </Typography>
        </Box>

        {/* Auth Mode Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', mb: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 40 }}
          >
            <Tab label="Sign In" sx={{ fontWeight: 700, textTransform: 'none', minHeight: 40 }} />
            <Tab label="Create Account" sx={{ fontWeight: 700, textTransform: 'none', minHeight: 40 }} />
          </Tabs>
        </Box>

        {/* Messages */}
        {(formError || error) && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {formError || error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {tabIndex === 1 && (
            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex"
              sx={textFieldSx}
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
          )}

          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@cineglass.tv"
            sx={textFieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <EmailOutlinedIcon
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
            sx={textFieldSx}
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
            disabled={isLoading}
            sx={{ py: 1.2, mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            ) : tabIndex === 0 ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </GlassButton>
        </Box>

        <Divider
          sx={{
            my: 2,
            color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            fontSize: '0.8rem',
          }}
        >
          QUICK EVALUATION
        </Divider>

        {/* 1-Click Demo Login */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleDemoLogin}
          disabled={isLoading}
          startIcon={<AutoAwesomeRoundedIcon sx={{ color: '#ec4899' }} />}
          sx={{
            py: 1.1,
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
          1-Click Evaluator Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}

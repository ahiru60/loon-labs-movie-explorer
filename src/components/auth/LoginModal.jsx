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
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useDispatch, useSelector } from 'react-redux';
import { login, closeLoginModal, setAuthError } from '../../features/auth/authSlice';
import GlassButton from '../common/GlassButton';

export default function LoginModal() {
  const dispatch = useDispatch();
  const { isLoginModalOpen, error } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setFormError('Please enter a username or email address.');
      return;
    }
    if (!password.trim()) {
      setFormError('Please enter a password.');
      return;
    }

    dispatch(
      login({
        username: username.trim(),
        name: username.includes('@') ? username.split('@')[0] : username,
      })
    );
    setUsername('');
    setPassword('');
    setFormError('');
  };

  const handleDemoLogin = () => {
    dispatch(
      login({
        username: 'LoonLabs_Intern',
        name: 'Interview Candidate',
        email: 'candidate@loonlabs.com',
      })
    );
    setUsername('');
    setPassword('');
    setFormError('');
  };

  const textFieldSx = {
    mb: 2.5,
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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
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
            <LockOutlinedIcon sx={{ color: '#ffffff', fontSize: '1.6rem' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Welcome to CineGlass
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              mt: 0.5,
            }}
          >
            Sign in to access your Watchlist & custom preferences
          </Typography>
        </Box>

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
            sx={{ py: 1.2, mb: 2 }}
          >
            Sign In
          </GlassButton>
        </Box>

        <Divider
          sx={{
            my: 2,
            color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            fontSize: '0.8rem',
          }}
        >
          OR FOR EVALUATORS
        </Divider>

        {/* 1-Click Demo Login Button for Evaluator Convenience */}
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
      </DialogContent>
    </Dialog>
  );
}

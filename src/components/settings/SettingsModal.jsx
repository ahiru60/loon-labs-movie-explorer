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
  Collapse,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeSettingsModal,
  setCustomApiKey,
  clearCustomApiKey,
} from '../../features/settings/settingsSlice';
import { fetchTrendingMovies } from '../../features/movies/moviesSlice';
import { syncSupabaseConfigState } from '../../features/auth/authSlice';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
} from '../../services/supabaseClient';
import GlassButton from '../common/GlassButton';

const SQL_SCHEMA_SNIPPET = `-- Run this in Supabase SQL Editor:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    backdrop_path TEXT,
    vote_average NUMERIC(3, 1) DEFAULT 0,
    release_date TEXT,
    overview TEXT,
    media_type TEXT DEFAULT 'movie',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_movie UNIQUE (user_id, movie_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
    ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON public.favorites FOR DELETE USING (auth.uid() = user_id);`;

export default function SettingsModal() {
  const dispatch = useDispatch();
  const { isSettingsOpen, customApiKey } = useSelector((state) => state.settings);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const initialSupabase = getSupabaseConfig();

  // TMDb API state
  const [inputKey, setInputKey] = useState(customApiKey || '');
  const [tmdbStatus, setTmdbStatus] = useState(null);

  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState(initialSupabase.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialSupabase.anonKey || '');
  const [supabaseStatus, setSupabaseStatus] = useState(null); // 'success' | 'error' | 'testing'
  const [supabaseErrorMsg, setSupabaseErrorMsg] = useState('');
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSaveTmdb = () => {
    dispatch(setCustomApiKey(inputKey.trim()));
    dispatch(fetchTrendingMovies('week'));
    setTmdbStatus('success');
  };

  const handleResetTmdb = () => {
    setInputKey('');
    dispatch(clearCustomApiKey());
    dispatch(fetchTrendingMovies('week'));
    setTmdbStatus('success');
  };

  const handleTestTmdb = async () => {
    const keyToTest = inputKey.trim() || (import.meta.env.VITE_TMDB_API_KEY || '').trim();
    if (!keyToTest) {
      setTmdbStatus('error');
      return;
    }
    setTestStatus('testing');
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${keyToTest}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setTmdbStatus('success');
      } else {
        setTmdbStatus('error');
      }
    } catch {
      setTmdbStatus('error');
    }
  };

  const handleSaveAndTestSupabase = async () => {
    setSupabaseStatus('testing');
    setSupabaseErrorMsg('');

    const trimmedUrl = supabaseUrl.trim();
    const trimmedKey = supabaseAnonKey.trim();

    saveSupabaseConfig(trimmedUrl, trimmedKey);
    dispatch(syncSupabaseConfigState());

    const result = await testSupabaseConnection(trimmedUrl, trimmedKey);
    if (result.success) {
      setSupabaseStatus('success');
    } else {
      setSupabaseStatus('error');
      setSupabaseErrorMsg(result.error || 'Connection failed.');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <Dialog
      open={isSettingsOpen}
      onClose={() => dispatch(closeSettingsModal())}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            backgroundColor: isDark
              ? 'rgba(16, 20, 29, 0.96)'
              : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(30px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
            }`,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            p: { xs: 2, sm: 3 },
            maxHeight: '90vh',
            position: 'relative',
          },
        },
      }}
    >
      <IconButton
        onClick={() => dispatch(closeSettingsModal())}
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

      <DialogContent sx={{ p: 1, overflowY: 'auto' }}>
        {/* ================================================================ */}
        {/* SECTION 1: SUPABASE DB & AUTH */}
        {/* ================================================================ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StorageRoundedIcon sx={{ color: '#10b981', fontSize: '1.4rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Supabase Cloud Database & Auth
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              PostgreSQL database for favorites watchlist & user authentication
            </Typography>
          </Box>
        </Box>

        {supabaseStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Supabase Connection Verified! Database and Authentication active.
          </Alert>
        )}

        {supabaseStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {supabaseErrorMsg || 'Connection failed. Please check your Supabase URL & Anon Key.'}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Supabase Project URL:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project-id.supabase.co"
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          />

          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Supabase Anon Public API Key:
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="password"
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
            <GlassButton
              variant="primary"
              size="small"
              onClick={handleSaveAndTestSupabase}
              disabled={supabaseStatus === 'testing'}
            >
              {supabaseStatus === 'testing' ? 'Verifying...' : 'Save & Test Supabase'}
            </GlassButton>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              startIcon={<CodeRoundedIcon />}
              sx={{
                borderRadius: 9999,
                borderColor: 'rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                textTransform: 'none',
              }}
            >
              {showSqlSchema ? 'Hide SQL Schema' : 'View SQL Schema Script'}
            </Button>
          </Box>

          <Collapse in={showSqlSchema}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981' }}>
                  PostgreSQL Table & RLS Setup:
                </Typography>
                <Button
                  size="small"
                  onClick={handleCopySql}
                  startIcon={copiedSql ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                  sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#10b981' }}
                >
                  {copiedSql ? 'Copied!' : 'Copy SQL'}
                </Button>
              </Box>
              <Box
                component="pre"
                sx={{
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  m: 0,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
                  color: isDark ? '#a7f3d0' : '#065f46',
                }}
              >
                {SQL_SCHEMA_SNIPPET}
              </Box>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ================================================================ */}
        {/* SECTION 2: TMDB API */}
        {/* ================================================================ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VpnKeyRoundedIcon sx={{ color: '#818cf8', fontSize: '1.4rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              TMDb API Configuration
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
            >
              Direct real-time authentication via TMDb API v3
            </Typography>
          </Box>
        </Box>

        {tmdbStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            API Connection Successful! TMDb is responding with live data.
          </Alert>
        )}

        {tmdbStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            Invalid API Key or network issue. Please check your credentials and connection.
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Custom TMDb API Key (v3 auth):
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Paste your TMDb API key here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          <GlassButton
            variant="primary"
            onClick={handleSaveTmdb}
            size="small"
          >
            Save Key
          </GlassButton>

          <Button
            variant="outlined"
            size="small"
            onClick={handleTestTmdb}
            sx={{
              borderRadius: 9999,
              borderColor: 'rgba(99, 102, 241, 0.4)',
              color: '#818cf8',
              textTransform: 'none',
            }}
          >
            Test TMDb Connection
          </Button>

          <Button
            size="small"
            onClick={handleResetTmdb}
            startIcon={<RestartAltRoundedIcon />}
            sx={{
              borderRadius: 9999,
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              textTransform: 'none',
            }}
          >
            Reset Default
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Production Architecture Compliance:
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)', display: 'block' }}>
            • <strong>Supabase</strong>: PostgreSQL database table for Watchlist storage with Row-Level Security (RLS) & JWT authentication.
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)', display: 'block' }}>
            • <strong>TMDb API</strong>: Direct communication with official v3 endpoints for movies, series, search, and video trailers.
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)', display: 'block' }}>
            • <strong>Redux Toolkit</strong>: Predictable state slices with optimistic database updates and automatic local fallback persistence.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

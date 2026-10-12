import React, { useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import { getAppTheme } from './theme/theme';
import { checkSupabaseSession } from './features/auth/authSlice';
import { supabaseOnAuthStateChange } from './services/supabaseClient';
import GlassNavbar from './components/common/GlassNavbar';
import MobileBottomNav from './components/common/MobileBottomNav';
import MovieDetailsModal from './components/movie/MovieDetailsModal';
import TrailerModal from './components/movie/TrailerModal';
import LoginModal from './components/auth/LoginModal';

import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  useEffect(() => {
    // Check initial session
    dispatch(checkSupabaseSession());

    // Listen for auth state transitions (sign in, sign out, token refresh)
    const unsubscribe = supabaseOnAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        dispatch(checkSupabaseSession());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          color: 'text.primary',
          position: 'relative',
        }}
      >
        {/* Top Floating Glass Capsule Navigation */}
        <GlassNavbar />

        {/* Route Views */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Mobile Bottom Dock Bar */}
        <MobileBottomNav />

        {/* Global Modals */}
        <MovieDetailsModal />
        <TrailerModal />
        <LoginModal />
      </Box>
    </ThemeProvider>
  );
}

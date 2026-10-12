import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import { getAppTheme } from './theme/theme';
import GlassNavbar from './components/common/GlassNavbar';
import MobileBottomNav from './components/common/MobileBottomNav';
import MovieDetailsModal from './components/movie/MovieDetailsModal';
import TrailerModal from './components/movie/TrailerModal';
import LoginModal from './components/auth/LoginModal';
import SettingsModal from './components/settings/SettingsModal';

import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = useMemo(() => getAppTheme(themeMode), [themeMode]);

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
        <SettingsModal />
      </Box>
    </ThemeProvider>
  );
}

import React from 'react';
import { Box, Typography, Container, Chip } from '@mui/material';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MovieGrid from '../components/movie/MovieGrid';
import GlassButton from '../components/common/GlassButton';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, isDbSyncing } = useSelector((state) => state.favorites);
  const { user, isAuthenticated, isSupabaseConfigured } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const isCloudSynced = isAuthenticated && isSupabaseConfigured && user?.isSupabase;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 14 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BookmarkRoundedIcon sx={{ color: '#6366f1', fontSize: '2.2rem' }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.6rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                My Watchlist
              </Typography>
            </Box>

            {/* Cloud Sync Status Badge */}
            {isCloudSynced ? (
              <Chip
                icon={<CloudDoneRoundedIcon sx={{ fontSize: '1.1rem !important', color: '#10b981 !important' }} />}
                label={isDbSyncing ? 'Syncing...' : 'Cloud Synced'}
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.12)',
                  color: '#34d399',
                  fontWeight: 600,
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              />
            ) : (
              <Chip
                icon={<StorageRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                label="Local Storage Library"
                size="small"
                sx={{
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.65)',
                }}
              />
            )}
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
            }}
          >
            {favorites.length} {favorites.length === 1 ? 'title' : 'titles'} saved
            {isCloudSynced ? ' and synced to your cloud library.' : ' to your library.'}
          </Typography>
        </Box>

        {/* List Grid or Empty State */}
        {favorites.length === 0 ? (
          <Box
            sx={{
              py: 12,
              textAlign: 'center',
              borderRadius: 5,
              backgroundColor: isDark
                ? 'rgba(18, 21, 30, 0.5)'
                : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${
                isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
              }`,
              px: 3,
            }}
          >
            <BookmarkRoundedIcon
              sx={{
                fontSize: '4.5rem',
                color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                mb: 2,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Your Watchlist is empty
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                maxWidth: 450,
                mx: 'auto',
                mb: 3.5,
              }}
            >
              Explore trending films and click the (+) button on any poster to save it here for later.
            </Typography>
            <GlassButton
              variant="primary"
              size="large"
              onClick={() => navigate('/movies')}
              startIcon={<ExploreRoundedIcon />}
            >
              Explore Trending Films
            </GlassButton>
          </Box>
        ) : (
          <MovieGrid
            movies={favorites}
            isLoading={false}
          />
        )}
      </Container>
    </Box>
  );
}

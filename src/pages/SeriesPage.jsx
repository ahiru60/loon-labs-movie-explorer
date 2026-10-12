import React, { useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import TvRoundedIcon from '@mui/icons-material/TvRounded';
import { useDispatch, useSelector } from 'react-redux';

import MovieGrid from '../components/movie/MovieGrid';
import { fetchTrendingSeries } from '../features/movies/moviesSlice';

export default function SeriesPage() {
  const dispatch = useDispatch();
  const { trendingSeries, isLoadingTrending } = useSelector((state) => state.movies);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (trendingSeries.length === 0) {
      dispatch(fetchTrendingSeries('week'));
    }
  }, [trendingSeries.length, dispatch]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 14 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <TvRoundedIcon sx={{ color: '#ec4899', fontSize: '2rem' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.6rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Trending Series
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
            }}
          >
            Binge-worthy shows, hit anime, and award-winning television series.
          </Typography>
        </Box>

        <MovieGrid
          movies={trendingSeries}
          isLoading={isLoadingTrending}
          emptyMessage="No TV series found."
        />
      </Container>
    </Box>
  );
}

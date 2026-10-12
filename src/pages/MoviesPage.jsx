import React, { useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded';
import { useDispatch, useSelector } from 'react-redux';

import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/search/FilterBar';
import MovieGrid from '../components/movie/MovieGrid';
import GlassButton from '../components/common/GlassButton';
import {
  discoverFilteredMovies,
  loadMoreFilteredMovies,
  setFilters,
} from '../features/movies/moviesSlice';

export default function MoviesPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const {
    filteredMovies,
    filters,
    filteredPage,
    filteredTotalPages,
    isLoadingFiltered,
    isLoadingMoreFiltered,
  } = useSelector((state) => state.movies);

  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    let initialFilters = { ...filters };
    if (filterParam === 'top_rated') {
      initialFilters = { ...initialFilters, sortBy: 'vote_average.desc', minRating: 7 };
      dispatch(setFilters(initialFilters));
    } else if (filterParam === 'now_playing') {
      initialFilters = { ...initialFilters, sortBy: 'primary_release_date.desc' };
      dispatch(setFilters(initialFilters));
    } else if (filterParam === 'popular') {
      initialFilters = { ...initialFilters, sortBy: 'popularity.desc' };
      dispatch(setFilters(initialFilters));
    }

    dispatch(discoverFilteredMovies(initialFilters));
  }, [dispatch, filterParam]);

  const handleLoadMore = () => {
    if (filteredPage < filteredTotalPages && !isLoadingMoreFiltered) {
      dispatch(
        loadMoreFilteredMovies({
          ...filters,
          page: filteredPage + 1,
        })
      );
    }
  };

  const hasMore = filteredPage < filteredTotalPages;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 14 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <MovieFilterRoundedIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.6rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Explore Movies
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
              maxWidth: 600,
            }}
          >
            Discover films filtered by genre, release year, minimum rating, and popularity.
          </Typography>
        </Box>

        {/* Filter Controls Bar */}
        <FilterBar />

        {/* Responsive Grid */}
        <MovieGrid
          movies={filteredMovies}
          isLoading={isLoadingFiltered}
          emptyMessage="No movies match your filter criteria. Try adjusting your selections."
        />

        {/* Load More Button */}
        {hasMore && filteredMovies.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <GlassButton
              variant="primary"
              size="large"
              onClick={handleLoadMore}
              disabled={isLoadingMoreFiltered}
              sx={{ minWidth: 200 }}
            >
              {isLoadingMoreFiltered ? (
                <CircularProgress size={24} sx={{ color: '#0f172a' }} />
              ) : (
                'Load More Movies'
              )}
            </GlassButton>
          </Box>
        )}
      </Container>
    </Box>
  );
}

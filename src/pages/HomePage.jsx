import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, LinearProgress, IconButton } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HeroBanner from '../components/hero/HeroBanner';
import MovieRow from '../components/movie/MovieRow';
import { HeroSkeleton, MovieRowSkeleton } from '../components/common/LoadingSkeleton';
import {
  fetchTrendingMovies,
  fetchTrendingSeries,
  openDetailModal,
  openTrailerModal,
} from '../features/movies/moviesSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    trendingMovies,
    trendingSeries,
    isLoadingTrending,
    trendingError,
  } = useSelector((state) => state.movies);

  const { continueWatching } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [movieTimeWindow, setMovieTimeWindow] = useState('week');
  const [seriesTimeWindow, setSeriesTimeWindow] = useState('week');

  useEffect(() => {
    dispatch(fetchTrendingMovies(movieTimeWindow));
    dispatch(fetchTrendingSeries(seriesTimeWindow));
  }, [dispatch, movieTimeWindow, seriesTimeWindow]);

  const handleMovieTimeChange = (e) => {
    setMovieTimeWindow(e.target.value);
    dispatch(fetchTrendingMovies(e.target.value));
  };

  const handleSeriesTimeChange = (e) => {
    setSeriesTimeWindow(e.target.value);
    dispatch(fetchTrendingSeries(e.target.value));
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pb: 12 }}>
      {/* Hero Section */}
      {isLoadingTrending && trendingMovies.length === 0 ? (
        <HeroSkeleton />
      ) : (
        <HeroBanner movies={trendingMovies} />
      )}

      {/* Continue Watching Section (Matches Image 3 bottom & Image 5 background) */}
      {continueWatching.length > 0 && (
        <Box sx={{ mt: 5, mb: 4, px: { xs: 2.5, sm: 4, md: 7 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.7rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Continue Watching
            </Typography>
            <Box
              onClick={() => navigate('/favorites')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.2s',
                '&:hover': { color: '#818cf8', transform: 'translateX(3px)' },
              }}
            >
              View All
              <ArrowForwardIosRoundedIcon sx={{ fontSize: '0.75rem' }} />
            </Box>
          </Box>

          <Box
            className="hide-scrollbar"
            sx={{
              display: 'flex',
              gap: 2.5,
              overflowX: 'auto',
              py: 1,
            }}
          >
            {continueWatching.map((item) => (
              <Box
                key={item.id}
                onClick={() => dispatch(openDetailModal(item))}
                className="apple-card-hover"
                sx={{
                  flex: { xs: '0 0 240px', sm: '0 0 300px' },
                  borderRadius: 4,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: isDark
                    ? 'rgba(18, 21, 30, 0.7)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${
                    isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
                  }`,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 150,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={
                      item.backdrop_path ||
                      item.poster_path ||
                      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8,
                      transition: 'opacity 0.2s',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <PlayCircleOutlineRoundedIcon
                      sx={{ color: '#ffffff', fontSize: '3rem' }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress || 60}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#6366f1',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 700 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? 'rgba(255, 255, 255, 0.5)'
                        : 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {item.seasonEpisode || 'Resume'} • {item.remainingTime || '45m left'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Trending Movies This Week Row (Matching Image 4) */}
      {isLoadingTrending && trendingMovies.length === 0 ? (
        <MovieRowSkeleton />
      ) : (
        <MovieRow
          title="Trending Movies"
          timeWindowToggle={
            <Select
              size="small"
              value={movieTimeWindow}
              onChange={handleMovieTimeChange}
              sx={{
                ml: 1,
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#818cf8',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: '#818cf8' },
              }}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="day">Today</MenuItem>
            </Select>
          }
          movies={trendingMovies}
          viewAllLink="/movies"
        />
      )}

      {/* Trending Series This Week Row (Matching Image 4) */}
      <MovieRow
        title="Trending Series"
        timeWindowToggle={
          <Select
            size="small"
            value={seriesTimeWindow}
            onChange={handleSeriesTimeChange}
            sx={{
              ml: 1,
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#818cf8',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-icon': { color: '#818cf8' },
            }}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="day">Today</MenuItem>
          </Select>
        }
        movies={trendingSeries}
        viewAllLink="/series"
      />
    </Box>
  );
}

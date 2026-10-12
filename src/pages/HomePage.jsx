import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HeroBanner from '../components/hero/HeroBanner';
import MovieRow from '../components/movie/MovieRow';
import { HeroSkeleton, MovieRowSkeleton } from '../components/common/LoadingSkeleton';
import {
  fetchTrendingMovies,
  fetchTrendingSeries,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchPopularMovies,
} from '../features/movies/moviesSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    trendingMovies,
    trendingSeries,
    nowPlayingMovies,
    topRatedMovies,
    popularMovies,
    isLoadingTrending,
  } = useSelector((state) => state.movies);

  const { favorites } = useSelector((state) => state.favorites);

  const [movieTimeWindow, setMovieTimeWindow] = useState('week');
  const [seriesTimeWindow, setSeriesTimeWindow] = useState('week');

  useEffect(() => {
    dispatch(fetchTrendingMovies(movieTimeWindow));
    dispatch(fetchTrendingSeries(seriesTimeWindow));
    dispatch(fetchNowPlayingMovies(1));
    dispatch(fetchTopRatedMovies(1));
    dispatch(fetchPopularMovies(1));
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
      {/* Featured Hero Carousel from Real TMDb Trending API */}
      {isLoadingTrending && trendingMovies.length === 0 ? (
        <HeroSkeleton />
      ) : (
        <HeroBanner movies={trendingMovies} />
      )}

      {/* User's Watchlist (Rendered dynamically if user saved real movies) */}
      {favorites.length > 0 && (
        <MovieRow
          title="My Watchlist"
          movies={favorites}
          viewAllLink="/favorites"
        />
      )}

      {/* 1. Trending Movies (TMDb /trending/movie/week or /day) */}
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

      {/* 2. Now Playing in Theaters (TMDb /movie/now_playing) */}
      {nowPlayingMovies.length > 0 && (
        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlayingMovies}
          viewAllLink="/movies?filter=now_playing"
        />
      )}

      {/* 3. Top Rated Movies (TMDb /movie/top_rated) */}
      {topRatedMovies.length > 0 && (
        <MovieRow
          title="Top Rated of All Time"
          movies={topRatedMovies}
          viewAllLink="/movies?filter=top_rated"
        />
      )}

      {/* 4. Popular Hits (TMDb /movie/popular) */}
      {popularMovies.length > 0 && (
        <MovieRow
          title="Popular Across the Globe"
          movies={popularMovies}
          viewAllLink="/movies?filter=popular"
        />
      )}

      {/* 5. Trending TV Series (TMDb /trending/tv/week or /day) */}
      {trendingSeries.length > 0 && (
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
      )}
    </Box>
  );
}

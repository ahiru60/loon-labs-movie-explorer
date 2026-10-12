import React, { useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilters,
  resetFilters,
  fetchGenres,
  discoverFilteredMovies,
} from '../../features/movies/moviesSlice';

export default function FilterBar({ onFilterChange }) {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const { genres, filters } = useSelector((state) => state.movies);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [genres.length, dispatch]);

  const handleGenreChange = (e) => {
    const newFilters = { ...filters, genreId: e.target.value };
    dispatch(setFilters({ genreId: e.target.value }));
    dispatch(discoverFilteredMovies(newFilters));
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleYearChange = (e) => {
    const newFilters = { ...filters, year: e.target.value };
    dispatch(setFilters({ year: e.target.value }));
    dispatch(discoverFilteredMovies(newFilters));
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleRatingChange = (e) => {
    const newFilters = { ...filters, minRating: e.target.value };
    dispatch(setFilters({ minRating: e.target.value }));
    dispatch(discoverFilteredMovies(newFilters));
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleSortChange = (e) => {
    const newFilters = { ...filters, sortBy: e.target.value };
    dispatch(setFilters({ sortBy: e.target.value }));
    dispatch(discoverFilteredMovies(newFilters));
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(
      discoverFilteredMovies({
        genreId: '',
        year: '',
        minRating: 0,
        sortBy: 'popularity.desc',
      })
    );
  };

  const yearsList = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  const selectStyle = {
    borderRadius: 3,
    backgroundColor: isDark
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(0, 0, 0, 0.04)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${
      isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
    }`,
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: '0.88rem',
    fontWeight: 600,
    '& .MuiSelect-icon': {
      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 2, sm: 2.5 },
        mb: 3.5,
        borderRadius: 4,
        backgroundColor: isDark
          ? 'rgba(18, 21, 30, 0.6)'
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${
          isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
        }`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <FilterAltRoundedIcon sx={{ color: '#818cf8', fontSize: '1.25rem' }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: isDark ? '#ffffff' : '#0f172a',
            fontSize: '0.95rem',
          }}
        >
          Filter & Sort Movies
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr) auto',
          },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Genre Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Genre
          </InputLabel>
          <Select
            value={filters.genreId || ''}
            label="Genre"
            onChange={handleGenreChange}
            sx={selectStyle}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Release Year */}
        <FormControl size="small" fullWidth>
          <InputLabel sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Release Year
          </InputLabel>
          <Select
            value={filters.year || ''}
            label="Release Year"
            onChange={handleYearChange}
            sx={selectStyle}
          >
            <MenuItem value="">Any Year</MenuItem>
            {yearsList.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Minimum Rating */}
        <FormControl size="small" fullWidth>
          <InputLabel sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Minimum Rating
          </InputLabel>
          <Select
            value={filters.minRating || 0}
            label="Minimum Rating"
            onChange={handleRatingChange}
            sx={selectStyle}
          >
            <MenuItem value={0}>All Ratings</MenuItem>
            <MenuItem value={8}>⭐ 8.0+ Exceptional</MenuItem>
            <MenuItem value={7}>⭐ 7.0+ Great</MenuItem>
            <MenuItem value={6}>⭐ 6.0+ Good</MenuItem>
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" fullWidth>
          <InputLabel sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Sort By
          </InputLabel>
          <Select
            value={filters.sortBy || 'popularity.desc'}
            label="Sort By"
            onChange={handleSortChange}
            sx={selectStyle}
          >
            <MenuItem value="popularity.desc">Most Popular</MenuItem>
            <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
            <MenuItem value="primary_release_date.desc">Newest Release</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          size="small"
          onClick={handleReset}
          startIcon={<RestartAltRoundedIcon />}
          sx={{
            height: 40,
            borderRadius: 3,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
            }`,
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}

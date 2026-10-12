import React, { useState, useEffect } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchQuery,
  searchMovies,
  clearSearch,
} from '../../features/movies/moviesSlice';

export default function SearchBar({ onSearchSubmit, autoFocus = false }) {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const { searchQuery, lastSearchQuery } = useSelector((state) => state.movies);
  const [inputValue, setInputValue] = useState(searchQuery || '');

  // Synchronize internal state if redux changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.trim()) {
        dispatch(setSearchQuery(inputValue));
        dispatch(searchMovies({ query: inputValue, page: 1 }));
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [inputValue, dispatch]);

  const handleClear = () => {
    setInputValue('');
    dispatch(clearSearch());
  };

  const handleLastSearchClick = (query) => {
    setInputValue(query);
    dispatch(setSearchQuery(query));
    dispatch(searchMovies({ query, page: 1 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(setSearchQuery(inputValue));
      dispatch(searchMovies({ query: inputValue, page: 1 }));
      if (onSearchSubmit) onSearchSubmit(inputValue);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto', mb: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className={isDark ? 'glass-pill' : 'glass-light'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: 0.8,
          borderRadius: 9999,
          width: '100%',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          border: `1.5px solid ${
            isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
          }`,
          '&:focus-within': {
            borderColor: '#6366f1',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.35)',
          },
        }}
      >
        <SearchRoundedIcon
          sx={{
            color: '#818cf8',
            fontSize: '1.5rem',
            mr: 1.5,
          }}
        />

        <InputBase
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search movies by title (e.g. Spider-Man, Avengers, Matchbox)..."
          autoFocus={autoFocus}
          sx={{
            color: isDark ? '#ffffff' : '#0f172a',
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            fontWeight: 500,
            '& input::placeholder': {
              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              opacity: 1,
            },
          }}
        />

        {inputValue && (
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              '&:hover': { color: isDark ? '#ffffff' : '#000000' },
            }}
          >
            <ClearRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Last Searched Movie persistence indicator (Assignment Requirement) */}
      {lastSearchQuery && lastSearchQuery !== inputValue && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1.5,
            px: 2,
            flexWrap: 'wrap',
          }}
        >
          <HistoryRoundedIcon
            sx={{
              fontSize: '1rem',
              color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.55)',
              fontWeight: 500,
            }}
          >
            Last searched:
          </Typography>
          <Chip
            size="small"
            label={lastSearchQuery}
            onClick={() => handleLastSearchClick(lastSearchQuery)}
            sx={{
              cursor: 'pointer',
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
              color: '#818cf8',
              fontWeight: 600,
              border: '1px solid rgba(129, 140, 248, 0.25)',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

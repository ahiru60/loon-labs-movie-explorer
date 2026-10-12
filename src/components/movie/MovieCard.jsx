import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../features/favorites/favoritesSlice';
import { openDetailModal } from '../../features/movies/moviesSlice';
import RatingBadge from '../common/RatingBadge';
import { getImageUrl, formatYear } from '../../utils/helpers';

export default function MovieCard({ movie, priority = false }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  if (!movie) return null;

  const isFavorited = favorites.some((item) => item.id === movie.id);
  const title = movie.title || movie.name || 'Untitled';
  const releaseYear = formatYear(movie.release_date || movie.first_air_date);
  const posterUrl = movie.poster_url || getImageUrl(movie.poster_path, 'poster');

  const handleCardClick = () => {
    dispatch(openDetailModal(movie));
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(movie));
  };

  return (
    <Box
      onClick={handleCardClick}
      className="glass-card-hover"
      sx={{
        position: 'relative',
        width: '100%',
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Poster Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2 / 3',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
          border: `1px solid ${
            isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
          }`,
          boxShadow: isDark
            ? '0 12px 28px rgba(0, 0, 0, 0.5)'
            : '0 8px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box
          component="img"
          src={posterUrl}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Top-Right Favorite/Watchlist (+) Button - Exactly like Image 4 */}
        <Tooltip title={isFavorited ? 'Remove from List' : 'Add to List'}>
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 34,
              height: 34,
              backgroundColor: isFavorited
                ? 'rgba(99, 102, 241, 0.9)'
                : 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                backgroundColor: isFavorited ? '#4f46e5' : 'rgba(0, 0, 0, 0.85)',
                transform: 'scale(1.15)',
              },
            }}
          >
            {isFavorited ? (
              <CheckRoundedIcon sx={{ fontSize: '1.15rem' }} />
            ) : (
              <AddRoundedIcon sx={{ fontSize: '1.15rem' }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Top-Left Rating Badge */}
        {movie.vote_average > 0 && (
          <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
            <RatingBadge rating={movie.vote_average} size="small" />
          </Box>
        )}

        {/* Subtle Bottom Poster Gradient for contrast */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Title & Metadata beneath poster */}
      <Box sx={{ pt: 1.2, px: 0.5 }}>
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: '0.92rem',
            color: isDark ? '#ffffff' : '#0f172a',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 0.3,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontWeight: 500,
            }}
          >
            {releaseYear}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#818cf8',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.68rem',
            }}
          >
            {movie.media_type === 'tv' ? 'Series' : 'Movie'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

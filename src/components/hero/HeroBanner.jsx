import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useDispatch, useSelector } from 'react-redux';

import {
  openDetailModal,
  openTrailerModal,
} from '../../features/movies/moviesSlice';
import { toggleFavorite } from '../../features/favorites/favoritesSlice';
import RatingBadge from '../common/RatingBadge';
import GlassButton from '../common/GlassButton';
import { tmdbApi } from '../../api/tmdbApi';
import {
  getImageUrl,
  formatYear,
  formatRuntime,
  truncateText,
} from '../../utils/helpers';

export default function HeroBanner({ movies = [] }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);

  // Take the top 5 trending movies for the hero carousel
  const heroMovies = movies.slice(0, 5);

  // Auto-advance hero carousel every 8 seconds
  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null;

  const currentMovie = heroMovies[currentIndex] || heroMovies[0];
  const isFavorited = favorites.some((item) => item.id === currentMovie.id);
  const title = currentMovie.title || currentMovie.name || 'Featured Movie';
  const backdropUrl =
    currentMovie.backdrop_path?.startsWith('http')
      ? currentMovie.backdrop_path
      : getImageUrl(currentMovie.backdrop_path, 'original');
  const releaseYear = formatYear(currentMovie.release_date || currentMovie.first_air_date);
  const runtime = currentMovie.runtime
    ? formatRuntime(currentMovie.runtime)
    : '2h 7m';

  const handlePlay = async () => {
    try {
      const details = await tmdbApi.getMovieDetails(currentMovie.id);
      const trailer =
        details.videos?.results?.find(
          (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
        ) || details.videos?.results?.[0];

      if (trailer?.key) {
        dispatch(openTrailerModal({ trailerKey: trailer.key, title }));
      } else {
        dispatch(openDetailModal(currentMovie));
      }
    } catch {
      dispatch(openDetailModal(currentMovie));
    }
  };

  const handleDetails = () => {
    dispatch(openDetailModal(currentMovie));
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(currentMovie));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '80vh', sm: '85vh', md: '92vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        pb: { xs: 4, md: 5 },
      }}
    >
      {/* Cinematic Full-Bleed Backdrop Image */}
      <Box
        component="img"
        key={currentMovie.id}
        src={backdropUrl}
        alt={title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80';
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 25%',
          transform: 'scale(1.02)',
          transition: 'opacity 1s ease-in-out, transform 8s ease-out',
          zIndex: 1,
        }}
      />

      {/* Multi-Stop Cinematic Vignette / Gradients */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: `
            linear-gradient(to right, ${
              isDark ? 'rgba(7, 8, 12, 0.95)' : 'rgba(245, 247, 251, 0.95)'
            } 0%, ${
            isDark ? 'rgba(7, 8, 12, 0.7)' : 'rgba(245, 247, 251, 0.7)'
          } 40%, transparent 80%),
            linear-gradient(to top, ${
              isDark ? '#07080c' : '#f5f7fb'
            } 0%, ${
            isDark ? 'rgba(7, 8, 12, 0.85)' : 'rgba(245, 247, 251, 0.85)'
          } 20%, transparent 60%),
            linear-gradient(to bottom, ${
              isDark ? 'rgba(7, 8, 12, 0.7)' : 'rgba(245, 247, 251, 0.7)'
            } 0%, transparent 25%)
          `,
        }}
      />

      {/* Hero Content Information */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          px: { xs: 2.5, sm: 4, md: 7 },
          maxWidth: { xs: '100%', md: 800 },
          mb: 4,
        }}
      >
        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.8rem' },
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            mb: 2,
            color: isDark ? '#ffffff' : '#0f172a',
            textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
          }}
        >
          {title}
        </Typography>

        {/* Badges Row (⭐ Rating, 📅 Year, ⏱️ Runtime) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 2.5,
          }}
        >
          {currentMovie.vote_average > 0 && (
            <RatingBadge rating={currentMovie.vote_average} />
          )}

          {/* Year Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.6,
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 9999,
              px: 1.4,
              py: 0.5,
            }}
          >
            <CalendarTodayRoundedIcon sx={{ fontSize: '0.95rem', color: '#818cf8' }} />
            <Typography
              variant="caption"
              sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.82rem' }}
            >
              {releaseYear}
            </Typography>
          </Box>

          {/* Runtime Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.6,
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 9999,
              px: 1.4,
              py: 0.5,
            }}
          >
            <AccessTimeRoundedIcon sx={{ fontSize: '0.95rem', color: '#818cf8' }} />
            <Typography
              variant="caption"
              sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.82rem' }}
            >
              {runtime}
            </Typography>
          </Box>
        </Box>

        {/* Synopsis Paragraph */}
        <Typography
          variant="body1"
          sx={{
            color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)',
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            lineHeight: 1.6,
            maxWidth: 620,
            mb: 3.5,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
          }}
        >
          {truncateText(currentMovie.overview, 180)}
        </Typography>

        {/* Action Buttons: ▶ Play, (i) Details, (+) Watchlist (Matching Image 3) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {/* ▶ Watch Trailer Button */}
          <GlassButton
            variant="primary"
            onClick={handlePlay}
            startIcon={<PlayArrowRoundedIcon sx={{ fontSize: '1.4rem' }} />}
            sx={{ px: 3, py: 1 }}
          >
            Watch Trailer
          </GlassButton>

          {/* (i) Details Button */}
          <GlassButton
            variant="circle"
            onClick={handleDetails}
            title="View Details"
          >
            <InfoOutlinedIcon sx={{ fontSize: '1.3rem' }} />
          </GlassButton>

          {/* (+) Watchlist Button */}
          <GlassButton
            variant="circle"
            onClick={handleToggleFavorite}
            title={isFavorited ? 'Remove from My List' : 'Add to My List'}
            sx={{
              backgroundColor: isFavorited
                ? 'rgba(99, 102, 241, 0.8)'
                : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {isFavorited ? (
              <CheckRoundedIcon sx={{ fontSize: '1.3rem' }} />
            ) : (
              <AddRoundedIcon sx={{ fontSize: '1.3rem' }} />
            )}
          </GlassButton>
        </Box>
      </Box>

      {/* Carousel Pagination Dots */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          zIndex: 5,
          mb: 3,
        }}
      >
        {heroMovies.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            sx={{
              height: 6,
              width: currentIndex === idx ? 28 : 6,
              borderRadius: 9999,
              backgroundColor:
                currentIndex === idx
                  ? '#ffffff'
                  : 'rgba(255, 255, 255, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#ffffff',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

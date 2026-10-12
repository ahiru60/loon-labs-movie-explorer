import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  closeDetailModal,
  openTrailerModal,
} from '../../features/movies/moviesSlice';
import { toggleFavorite } from '../../features/favorites/favoritesSlice';
import { tmdbApi } from '../../api/tmdbApi';
import {
  getImageUrl,
  formatYear,
  formatRuntime,
  formatRating,
} from '../../utils/helpers';
import GlassButton from '../common/GlassButton';

export default function MovieDetailsModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isDetailModalOpen, selectedMovie } = useSelector((state) => state.movies);
  const favorites = useSelector((state) => state.favorites.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDetailModalOpen && selectedMovie) {
      let isMounted = true;
      setLoading(true);

      const mediaType =
        selectedMovie.media_type || (selectedMovie.name ? 'tv' : 'movie');

      tmdbApi
        .getMovieDetails(selectedMovie.id, mediaType)
        .then((data) => {
          if (isMounted) {
            setMovieDetails(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setMovieDetails(selectedMovie);
            setLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      setMovieDetails(null);
    }
  }, [isDetailModalOpen, selectedMovie]);

  if (!selectedMovie) return null;

  const current = movieDetails || selectedMovie;
  const isFavorited = favorites.some((item) => item.id === current.id);
  const title = current.title || current.name || 'Untitled';
  const backdropUrl =
    current.backdrop_path?.startsWith('http')
      ? current.backdrop_path
      : getImageUrl(current.backdrop_path, 'backdrop');
  const releaseYear = formatYear(current.release_date || current.first_air_date);
  const runtimeStr = current.runtime
    ? formatRuntime(current.runtime)
    : current.episode_run_time?.[0]
    ? `${current.episode_run_time[0]}m`
    : current.number_of_seasons
    ? `${current.number_of_seasons} Season${current.number_of_seasons > 1 ? 's' : ''}`
    : 'Series';

  // Extract real trailer key from TMDb videos
  const trailerVideo = current.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  ) || current.videos?.results?.find((v) => v.site === 'YouTube');
  const trailerKey = trailerVideo?.key || null;

  // Extract official certification from TMDb release_dates or TV content_ratings
  const usMovieRelease = current.release_dates?.results?.find(
    (r) => r.iso_3166_1 === 'US'
  );
  const usTvRating = current.content_ratings?.results?.find(
    (r) => r.iso_3166_1 === 'US'
  );
  const certification =
    usMovieRelease?.release_dates?.find((d) => d.certification?.trim())?.certification ||
    usTvRating?.rating ||
    current.certification ||
    (current.adult ? '18+' : 'TV-14');

  const genres = current.genres || [];
  const cast = current.credits?.cast?.slice(0, 10) || [];

  const handlePlayTrailer = () => {
    if (trailerKey) {
      dispatch(
        openTrailerModal({
          trailerKey,
          title,
        })
      );
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(current));
  };

  const handleOpenDedicatedPage = () => {
    dispatch(closeDetailModal());
    navigate(`/movie/${current.id}`);
  };

  return (
    <Dialog
      open={isDetailModalOpen}
      onClose={() => dispatch(closeDetailModal())}
      maxWidth="md"
      fullWidth
      scroll="paper"
      sx={{
        '& .MuiDialog-container': {
          alignItems: { xs: 'flex-end', sm: 'center' },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '24px 24px 0 0', sm: '24px' },
            backgroundColor: isDark
              ? 'rgba(13, 16, 24, 0.96)'
              : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(35px)',
            WebkitBackdropFilter: 'blur(35px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
            }`,
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
            m: { xs: 0, sm: 2 },
            position: 'relative',
            maxHeight: { xs: '90vh', sm: '88vh' },
            height: { xs: '90vh', sm: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Top Grab Handle indicator */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: 1.5,
          pb: 0.5,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 4.5,
            borderRadius: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(10px)',
          }}
        />
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={() => dispatch(closeDetailModal())}
        sx={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 25,
          width: 36,
          height: 36,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            transform: 'scale(1.1)',
          },
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      <DialogContent
        sx={{
          p: 0,
          flex: '1 1 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          /* Sleek visible scrollbar when content cuts out / overflows */
          scrollbarWidth: 'thin',
          scrollbarColor: isDark
            ? 'rgba(255, 255, 255, 0.28) rgba(255, 255, 255, 0.04)'
            : 'rgba(0, 0, 0, 0.28) rgba(0, 0, 0, 0.04)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            borderRadius: '9999px',
            margin: '8px 0',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.28)',
            borderRadius: '9999px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            transition: 'background 0.2s',
            '&:hover': {
              background: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      >
        {/* Backdrop Banner Header with Gradient */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 240, sm: 330, md: 380 },
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={backdropUrl}
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1280&q=80';
            }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Cinematic Multi-Stop Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                to top,
                ${isDark ? 'rgba(13, 16, 24, 1)' : 'rgba(255, 255, 255, 1)'} 0%,
                ${isDark ? 'rgba(13, 16, 24, 0.85)' : 'rgba(255, 255, 255, 0.85)'} 25%,
                transparent 70%
              )`,
            }}
          />

          {/* Title and Category Overlay at bottom of Backdrop (Exact Image 5 layout) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: { xs: 20, sm: 32 },
              right: { xs: 20, sm: 32 },
              zIndex: 10,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.8rem', sm: '2.6rem', md: '3.2rem' },
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: isDark ? '#ffffff' : '#0f172a',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
              }}
            >
              {title}
            </Typography>

            {genres.length > 0 && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#818cf8',
                  fontWeight: 600,
                  mt: 0.5,
                  fontSize: { xs: '0.9rem', sm: '1.05rem' },
                }}
              >
                {genres.map((g) => g.name).join(' • ')}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Content Body */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 4, pt: 1 }}>
          {/* Metadata Badges Row (IMDb, TMDb, Year, Duration, Certification) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 3,
            }}
          >
            {/* IMDb / TMDb Score */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: '#f5c518',
                color: '#000000',
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                fontWeight: 800,
                fontSize: '0.82rem',
              }}
            >
              IMDb {formatRating(current.vote_average)}/10
            </Box>

            {/* Rotten Tomatoes / TMDb percentage */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              🍅 {Math.round(current.vote_average * 10)}%
            </Box>

            {/* Year */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              }}
            >
              {releaseYear}
            </Typography>

            <Typography sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</Typography>

            {/* Runtime */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              }}
            >
              {runtimeStr}
            </Typography>

            <Typography sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</Typography>

            {/* Certification Badge */}
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: 1,
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                }`,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#000000',
              }}
            >
              {current.certification || (current.adult ? 'R' : 'PG-13')}
            </Box>
          </Box>

          {/* Action Buttons Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3.5,
            }}
          >
            {/* Play Trailer Button */}
            <GlassButton
              variant="primary"
              size="large"
              onClick={handlePlayTrailer}
              disabled={!trailerKey}
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: '1.5rem' }} />}
              sx={{
                opacity: !trailerKey ? 0.5 : 1,
              }}
            >
              {trailerKey ? 'Watch Trailer' : 'Trailer Unavailable'}
            </GlassButton>

            {/* Add to List Button */}
            <GlassButton
              variant="glass"
              size="large"
              onClick={handleToggleFavorite}
              startIcon={
                isFavorited ? (
                  <CheckRoundedIcon sx={{ color: '#6366f1' }} />
                ) : (
                  <AddRoundedIcon />
                )
              }
            >
              {isFavorited ? 'In My List' : 'Add to Watchlist'}
            </GlassButton>

            {/* Dedicated Details Page Link */}
            <IconButton
              onClick={handleOpenDedicatedPage}
              sx={{
                width: 44,
                height: 44,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.08)',
                },
              }}
              title="Open full page view"
            >
              <OpenInNewRoundedIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Box>

          {/* Overview / Synopsis */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                mb: 1,
                color: isDark ? '#ffffff' : '#0f172a',
              }}
            >
              Synopsis
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                lineHeight: 1.7,
                fontSize: '0.98rem',
              }}
            >
              {current.overview ||
                'No synopsis available for this title. Check back later for official studio updates.'}
            </Typography>
          </Box>

          {/* Cast Section */}
          {cast.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2,
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
              >
                Top Billed Cast
              </Typography>
              <Box
                className="hide-scrollbar"
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  pb: 1,
                }}
              >
                {cast.map((actor) => (
                  <Box
                    key={actor.id}
                    sx={{
                      minWidth: 105,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      src={getImageUrl(actor.profile_path, 'profile')}
                      alt={actor.name}
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 1,
                        border: '2px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? '#ffffff' : '#0f172a',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {actor.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? 'rgba(255, 255, 255, 0.5)'
                          : 'rgba(0, 0, 0, 0.5)',
                        fontSize: '0.7rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {actor.character}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

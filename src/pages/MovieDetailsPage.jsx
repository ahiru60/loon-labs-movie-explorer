import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { openTrailerModal } from '../features/movies/moviesSlice';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { tmdbApi } from '../api/tmdbApi';
import GlassButton from '../components/common/GlassButton';
import MovieCard from '../components/movie/MovieCard';
import {
  getImageUrl,
  formatYear,
  formatRuntime,
  formatRating,
} from '../utils/helpers';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const favorites = useSelector((state) => state.favorites.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    tmdbApi
      .getMovieDetails(id)
      .then((data) => {
        if (isMounted) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={48} sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ minHeight: '100vh', pt: 20, textAlign: 'center' }}>
        <Typography variant="h5">Movie not found</Typography>
        <GlassButton onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Return to Home
        </GlassButton>
      </Box>
    );
  }

  const isFavorited = favorites.some((item) => item.id === movie.id);
  const title = movie.title || movie.name || 'Untitled';
  const backdropUrl =
    movie.backdrop_path?.startsWith('http')
      ? movie.backdrop_path
      : getImageUrl(movie.backdrop_path, 'original');
  const runtimeStr = movie.runtime
    ? formatRuntime(movie.runtime)
    : movie.episode_run_time?.[0]
    ? `${movie.episode_run_time[0]}m`
    : movie.number_of_seasons
    ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? 's' : ''}`
    : 'Series';

  const trailerVideo = movie.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  ) || movie.videos?.results?.find((v) => v.site === 'YouTube');
  const trailerKey = trailerVideo?.key || null;

  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const similar = movie.similar?.results?.slice(0, 6) || [];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pb: 14 }}>
      {/* Back button */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 1200,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
        }}
      >
        <ArrowBackRoundedIcon />
      </IconButton>

      {/* Cinematic Hero Backdrop Header */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '60vh', md: '75vh' },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={backdropUrl}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to top, ${
                isDark ? '#07080c' : '#f5f7fb'
              } 0%, ${
              isDark ? 'rgba(7, 8, 12, 0.8)' : 'rgba(245, 247, 251, 0.8)'
            } 30%, transparent 80%)
            `,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: { xs: 24, sm: 40, md: 80 },
            right: { xs: 24, sm: 40, md: 80 },
            zIndex: 10,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.4rem' },
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                bgcolor: '#f5c518',
                color: '#000',
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                fontWeight: 800,
                fontSize: '0.85rem',
              }}
            >
              IMDb {formatRating(movie.vote_average)}/10
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {releaseYear}
            </Typography>
            <Typography sx={{ opacity: 0.4 }}>•</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {runtimeStr}
            </Typography>
            <Typography sx={{ opacity: 0.4 }}>•</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#818cf8' }}>
              {movie.genres?.map((g) => g.name).join(', ')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <GlassButton
              variant="primary"
              size="large"
              disabled={!trailerKey}
              onClick={() => {
                if (trailerKey) {
                  dispatch(openTrailerModal({ trailerKey, title }));
                }
              }}
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: '1.5rem' }} />}
              sx={{
                opacity: !trailerKey ? 0.5 : 1,
              }}
            >
              {trailerKey ? 'Watch Trailer' : 'Trailer Unavailable'}
            </GlassButton>

            <GlassButton
              variant="glass"
              size="large"
              onClick={() => dispatch(toggleFavorite(movie))}
              startIcon={
                isFavorited ? (
                  <CheckRoundedIcon sx={{ color: '#6366f1' }} />
                ) : (
                  <AddRoundedIcon />
                )
              }
            >
              {isFavorited ? 'In Watchlist' : 'Add to Watchlist'}
            </GlassButton>
          </Box>
        </Box>
      </Box>

      {/* Main Details Body */}
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 8 }, mt: 4 }}>
        <Box sx={{ maxWidth: 850, mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
            Overview
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
            }}
          >
            {movie.overview || 'No synopsis available.'}
          </Typography>
        </Box>

        {/* Cast Section */}
        {cast.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
              Cast & Characters
            </Typography>
            <Box
              className="hide-scrollbar"
              sx={{
                display: 'flex',
                gap: 2.5,
                overflowX: 'auto',
                pb: 2,
              }}
            >
              {cast.map((actor) => (
                <Box
                  key={actor.id}
                  sx={{
                    minWidth: 120,
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
                      width: 80,
                      height: 80,
                      mb: 1.5,
                      border: '2px solid rgba(255, 255, 255, 0.15)',
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 700, width: '100%' }}
                  >
                    {actor.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      width: '100%',
                    }}
                  >
                    {actor.character}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Similar Titles */}
        {similar.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
              Similar Recommendations
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(6, 1fr)',
                },
                gap: 2.5,
              }}
            >
              {similar.map((simMovie) => (
                <MovieCard key={simMovie.id} movie={simMovie} />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

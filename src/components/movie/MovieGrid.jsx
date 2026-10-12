import React from 'react';
import { Box, Typography } from '@mui/material';
import MovieCard from './MovieCard';
import { MovieCardSkeleton } from '../common/LoadingSkeleton';

export default function MovieGrid({
  movies = [],
  isLoading = false,
  emptyMessage = 'No movies found.',
}) {
  if (isLoading && movies.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
            xl: 'repeat(6, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          width: '100%',
        }}
      >
        {Array.from({ length: 12 }).map((_, idx) => (
          <MovieCardSkeleton key={idx} />
        ))}
      </Box>
    );
  }

  if (!isLoading && movies.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 500,
          }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(6, 1fr)',
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
        width: '100%',
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  );
}

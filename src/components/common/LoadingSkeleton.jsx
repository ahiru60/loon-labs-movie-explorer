import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

export function MovieCardSkeleton() {
  return (
    <Box sx={{ width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <Skeleton
        variant="rounded"
        width="100%"
        sx={{
          aspectRatio: '2 / 3',
          borderRadius: '16px',
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        }}
        animation="wave"
      />
      <Box sx={{ pt: 1.5 }}>
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={18}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
        />
      </Box>
    </Box>
  );
}

export function MovieRowSkeleton() {
  return (
    <Box sx={{ my: 4, px: { xs: 2, md: 6 } }}>
      <Skeleton
        variant="text"
        width={240}
        height={36}
        sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.08)' }}
      />
      <Box sx={{ display: 'flex', gap: 2.5, overflow: 'hidden' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Box key={i} sx={{ minWidth: { xs: 150, sm: 190, md: 220 } }}>
            <MovieCardSkeleton />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function HeroSkeleton() {
  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: '65vh', md: '82vh' },
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        p: { xs: 3, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 650, width: '100%' }}>
        <Skeleton
          variant="rounded"
          width="70%"
          height={60}
          sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.08)' }}
        />
        <Skeleton
          variant="rounded"
          width="40%"
          height={30}
          sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.06)' }}
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height={80}
          sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton
            variant="rounded"
            width={130}
            height={46}
            sx={{ borderRadius: 9999, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Skeleton
            variant="circular"
            width={46}
            height={46}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Box>
      </Box>
    </Box>
  );
}

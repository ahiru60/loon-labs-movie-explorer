import React from 'react';
import { Dialog, DialogContent, Box, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from 'react-redux';
import { closeTrailerModal } from '../../features/movies/moviesSlice';

export default function TrailerModal() {
  const dispatch = useDispatch();
  const { isTrailerModalOpen, activeTrailerKey, activeTrailerTitle } = useSelector(
    (state) => state.movies
  );

  if (!isTrailerModalOpen || !activeTrailerKey) return null;

  return (
    <Dialog
      open={isTrailerModalOpen}
      onClose={() => dispatch(closeTrailerModal())}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#000000',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        },
      }}
    >
      {/* Header bar with Title & Close button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.8,
          backgroundColor: 'rgba(15, 18, 25, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          variant="subtitle1"
          noWrap
          sx={{
            fontWeight: 700,
            color: '#ffffff',
            maxWidth: '80%',
          }}
        >
          {activeTrailerTitle || 'Movie Trailer'}
        </Typography>

        <IconButton
          onClick={() => dispatch(closeTrailerModal())}
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Responsive 16:9 YouTube Embed */}
      <DialogContent sx={{ p: 0, backgroundColor: '#000000' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
          }}
        >
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={activeTrailerTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

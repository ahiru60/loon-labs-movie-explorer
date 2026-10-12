import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

export default function MovieRow({
  title,
  subtitle,
  movies = [],
  viewAllLink,
  onTitleClick,
  timeWindowToggle,
}) {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <Box sx={{ my: 4.5, position: 'relative' }}>
      {/* Row Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, sm: 4, md: 7 },
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.7rem' },
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {title}
            {timeWindowToggle}
          </Typography>
        </Box>

        {viewAllLink && (
          <Box
            onClick={() => navigate(viewAllLink)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.88rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': {
                color: '#818cf8',
                transform: 'translateX(3px)',
              },
            }}
          >
            View All
            <ArrowForwardIosRoundedIcon sx={{ fontSize: '0.75rem' }} />
          </Box>
        )}
      </Box>

      {/* Horizontal Carousel Container with Glass Chevron Arrows */}
      <Box sx={{ position: 'relative', px: { xs: 2.5, sm: 4, md: 7 } }}>
        {/* Left Arrow Button */}
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            left: 20,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 44,
            height: 44,
            backgroundColor: 'rgba(15, 18, 26, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.85)',
              transform: 'translateY(-50%) scale(1.12)',
            },
          }}
        >
          <ChevronLeftRoundedIcon sx={{ fontSize: '2rem' }} />
        </IconButton>

        {/* Scrollable Container */}
        <Box
          ref={rowRef}
          className="hide-scrollbar"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 2, sm: 2.5, md: 3 },
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            py: 1.5,
            px: 0.5,
            '& > *': {
              scrollSnapAlign: 'start',
              flex: {
                xs: '0 0 150px',
                sm: '0 0 185px',
                md: '0 0 215px',
                lg: '0 0 225px',
              },
              width: {
                xs: '150px',
                sm: '185px',
                md: '215px',
                lg: '225px',
              },
              minWidth: {
                xs: '150px',
                sm: '185px',
                md: '215px',
                lg: '225px',
              },
              maxWidth: {
                xs: '150px',
                sm: '185px',
                md: '215px',
                lg: '225px',
              },
              boxSizing: 'border-box',
            },
          }}
        >
          {movies.map((movie) => (
            <Box key={movie.id} sx={{ minWidth: 0, width: '100%', overflow: 'hidden' }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
        </Box>

        {/* Right Arrow Button */}
        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            right: 20,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 44,
            height: 44,
            backgroundColor: 'rgba(15, 18, 26, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.85)',
              transform: 'translateY(-50%) scale(1.12)',
            },
          }}
        >
          <ChevronRightRoundedIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
}

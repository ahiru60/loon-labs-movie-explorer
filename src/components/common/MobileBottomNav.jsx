import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { openLoginModal } from '../../features/auth/authSlice';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';
  const favorites = useSelector((state) => state.favorites.favorites);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const items = [
    { label: 'Home', path: '/', icon: HomeRoundedIcon },
    { label: 'Movies', path: '/movies', icon: MovieFilterRoundedIcon },
    { label: 'Search', path: '/search', icon: SearchRoundedIcon },
    { label: 'My List', path: '/favorites', icon: BookmarkRoundedIcon, badge: favorites.length },
    {
      label: 'Account',
      path: isAuthenticated ? '/profile' : null,
      icon: PersonRoundedIcon,
      onClick: () => {
        if (!isAuthenticated) dispatch(openLoginModal());
        else navigate('/favorites');
      },
    },
  ];

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1100,
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Box
        className={isDark ? 'apple-glass-pill' : 'apple-glass-light'}
        sx={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 1,
          px: 1.5,
          borderRadius: 9999,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        }}
      >
        {items.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          const Icon = item.icon;

          const content = (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.3,
                cursor: 'pointer',
                color: isActive
                  ? '#6366f1'
                  : isDark
                  ? 'rgba(255, 255, 255, 0.6)'
                  : 'rgba(15, 23, 42, 0.6)',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: isDark ? '#ffffff' : '#000000',
                },
              }}
            >
              {item.badge > 0 ? (
                <Badge
                  badgeContent={item.badge}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.65rem',
                      height: 16,
                      minWidth: 16,
                      backgroundColor: '#6366f1',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: '1.4rem' }} />
                </Badge>
              ) : (
                <Icon sx={{ fontSize: '1.4rem' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.68rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.01em',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );

          if (item.onClick) {
            return (
              <Box key={item.label} onClick={item.onClick}>
                {content}
              </Box>
            );
          }

          return (
            <Box
              key={item.label}
              component={NavLink}
              to={item.path}
              sx={{ textDecoration: 'none' }}
            >
              {content}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

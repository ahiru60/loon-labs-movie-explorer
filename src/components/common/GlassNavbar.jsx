import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import { toggleTheme } from '../../features/theme/themeSlice';
import { openLoginModal, logout } from '../../features/auth/authSlice';
import {
  openSettingsModal,
  toggleNotifications,
  markAllNotificationsRead,
} from '../../features/settings/settingsSlice';

export default function GlassNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.favorites);
  const { notifications, isNotificationsOpen } = useSelector((state) => state.settings);

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenNotifMenu = (event) => {
    setNotifAnchor(event.currentTarget);
    dispatch(markAllNotificationsRead());
  };
  const handleCloseNotifMenu = () => {
    setNotifAnchor(null);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Series', path: '/series' },
    { label: 'Discover', path: '/movies?filter=popular' },
    { label: 'List', path: '/favorites', badge: favorites.length },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 12, md: 24 },
        left: 0,
        right: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        pointerEvents: 'none', // Allow clicking through outside the pill
      }}
    >
      <Box
        className={isDark ? 'glass-pill' : 'glass-light'}
        sx={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          px: { xs: 2, sm: 3, md: 3.5 },
          py: { xs: 0.8, md: 1 },
          borderRadius: 9999,
          maxWidth: 920,
          width: 'auto',
        }}
      >
        {/* Logo / Rocket Icon */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            mr: { xs: 0.5, md: 1.5 },
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.08)' },
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <RocketLaunchRoundedIcon sx={{ color: '#ffffff', fontSize: '1.15rem' }} />
          </Box>
          <Typography
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: isDark ? 'transparent' : 'inherit',
            }}
          >
            CineGlass
          </Typography>
        </Box>

        {/* Navigation Tabs (Desktop / Tablet) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
          }}
        >
          {navLinks.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path.split('?')[0]);

            return (
              <Box
                key={item.label}
                component={NavLink}
                to={item.path}
                sx={{
                  position: 'relative',
                  px: 1.8,
                  py: 0.7,
                  borderRadius: 9999,
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? isDark
                      ? '#ffffff'
                      : '#0f172a'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.65)'
                    : 'rgba(15, 23, 42, 0.65)',
                  backgroundColor: isActive
                    ? isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)'
                    : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    color: isDark ? '#ffffff' : '#000000',
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {item.label}
                {item.badge > 0 && (
                  <Badge
                    badgeContent={item.badge}
                    color="primary"
                    sx={{
                      ml: 1,
                      '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: 16,
                        minWidth: 16,
                        backgroundColor: '#6366f1',
                      },
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Action Icons Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {/* Search Icon */}
          <Tooltip title="Search Movies">
            <IconButton
              size="small"
              onClick={() => navigate('/search')}
              sx={{
                color: isDark ? 'rgba(255,255,255,0.85)' : '#0f172a',
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.15)', color: '#6366f1' },
              }}
            >
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Notifications Icon with "2" badge */}
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              onClick={handleOpenNotifMenu}
              sx={{
                color: isDark ? 'rgba(255,255,255,0.85)' : '#0f172a',
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.15)', color: '#ec4899' },
              }}
            >
              <Badge
                badgeContent={unreadNotifsCount}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#8b5cf6', // Violet badge like Figma
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 17,
                    minWidth: 17,
                  },
                }}
              >
                <NotificationsRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings Icon */}
          <Tooltip title="Settings & TMDb API Key">
            <IconButton
              size="small"
              onClick={() => dispatch(openSettingsModal())}
              sx={{
                color: isDark ? 'rgba(255,255,255,0.85)' : '#0f172a',
                transition: 'all 0.2s',
                '&:hover': { transform: 'rotate(45deg) scale(1.15)', color: '#6366f1' },
              }}
            >
              <SettingsRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle (Light / Dark mode requirement) */}
          <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              size="small"
              onClick={() => dispatch(toggleTheme())}
              sx={{
                color: isDark ? '#fbbf24' : '#6366f1',
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.15)' },
              }}
            >
              {isDark ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <Tooltip title={user?.displayName || 'My Profile'}>
              <IconButton
                size="small"
                onClick={handleOpenUserMenu}
                sx={{ p: 0.3 }}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.displayName}
                  sx={{
                    width: 28,
                    height: 28,
                    border: '1.5px solid #6366f1',
                    fontSize: '0.8rem',
                  }}
                >
                  {user?.displayName?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Sign In">
              <IconButton
                size="small"
                onClick={() => dispatch(openLoginModal())}
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.85)' : '#0f172a',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'scale(1.15)', color: '#6366f1' },
                }}
              >
                <PersonRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Discord / Community icon */}
          <Tooltip title="Join CineGlass Community">
            <IconButton
              size="small"
              component="a"
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b',
                display: { xs: 'none', sm: 'inline-flex' },
                transition: 'all 0.2s',
                '&:hover': { color: '#5865F2', transform: 'scale(1.15)' },
              }}
            >
              <ForumRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Notifications Popover Menu */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={handleCloseNotifMenu}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: 320,
              borderRadius: 3,
              backgroundColor: isDark
                ? 'rgba(18, 20, 28, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              p: 1,
            },
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1, fontWeight: 700 }}
        >
          Notifications
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)' }}
            >
              No new notifications
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
                display: 'block',
                mt: 0.5,
              }}
            >
              Alerts for your watchlist will appear here.
            </Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={handleCloseNotifMenu}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderRadius: 2,
                mb: 0.5,
                whiteSpace: 'normal',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {notif.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
              >
                {notif.message}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#818cf8', fontSize: '0.7rem', mt: 0.5 }}
              >
                {notif.time}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>

      {/* User Profile Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseUserMenu}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 3,
              backgroundColor: isDark
                ? 'rgba(18, 20, 28, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              p: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {user?.displayName || 'User'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate('/favorites');
          }}
          sx={{ borderRadius: 2 }}
        >
          My Watchlist ({favorites.length})
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            dispatch(logout());
          }}
          sx={{ borderRadius: 2, color: '#ef4444' }}
        >
          <LogoutRoundedIcon sx={{ fontSize: '1rem', mr: 1 }} />
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}

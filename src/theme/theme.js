import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1', // Vibrant Indigo accent
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ec4899', // Pink accent
        light: '#f472b6',
        dark: '#db2777',
      },
      background: {
        default: isDark ? '#07080c' : '#f5f7fb',
        paper: isDark ? '#11131a' : '#ffffff',
        glass: isDark
          ? 'rgba(18, 20, 29, 0.65)'
          : 'rgba(255, 255, 255, 0.75)',
        glassSubtle: isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)',
        glassElevated: isDark
          ? 'rgba(28, 32, 45, 0.85)'
          : 'rgba(255, 255, 255, 0.9)',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
        muted: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      },
    },
    typography: {
      fontFamily: [
        '"Plus Jakarta Sans"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#07080c' : '#f5f7fb',
            color: isDark ? '#f8fafc' : '#0f172a',
            overflowX: 'hidden',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 9999, // Fluid pill geometry
            padding: '10px 22px',
            fontSize: '0.92rem',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': {
              transform: 'scale(1.04)',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: isDark
              ? 'rgba(17, 20, 28, 0.7)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
            }`,
            boxShadow: isDark
              ? '0 10px 30px rgba(0, 0, 0, 0.4)'
              : '0 10px 30px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            backgroundColor: isDark
              ? 'rgba(15, 18, 25, 0.88)'
              : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(30px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
            }`,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            fontWeight: 500,
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
  });
};

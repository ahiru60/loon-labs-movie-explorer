import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useDispatch, useSelector } from 'react-redux';

import SearchBar from '../components/search/SearchBar';
import MovieGrid from '../components/movie/MovieGrid';
import GlassButton from '../components/common/GlassButton';
import {
  searchMovies,
  loadMoreSearchResults,
} from '../features/movies/moviesSlice';

export default function SearchPage() {
  const dispatch = useDispatch();
  const {
    searchQuery,
    lastSearchQuery,
    searchResults,
    searchPage,
    searchTotalPages,
    searchTotalResults,
    isSearching,
    isLoadingMoreSearch,
    searchError,
  } = useSelector((state) => state.movies);

  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';

  // Toggle between Infinite Scroll & Load More Button (fulfills both UX preferences!)
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);
  const observerTarget = useRef(null);

  // Initial load: if searchResults is empty but we have a lastSearchQuery, load last searched results!
  useEffect(() => {
    if (searchResults.length === 0 && lastSearchQuery) {
      dispatch(searchMovies({ query: lastSearchQuery, page: 1 }));
    }
  }, [dispatch, searchResults.length, lastSearchQuery]);

  const handleLoadMore = useCallback(() => {
    if (
      searchQuery &&
      searchPage < searchTotalPages &&
      !isLoadingMoreSearch &&
      !isSearching
    ) {
      dispatch(
        loadMoreSearchResults({
          query: searchQuery,
          page: searchPage + 1,
        })
      );
    }
  }, [searchQuery, searchPage, searchTotalPages, isLoadingMoreSearch, isSearching, dispatch]);

  // Infinite Scroll IntersectionObserver Sentinel
  useEffect(() => {
    if (!useInfiniteScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.2, rootMargin: '200px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [useInfiniteScroll, handleLoadMore]);

  const hasMore = searchPage < searchTotalPages;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pt: { xs: 12, md: 16 }, pb: 14 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.8rem' },
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            Search Movies & Shows
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
            }}
          >
            Real-time querying powered by TMDb API with instant debounce.
          </Typography>
        </Box>

        {/* Search Bar with Last Search Persistence */}
        <SearchBar autoFocus />

        {/* UX Option Toggle: Infinite Scroll vs Load More Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
            px: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              fontWeight: 600,
            }}
          >
            {isSearching ? (
              'Searching...'
            ) : searchResults.length > 0 ? (
              <>
                Showing {searchResults.length} of {searchTotalResults} results for{' '}
                <Typography component="span" sx={{ color: '#818cf8', fontWeight: 700 }}>
                  "{searchQuery || lastSearchQuery}"
                </Typography>
              </>
            ) : (
              'Type above to start searching'
            )}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={useInfiniteScroll}
                onChange={(e) => setUseInfiniteScroll(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {useInfiniteScroll ? 'Infinite Scroll Active' : 'Load More Button Mode'}
              </Typography>
            }
          />
        </Box>

        {/* API Error Handling */}
        {searchError && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {searchError} (Cached fallback results are shown below)
          </Alert>
        )}

        {/* Movie Results Grid */}
        <MovieGrid
          movies={searchResults}
          isLoading={isSearching}
          emptyMessage={
            searchQuery
              ? `No movies found matching "${searchQuery}". Please try another keyword.`
              : 'Start typing in the search bar above.'
          }
        />

        {/* Load More Button (when Infinite Scroll is turned off or as a manual trigger) */}
        {!useInfiniteScroll && hasMore && searchResults.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <GlassButton
              variant="primary"
              size="large"
              onClick={handleLoadMore}
              disabled={isLoadingMoreSearch}
              sx={{ minWidth: 200 }}
            >
              {isLoadingMoreSearch ? (
                <CircularProgress size={24} sx={{ color: '#0f172a' }} />
              ) : (
                'Load More Results'
              )}
            </GlassButton>
          </Box>
        )}

        {/* Infinite Scroll Observer Sentinel Element & Loading Indicator */}
        {useInfiniteScroll && hasMore && (
          <Box
            ref={observerTarget}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 5,
              opacity: isLoadingMoreSearch ? 1 : 0.4,
            }}
          >
            {isLoadingMoreSearch && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={26} sx={{ color: '#6366f1' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Loading more movies...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbApi } from '../../api/tmdbApi';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';

const LAST_SEARCH_KEY = 'cineglass_last_search_query';

// Async Thunks
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrendingMovies',
  async (timeWindow = 'week', { rejectWithValue }) => {
    try {
      const results = await tmdbApi.getTrendingMovies(timeWindow);
      return results;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch trending movies');
    }
  }
);

export const fetchTrendingSeries = createAsyncThunk(
  'movies/fetchTrendingSeries',
  async (timeWindow = 'week', { rejectWithValue }) => {
    try {
      const results = await tmdbApi.getTrendingSeries(timeWindow);
      return results;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch trending series');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const results = await tmdbApi.getGenres();
      return results;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch genres');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const data = await tmdbApi.searchMovies(query, page);
      return { ...data, query };
    } catch (err) {
      return rejectWithValue(err.message || 'Search failed');
    }
  }
);

export const loadMoreSearchResults = createAsyncThunk(
  'movies/loadMoreSearchResults',
  async ({ query, page }, { rejectWithValue }) => {
    try {
      const data = await tmdbApi.searchMovies(query, page);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load more results');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      const details = await tmdbApi.getMovieDetails(movieId);
      return details;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch movie details');
    }
  }
);

export const discoverFilteredMovies = createAsyncThunk(
  'movies/discoverFilteredMovies',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await tmdbApi.discoverMovies(filters);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to discover movies');
    }
  }
);

export const loadMoreFilteredMovies = createAsyncThunk(
  'movies/loadMoreFilteredMovies',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await tmdbApi.discoverMovies(filters);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load more filtered movies');
    }
  }
);

const initialState = {
  trendingMovies: [],
  trendingSeries: [],
  genres: [],
  
  // Search
  searchQuery: '',
  lastSearchQuery: loadFromStorage(LAST_SEARCH_KEY, 'Spider-Man'),
  searchResults: [],
  searchPage: 1,
  searchTotalPages: 1,
  searchTotalResults: 0,
  isSearching: false,
  isLoadingMoreSearch: false,
  searchError: null,

  // Filters (Bonus requirement)
  filters: {
    genreId: '',
    year: '',
    minRating: 0,
    sortBy: 'popularity.desc',
  },
  filteredMovies: [],
  filteredPage: 1,
  filteredTotalPages: 1,
  isLoadingFiltered: false,
  isLoadingMoreFiltered: false,
  filteredError: null,

  // Selected Movie / Apple TV Detail Modal
  selectedMovie: null,
  isLoadingDetails: false,
  detailsError: null,
  isDetailModalOpen: false,

  // Trailer Modal
  activeTrailerKey: null,
  activeTrailerTitle: '',
  isTrailerModalOpen: false,

  // General Loading & Error
  isLoadingTrending: false,
  trendingError: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    saveLastSearchQuery: (state, action) => {
      state.lastSearchQuery = action.payload;
      saveToStorage(LAST_SEARCH_KEY, action.payload);
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
      state.searchPage = 1;
      state.searchTotalPages = 1;
      state.searchError = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        genreId: '',
        year: '',
        minRating: 0,
        sortBy: 'popularity.desc',
      };
    },
    openDetailModal: (state, action) => {
      state.selectedMovie = action.payload;
      state.isDetailModalOpen = true;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
    },
    openTrailerModal: (state, action) => {
      const { trailerKey, title } = action.payload;
      state.activeTrailerKey = trailerKey;
      state.activeTrailerTitle = title || 'Movie Trailer';
      state.isTrailerModalOpen = true;
    },
    closeTrailerModal: (state) => {
      state.isTrailerModalOpen = false;
      state.activeTrailerKey = null;
    },
    clearErrors: (state) => {
      state.trendingError = null;
      state.searchError = null;
      state.filteredError = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    // Trending Movies
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.isLoadingTrending = true;
        state.trendingError = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.isLoadingTrending = false;
        state.trendingMovies = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.isLoadingTrending = false;
        state.trendingError = action.payload || 'Failed to load trending movies';
      });

    // Trending Series
    builder.addCase(fetchTrendingSeries.fulfilled, (state, action) => {
      state.trendingSeries = action.payload;
    });

    // Genres
    builder.addCase(fetchGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
    });

    // Search Movies
    builder
      .addCase(searchMovies.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.results;
        state.searchPage = action.payload.page;
        state.searchTotalPages = action.payload.total_pages;
        state.searchTotalResults = action.payload.total_results;
        if (action.payload.query) {
          state.lastSearchQuery = action.payload.query;
          saveToStorage(LAST_SEARCH_KEY, action.payload.query);
        }
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
      });

    // Load More Search Results (Infinite Scroll & Load More)
    builder
      .addCase(loadMoreSearchResults.pending, (state) => {
        state.isLoadingMoreSearch = true;
      })
      .addCase(loadMoreSearchResults.fulfilled, (state, action) => {
        state.isLoadingMoreSearch = false;
        // Prevent duplicate IDs when appending
        const existingIds = new Set(state.searchResults.map((m) => m.id));
        const newItems = action.payload.results.filter((m) => !existingIds.has(m.id));
        state.searchResults = [...state.searchResults, ...newItems];
        state.searchPage = action.payload.page;
        state.searchTotalPages = action.payload.total_pages;
      })
      .addCase(loadMoreSearchResults.rejected, (state) => {
        state.isLoadingMoreSearch = false;
      });

    // Movie Details
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.detailsError = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload;
      });

    // Filtered / Discover Movies
    builder
      .addCase(discoverFilteredMovies.pending, (state) => {
        state.isLoadingFiltered = true;
        state.filteredError = null;
      })
      .addCase(discoverFilteredMovies.fulfilled, (state, action) => {
        state.isLoadingFiltered = false;
        state.filteredMovies = action.payload.results;
        state.filteredPage = action.payload.page;
        state.filteredTotalPages = action.payload.total_pages;
      })
      .addCase(discoverFilteredMovies.rejected, (state, action) => {
        state.isLoadingFiltered = false;
        state.filteredError = action.payload;
      });

    // Load More Filtered Movies
    builder
      .addCase(loadMoreFilteredMovies.pending, (state) => {
        state.isLoadingMoreFiltered = true;
      })
      .addCase(loadMoreFilteredMovies.fulfilled, (state, action) => {
        state.isLoadingMoreFiltered = false;
        const existingIds = new Set(state.filteredMovies.map((m) => m.id));
        const newItems = action.payload.results.filter((m) => !existingIds.has(m.id));
        state.filteredMovies = [...state.filteredMovies, ...newItems];
        state.filteredPage = action.payload.page;
      })
      .addCase(loadMoreFilteredMovies.rejected, (state) => {
        state.isLoadingMoreFiltered = false;
      });
  },
});

export const {
  setSearchQuery,
  saveLastSearchQuery,
  clearSearch,
  setFilters,
  resetFilters,
  openDetailModal,
  closeDetailModal,
  openTrailerModal,
  closeTrailerModal,
  clearErrors,
} = moviesSlice.actions;

export default moviesSlice.reducer;

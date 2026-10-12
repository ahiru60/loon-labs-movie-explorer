import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';
import {
  isSupabaseConfigured,
  supabaseGetFavorites,
  supabaseAddFavorite,
  supabaseRemoveFavorite,
  supabaseSyncFavorites,
} from '../../services/supabaseClient';

const FAVORITES_KEY = 'cineglass_favorites';
const HISTORY_KEY = 'cineglass_watch_history';

const initialFavorites = loadFromStorage(FAVORITES_KEY, []);
const initialHistory = loadFromStorage(HISTORY_KEY, []);

// Thunk: Fetch favorites from Supabase DB
export const fetchUserFavoritesFromDb = createAsyncThunk(
  'favorites/fetchUserFavoritesFromDb',
  async (userId, { rejectWithValue }) => {
    if (!isSupabaseConfigured() || !userId) return [];
    try {
      const dbFavorites = await supabaseGetFavorites(userId);
      saveToStorage(FAVORITES_KEY, dbFavorites);
      return dbFavorites;
    } catch (err) {
      console.warn('Failed to load favorites from Supabase DB:', err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Thunk: Sync local favorites up to Supabase DB on user sign in
export const syncLocalFavoritesToDb = createAsyncThunk(
  'favorites/syncLocalFavoritesToDb',
  async (userId, { getState, rejectWithValue }) => {
    if (!isSupabaseConfigured() || !userId) return;
    const localFavorites = getState().favorites.favorites;
    if (!localFavorites?.length) return;
    try {
      await supabaseSyncFavorites(userId, localFavorites);
      const updated = await supabaseGetFavorites(userId);
      saveToStorage(FAVORITES_KEY, updated);
      return updated;
    } catch (err) {
      console.warn('Failed to sync local favorites to Supabase:', err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Thunk: Universal toggle favorite with optimistic UI update and Supabase DB sync
export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (movie, { dispatch, getState }) => {
    // 1. Instant optimistic update in Redux & localStorage
    dispatch(toggleFavoriteLocal(movie));

    // 2. Sync with Supabase Database if authenticated
    const state = getState();
    const user = state.auth.user;

    if (user?.id && isSupabaseConfigured() && user.isSupabase) {
      const isNowInFavorites = state.favorites.favorites.some(
        (item) => item.id === movie.id
      );

      try {
        if (isNowInFavorites) {
          await supabaseAddFavorite(user.id, movie);
        } else {
          await supabaseRemoveFavorite(user.id, movie.id);
        }
      } catch (err) {
        console.warn('Supabase DB toggle warning:', err.message);
      }
    }
  }
);

const initialState = {
  favorites: initialFavorites,
  continueWatching: initialHistory,
  isDbSyncing: false,
  dbError: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Optimistic local toggle
    toggleFavoriteLocal: (state, action) => {
      const movie = action.payload;
      const index = state.favorites.findIndex((item) => item.id === movie.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.unshift(movie);
      }
      saveToStorage(FAVORITES_KEY, state.favorites);
    },
    addFavorite: (state, action) => {
      const movie = action.payload;
      if (!state.favorites.some((item) => item.id === movie.id)) {
        state.favorites.unshift(movie);
        saveToStorage(FAVORITES_KEY, state.favorites);
      }
    },
    removeFavorite: (state, action) => {
      const movieId = action.payload;
      state.favorites = state.favorites.filter((item) => item.id !== movieId);
      saveToStorage(FAVORITES_KEY, state.favorites);
    },
    setFavoritesList: (state, action) => {
      state.favorites = action.payload || [];
      saveToStorage(FAVORITES_KEY, state.favorites);
    },
    addToHistory: (state, action) => {
      const movie = action.payload;
      const filtered = state.continueWatching.filter((m) => m.id !== movie.id);
      const newEntry = {
        id: movie.id,
        title: movie.title || movie.name,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date || movie.first_air_date,
      };
      state.continueWatching = [newEntry, ...filtered].slice(0, 10);
      saveToStorage(HISTORY_KEY, state.continueWatching);
    },
    removeFromHistory: (state, action) => {
      state.continueWatching = state.continueWatching.filter(
        (m) => m.id !== action.payload
      );
      saveToStorage(HISTORY_KEY, state.continueWatching);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch from DB
      .addCase(fetchUserFavoritesFromDb.pending, (state) => {
        state.isDbSyncing = true;
        state.dbError = null;
      })
      .addCase(fetchUserFavoritesFromDb.fulfilled, (state, action) => {
        state.isDbSyncing = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.favorites = action.payload;
        }
      })
      .addCase(fetchUserFavoritesFromDb.rejected, (state, action) => {
        state.isDbSyncing = false;
        state.dbError = action.payload;
      })
      // Sync local to DB
      .addCase(syncLocalFavoritesToDb.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.favorites = action.payload;
        }
      });
  },
});

export const {
  toggleFavoriteLocal,
  addFavorite,
  removeFavorite,
  setFavoritesList,
  addToHistory,
  removeFromHistory,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

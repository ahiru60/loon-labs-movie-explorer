import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';

const FAVORITES_KEY = 'cineglass_favorites';
const HISTORY_KEY = 'cineglass_watch_history';

const initialFavorites = loadFromStorage(FAVORITES_KEY, []);
const initialHistory = loadFromStorage(HISTORY_KEY, []);

const initialState = {
  favorites: initialFavorites,
  continueWatching: initialHistory,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
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
});

export const {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  addToHistory,
  removeFromHistory,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

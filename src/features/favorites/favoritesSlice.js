import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';

const FAVORITES_KEY = 'cineglass_favorites';
const HISTORY_KEY = 'cineglass_watch_history';

const initialFavorites = loadFromStorage(FAVORITES_KEY, []);
const initialHistory = loadFromStorage(HISTORY_KEY, [
  {
    id: 88801,
    title: 'Stranger Things',
    progress: 75,
    remainingTime: '47m left',
    seasonEpisode: 'Resume S1 E1',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
    poster_path: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=500&q=80',
    vote_average: 8.6,
  },
  {
    id: 99901,
    title: 'Matchbox: The Movie',
    progress: 40,
    remainingTime: '1h 12m left',
    seasonEpisode: 'Resume Film',
    backdrop_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1280&q=80',
    poster_path: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=500&q=80',
    vote_average: 7.8,
  },
]);

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
        progress: 10,
        remainingTime: 'Just started',
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
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

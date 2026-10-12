import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';

const API_KEY_STORAGE = 'cineglass_custom_tmdb_key';

const initialState = {
  customApiKey: loadFromStorage(API_KEY_STORAGE, ''),
  isSettingsOpen: false,
  isNotificationsOpen: false,
  notifications: [
    {
      id: 'n1',
      title: 'New Trailer Available',
      message: 'Spider-Man: Brand New Day official teaser is now streaming in 4K.',
      time: '10m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Trending Update',
      message: 'Matchbox: The Movie has reached #1 trending movie this week.',
      time: '2h ago',
      read: false,
    },
  ],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCustomApiKey: (state, action) => {
      state.customApiKey = action.payload;
      saveToStorage(API_KEY_STORAGE, action.payload);
    },
    clearCustomApiKey: (state) => {
      state.customApiKey = '';
      saveToStorage(API_KEY_STORAGE, '');
    },
    openSettingsModal: (state) => {
      state.isSettingsOpen = true;
    },
    closeSettingsModal: (state) => {
      state.isSettingsOpen = false;
    },
    toggleNotifications: (state) => {
      state.isNotificationsOpen = !state.isNotificationsOpen;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
  },
});

export const {
  setCustomApiKey,
  clearCustomApiKey,
  openSettingsModal,
  closeSettingsModal,
  toggleNotifications,
  markAllNotificationsRead,
} = settingsSlice.actions;

export default settingsSlice.reducer;

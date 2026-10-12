import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';

const API_KEY_STORAGE = 'cineglass_custom_tmdb_key';

const initialState = {
  customApiKey: loadFromStorage(API_KEY_STORAGE, ''),
  isSettingsOpen: false,
  isNotificationsOpen: false,
  notifications: [],
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
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: 'notif_' + Date.now(),
        title: action.payload.title,
        message: action.payload.message,
        time: 'Just now',
        read: false,
      });
      state.notifications = state.notifications.slice(0, 10);
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
  addNotification,
  markAllNotificationsRead,
} = settingsSlice.actions;

export default settingsSlice.reducer;

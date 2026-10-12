import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNotificationsOpen: false,
  notifications: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
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
  toggleNotifications,
  addNotification,
  markAllNotificationsRead,
} = settingsSlice.actions;

export default settingsSlice.reducer;

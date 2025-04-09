import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../utils/localStorage";

const initialState = {
  darkMode: false,
  sidebarOpen: true,
  activeView: "timer",
  notifications: [],
  appIntroShown: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || "info",
        timeout: action.payload.timeout || 5000,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    setAppIntroShown: (state) => {
      state.appIntroShown = true;
    },
    setInitialUiState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setActiveView,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setAppIntroShown,
  setInitialUiState,
} = uiSlice.actions;

// 加载 UI 状态
export const loadUiState = () => (dispatch) => {
  const savedState = loadState();
  if (savedState && savedState.ui) {
    dispatch(setInitialUiState(savedState.ui));
  }
};

export default uiSlice.reducer;

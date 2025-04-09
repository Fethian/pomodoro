import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../utils/localStorage";
import { setTimerDuration } from "./timerSlice";

const initialState = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationsEnabled: true,
  primaryColor: "#ff5252",
  language: "zh-CN",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetSettings: () => {
      return { ...initialState };
    },
    setInitialSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings, resetSettings, setInitialSettings } =
  settingsSlice.actions;

// 加载设置
export const loadSettings = () => (dispatch) => {
  const savedState = loadState();
  if (savedState && savedState.settings) {
    dispatch(setInitialSettings(savedState.settings));

    // 同步更新计时器时长
    dispatch(setTimerDuration(savedState.settings.pomodoroDuration));
  }
};

// 更新设置并同步相关状态
export const updateSettingsAndSync = (newSettings) => (dispatch) => {
  dispatch(updateSettings(newSettings));

  // 如果番茄钟时长更新了，同步到计时器
  if (newSettings.pomodoroDuration) {
    dispatch(setTimerDuration(newSettings.pomodoroDuration));
  }
};

export default settingsSlice.reducer;

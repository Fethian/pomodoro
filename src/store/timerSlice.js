import { createSlice } from "@reduxjs/toolkit";

// 计时器状态枚举
export const TIMER_STATES_ENUM = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  FINISHED: "finished",
};

// 定义初始状态
const initialState = {
  isRunning: false,
  timeLeft: 25 * 60, // 默认25分钟，以秒为单位
  mode: "pomodoro", // 'pomodoro', 'shortBreak', 'longBreak'
  currentSession: 1,
  sessionsCompleted: 0,
  totalSessions: 4, // 默认一组4个番茄钟
  activeTaskId: null,
  startTime: null,
  timerState: TIMER_STATES_ENUM.IDLE,
};

// 创建slice
const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state, action) => {
      const taskId = action.payload?.taskId;

      if (taskId) {
        state.activeTaskId = taskId;
      }

      state.isRunning = true;
      state.timerState = TIMER_STATES_ENUM.RUNNING;
      state.startTime = Date.now();
    },

    pauseTimer: (state) => {
      state.isRunning = false;
      state.timerState = TIMER_STATES_ENUM.PAUSED;
    },

    resumeTimer: (state) => {
      state.isRunning = true;
      state.timerState = TIMER_STATES_ENUM.RUNNING;
    },

    stopTimer: (state) => {
      state.isRunning = false;
      state.timerState = TIMER_STATES_ENUM.IDLE;
    },

    updateTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },

    completePomodoro: (state) => {
      state.sessionsCompleted += 1;
      state.isRunning = false;

      // 判断是否应该进入长休息
      if (state.sessionsCompleted % state.totalSessions === 0) {
        state.mode = "longBreak";
      } else {
        state.mode = "shortBreak";
      }

      // 根据模式设置时间
      if (state.mode === "shortBreak") {
        state.timeLeft = 5 * 60; // 5分钟短休息
      } else if (state.mode === "longBreak") {
        state.timeLeft = 15 * 60; // 15分钟长休息
      }

      state.timerState = TIMER_STATES_ENUM.FINISHED;
    },

    completeBreak: (state) => {
      state.mode = "pomodoro";
      state.timeLeft = 25 * 60; // 重新开始一个番茄钟
      state.currentSession += 1;
      state.isRunning = false;
      state.timerState = TIMER_STATES_ENUM.IDLE;
    },

    finishPomodoro: (state) => {
      state.isRunning = false;
      state.timerState = TIMER_STATES_ENUM.FINISHED;
    },

    setTimerDuration: (state, action) => {
      const { mode, duration } = action.payload;
      if (state.mode === mode && !state.isRunning) {
        state.timeLeft = duration * 60;
      }
    },

    resetPomodoros: (state) => {
      state.sessionsCompleted = 0;
      state.currentSession = 1;
    },

    // 添加缺少的函数
    setActiveTask: (state, action) => {
      state.activeTaskId = action.payload;
    },

    resetTimer: (state) => {
      // 根据当前模式重置时间
      if (state.mode === "pomodoro") {
        state.timeLeft = 25 * 60;
      } else if (state.mode === "shortBreak") {
        state.timeLeft = 5 * 60;
      } else if (state.mode === "longBreak") {
        state.timeLeft = 15 * 60;
      }
      state.isRunning = false;
      state.timerState = TIMER_STATES_ENUM.IDLE;
    },

    skipBreak: (state) => {
      // 跳过休息，直接进入下一个番茄钟
      state.mode = "pomodoro";
      state.timeLeft = 25 * 60;
      state.isRunning = false;
      state.timerState = TIMER_STATES_ENUM.IDLE;
    },
  },
});

// 导出actions
export const {
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateTimeLeft,
  completePomodoro,
  completeBreak,
  finishPomodoro,
  setTimerDuration,
  resetPomodoros,
  // 添加新导出的actions
  setActiveTask,
  resetTimer,
  skipBreak,
} = timerSlice.actions;

// 导出reducer
export default timerSlice.reducer;

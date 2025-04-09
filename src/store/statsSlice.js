import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadState } from "../utils/localStorage";
import { addDays, subDays, format } from "date-fns";

const initialState = {
  pomodoroHistory: {}, // 格式: { '2023-03-10': { count: 5, totalMinutes: 125, tasks: { 'task-id': 2 } } }
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  },
  totalPomodoros: 0,
  totalMinutes: 0,
  lastSevenDays: {},
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    addCompletedPomodoro: (state, action) => {
      const { date, taskId, duration } = action.payload;

      // 更新指定日期的番茄钟统计
      if (!state.pomodoroHistory[date]) {
        state.pomodoroHistory[date] = {
          count: 0,
          totalMinutes: 0,
          tasks: {},
        };
      }

      state.pomodoroHistory[date].count += 1;
      state.pomodoroHistory[date].totalMinutes += duration;

      // 更新特定任务的统计
      if (taskId) {
        if (!state.pomodoroHistory[date].tasks[taskId]) {
          state.pomodoroHistory[date].tasks[taskId] = 0;
        }
        state.pomodoroHistory[date].tasks[taskId] += 1;
      }

      // 更新总计
      state.totalPomodoros += 1;
      state.totalMinutes += duration;

      // 更新连续记录
      const today = new Date().toISOString().split("T")[0];
      if (date === today) {
        const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

        if (state.streakData.lastActiveDate === yesterday) {
          // 连续天数+1
          state.streakData.currentStreak += 1;
        } else if (state.streakData.lastActiveDate !== today) {
          // 重置连续天数
          state.streakData.currentStreak = 1;
        }

        // 更新最长连续天数
        if (state.streakData.currentStreak > state.streakData.longestStreak) {
          state.streakData.longestStreak = state.streakData.currentStreak;
        }

        state.streakData.lastActiveDate = today;
      }
    },
    resetStats: (state) => {
      state.pomodoroHistory = {};
      state.totalPomodoros = 0;
      state.totalMinutes = 0;
      state.streakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
      };
    },
    setInitialStats: (state, action) => {
      return { ...state, ...action.payload };
    },
    calculateLastSevenDays: (state) => {
      const result = {};
      const today = new Date();

      // 初始化最近7天的数据结构
      for (let i = 6; i >= 0; i--) {
        const date = format(subDays(today, i), "yyyy-MM-dd");
        result[date] = {
          count: 0,
          totalMinutes: 0,
        };

        // 如果有历史数据，则填充
        if (state.pomodoroHistory[date]) {
          result[date] = {
            count: state.pomodoroHistory[date].count,
            totalMinutes: state.pomodoroHistory[date].totalMinutes,
          };
        }
      }

      state.lastSevenDays = result;
    },
  },
});

// 添加注释解释统计更新机制

// 每次完成一个番茄钟时更新统计数据
export const recordCompletedPomodoro = createAsyncThunk(
  "stats/recordCompletedPomodoro",
  async (taskId, { getState, dispatch }) => {
    const state = getState();
    const date = new Date().toISOString().split("T")[0]; // 获取当前日期

    // 更新番茄钟历史记录
    // 注意：统计数据是实时更新的，每完成一个番茄钟就会更新一次
    dispatch(updatePomodoroHistory({ date, taskId }));

    // 重新计算连续记录和最近七天数据
    dispatch(calculateStreak());
    dispatch(calculateLastSevenDays());

    return { date };
  }
);

export const {
  addCompletedPomodoro,
  resetStats,
  setInitialStats,
  calculateLastSevenDays,
} = statsSlice.actions;

// 加载统计数据
export const loadStats = () => (dispatch) => {
  const savedState = loadState();
  if (savedState && savedState.stats) {
    dispatch(setInitialStats(savedState.stats));
    dispatch(calculateLastSevenDays());
  }
};

// 选择器
export const selectProductivityByDay = (state) => {
  const result = {};
  const now = new Date();

  // 获取过去30天的数据
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(now, i), "yyyy-MM-dd");
    const dayData = state.stats.pomodoroHistory[date];

    result[date] = dayData ? dayData.count : 0;
  }

  return result;
};

export const selectMostProductiveDay = (state) => {
  let maxCount = 0;
  let mostProductiveDay = null;

  Object.entries(state.stats.pomodoroHistory).forEach(([date, data]) => {
    if (data.count > maxCount) {
      maxCount = data.count;
      mostProductiveDay = date;
    }
  });

  return { date: mostProductiveDay, count: maxCount };
};

export default statsSlice.reducer;

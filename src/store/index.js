import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timerSlice";
import tasksReducer from "./tasksSlice";
import statsReducer from "./statsSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    timer: timerReducer,
    tasks: tasksReducer,
    stats: statsReducer,
    settings: settingsReducer,
  },
});

export default store;

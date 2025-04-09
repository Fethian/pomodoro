import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { loadState } from "../utils/localStorage";

// 确保初始状态中的 tasks 是数组
const initialState = {
  tasks: [], // 确保这是一个空数组
  activeTaskId: null,
  filter: "all",
  sortBy: "createdAt",
  sortDirection: "desc",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description || "",
        estimatedPomodoros: action.payload.estimatedPomodoros || 1,
        completedPomodoros: 0,
        createdAt: Date.now(),
        dueDate: action.payload.dueDate || null,
        completed: false,
        tags: action.payload.tags || [],
        priority: action.payload.priority || "medium",
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload,
        };
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      if (state.activeTaskId === action.payload) {
        state.activeTaskId = null;
      }
    },
    completeTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].completed = true;
        state.tasks[index].completedAt = Date.now();

        if (state.activeTaskId === action.payload) {
          state.activeTaskId = null;
        }
      }
    },
    incrementTaskPomodoro: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].completedPomodoros =
          (state.tasks[index].completedPomodoros || 0) + 1;

        // 如果完成了估计的番茄钟数，自动标记为完成
        // 修改为只在用户确认后才自动完成任务，而不是直接自动完成
        // 这样可以避免用户还想继续专注但任务已经被标记完成的情况
        if (
          state.tasks[index].completedPomodoros >=
          state.tasks[index].estimatedPomodoros
        ) {
          // 不自动标记完成，仅在UI中提示用户
          // state.tasks[index].completed = true;
          // state.tasks[index].completedAt = Date.now();
        }
      }
    },
    setActiveTask: (state, action) => {
      state.activeTaskId = action.payload;
    },
    clearActiveTask: (state) => {
      state.activeTaskId = null;
    },
    setTasksFilter: (state, action) => {
      state.filter = action.payload;
    },
    setTasksSort: (state, action) => {
      if (action.payload.sortBy) {
        state.sortBy = action.payload.sortBy;
      }
      if (action.payload.sortDirection) {
        state.sortDirection = action.payload.sortDirection;
      }
    },
    bulkDeleteTasks: (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => !action.payload.includes(task.id)
      );
    },
    archiveCompletedTasks: (state) => {
      state.tasks = state.tasks.filter((task) => !task.completed);
    },
    setInitialTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  incrementTaskPomodoro,
  setActiveTask,
  clearActiveTask,
  setTasksFilter,
  setTasksSort,
  bulkDeleteTasks,
  archiveCompletedTasks,
  setInitialTasks,
} = tasksSlice.actions;

// 加载任务数据
export const loadTasks = () => (dispatch) => {
  const savedState = loadState();
  if (savedState && savedState.tasks && savedState.tasks.tasks) {
    dispatch(setInitialTasks(savedState.tasks.tasks));
  }
};

// 修改选择器，添加安全检查
export const selectFilteredTasks = (state) => {
  if (!state || !state.tasks || !Array.isArray(state.tasks.tasks)) {
    return []; // 如果 state.tasks.tasks 不是数组，返回空数组
  }

  const { tasks, filter, sortBy, sortDirection } = state.tasks;

  // 先筛选
  let filteredTasks = [...tasks];
  if (filter === "active") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filter === "today") {
    const today = new Date().toISOString().split("T")[0];
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.dueDate && task.dueDate.split("T")[0] === today && !task.completed
    );
  } else if (filter.startsWith("tag:")) {
    const tag = filter.substring(4);
    filteredTasks = filteredTasks.filter((task) => task.tags.includes(tag));
  } else if (filter.startsWith("priority:")) {
    const priority = filter.substring(9);
    filteredTasks = filteredTasks.filter((task) => task.priority === priority);
  }

  // 再排序
  return filteredTasks.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // 处理特殊字段
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[a.priority];
      bValue = priorityOrder[b.priority];
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export default tasksSlice.reducer;

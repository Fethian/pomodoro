// 用于处理本地存储的工具函数

// 从本地存储加载状态
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("pomodoroAppState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return undefined;
  }
};

// 保存状态到本地存储
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("pomodoroAppState", serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

// 清除本地存储
export const clearState = () => {
  try {
    localStorage.removeItem("pomodoroAppState");
  } catch (err) {
    console.error("Error clearing state from localStorage:", err);
  }
};

// 保存特定键的数据
export const saveItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

// 获取特定键的数据
export const loadItem = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return undefined;
    }
    return JSON.parse(serializedValue);
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return undefined;
  }
};

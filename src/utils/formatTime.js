// 时间格式化工具函数

// 将秒数格式化为 MM:SS 格式
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// 将秒数格式化为人类可读格式（例如：25分钟）
export const formatTimeHuman = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "0分钟";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (minutes === 0) {
    return `${remainingSeconds}秒`;
  } else if (remainingSeconds === 0) {
    return `${minutes}分钟`;
  } else {
    return `${minutes}分${remainingSeconds}秒`;
  }
};

// 将毫秒时间戳格式化为日期字符串
export const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 将毫秒时间戳格式化为时间字符串
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 计算两个时间戳之间的时间差（秒）
export const getTimeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  return Math.floor((endTime - startTime) / 1000);
};

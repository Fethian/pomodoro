import React from "react";
import { useTheme } from "@mui/material";
import { TIMER_STATES_ENUM } from "../../store/timerSlice";

const TimerProgressRing = ({
  progress,
  status,
  size = 300,
  strokeWidth = 8,
}) => {
  const theme = useTheme();

  // 计算圆形属性
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  // 根据状态确定颜色
  const getStatusColor = () => {
    switch (status) {
      case TIMER_STATES_ENUM.RUNNING:
        return theme.palette.primary.main;
      case TIMER_STATES_ENUM.PAUSED:
        return theme.palette.warning.main;
      case TIMER_STATES_ENUM.BREAK:
      case TIMER_STATES_ENUM.LONG_BREAK:
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // 根据状态确定背景色
  const getBackgroundColor = () => {
    switch (status) {
      case TIMER_STATES_ENUM.RUNNING:
        return `${theme.palette.primary.main}20`;
      case TIMER_STATES_ENUM.PAUSED:
        return `${theme.palette.warning.main}20`;
      case TIMER_STATES_ENUM.BREAK:
      case TIMER_STATES_ENUM.LONG_BREAK:
        return `${theme.palette.success.main}20`;
      default:
        return `${theme.palette.primary.main}10`;
    }
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 背景圆圈 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={getBackgroundColor()}
        strokeWidth={strokeWidth}
      />

      {/* 进度圆圈 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={getStatusColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          transition: "stroke-dashoffset 0.5s ease-in-out",
        }}
      />
    </svg>
  );
};

export default TimerProgressRing;

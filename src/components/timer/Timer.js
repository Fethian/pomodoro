import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import { PlayArrow, Pause, Stop, SkipNext, Refresh } from "@mui/icons-material";
import {
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateTimeLeft,
  finishPomodoro,
  completeBreak,
  TIMER_STATES_ENUM,
} from "../../store/timerSlice";
import {
  incrementTaskPomodoro,
  selectFilteredTasks,
} from "../../store/tasksSlice";
import { formatTime } from "../../utils/formatTime";
import { sendNotification, playSound } from "../../utils/notification";
import { addNotification } from "../../store/uiSlice";
import TaskSelector from "./TaskSelector";
import TimerProgressRing from "./TimerProgressRing";

const Timer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // 从Redux获取状态
  const {
    status,
    timeLeft,
    initialTime,
    currentTaskId,
    completedPomodoros,
    targetPomodoros,
    startTime,
    totalPausedTime,
  } = useSelector((state) => state.timer);

  const {
    alarmSound,
    alarmVolume,
    tickingSound,
    tickingVolume,
    notificationsEnabled,
    autoStartBreaks,
    autoStartPomodoros,
  } = useSelector((state) => state.settings);

  // 本地状态
  const [progress, setProgress] = useState(100);
  const [timeDisplay, setTimeDisplay] = useState(formatTime(timeLeft));
  const [isHovering, setIsHovering] = useState(false);

  // Refs
  const tickingAudioRef = useRef(null);
  const timerRef = useRef(null);
  const tasks = useSelector(selectFilteredTasks);
  const currentTask = currentTaskId
    ? tasks.find((task) => task.id === currentTaskId)
    : null;

  // 计算进度
  useEffect(() => {
    if (
      status === TIMER_STATES_ENUM.RUNNING ||
      status === TIMER_STATES_ENUM.BREAK ||
      status === TIMER_STATES_ENUM.LONG_BREAK
    ) {
      const totalTime =
        status === TIMER_STATES_ENUM.RUNNING ? initialTime : timeLeft;
      const newProgress = (timeLeft / totalTime) * 100;
      setProgress(newProgress);
    } else if (status === TIMER_STATES_ENUM.IDLE) {
      setProgress(100);
    }
  }, [timeLeft, initialTime, status]);

  // 格式化显示时间
  useEffect(() => {
    setTimeDisplay(formatTime(timeLeft));

    // 更新页面标题
    document.title = `${formatTime(timeLeft)} - 番茄钟`;

    return () => {
      document.title = "番茄钟";
    };
  }, [timeLeft]);

  // 计时器逻辑
  useEffect(() => {
    if (
      status === TIMER_STATES_ENUM.RUNNING ||
      status === TIMER_STATES_ENUM.BREAK ||
      status === TIMER_STATES_ENUM.LONG_BREAK
    ) {
      // 清除旧的计时器
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 创建新的计时器
      timerRef.current = setInterval(() => {
        // 计算剩余时间
        const elapsed = Math.floor(
          (Date.now() - startTime - totalPausedTime) / 1000
        );
        const remaining = Math.max(initialTime - elapsed, 0);

        dispatch(updateTimeLeft(remaining));

        // 检查计时器是否结束
        if (remaining <= 0) {
          clearInterval(timerRef.current);

          // 根据状态执行不同的完成动作
          if (status === TIMER_STATES_ENUM.RUNNING) {
            // 完成番茄钟
            handleCompletePomodoro();
          } else {
            // 完成休息
            handleCompleteBreak();
          }
        }
      }, 500);

      // 播放滴答声
      if (tickingSound !== "none") {
        playTickingSound();
      }
    } else {
      // 停止计时器
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 停止滴答声
      stopTickingSound();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopTickingSound();
    };
  }, [status, startTime, totalPausedTime]);

  // 播放滴答声
  const playTickingSound = () => {
    if (!tickingAudioRef.current) {
      tickingAudioRef.current = new Audio(`/sounds/${tickingSound}.mp3`);
      tickingAudioRef.current.volume = tickingVolume;
      tickingAudioRef.current.loop = true;
    }

    tickingAudioRef.current.play().catch((error) => {
      console.error("Failed to play ticking sound:", error);
    });
  };

  // 停止滴答声
  const stopTickingSound = () => {
    if (tickingAudioRef.current) {
      tickingAudioRef.current.pause();
      tickingAudioRef.current.currentTime = 0;
    }
  };

  // 完成番茄钟处理
  const handleCompletePomodoro = useCallback(() => {
    // 删除或注释掉音效播放代码
    // console.log('Timer completed');

    // 发送通知
    if (notificationsEnabled) {
      sendNotification("番茄钟完成！", {
        body: currentTask
          ? `已完成任务 "${currentTask.title}" 的一个番茄钟`
          : "休息一下吧！",
        timeout: 5000,
      });
    }

    // 更新Redux状态
    dispatch(finishPomodoro(currentTaskId));

    // 如果有关联任务，增加其完成的番茄钟数
    if (currentTaskId) {
      dispatch(incrementTaskPomodoro(currentTaskId));
    }

    // 添加通知
    dispatch(
      addNotification({
        message: "番茄钟完成！",
        type: "success",
      })
    );

    // 如果设置了自动开始休息，则自动开始
    if (autoStartBreaks) {
      // 休息已经自动开始，不需要额外操作
    }
  }, [
    currentTaskId,
    currentTask,
    alarmSound,
    alarmVolume,
    notificationsEnabled,
    autoStartBreaks,
    dispatch,
  ]);

  // 完成休息处理
  const handleCompleteBreak = useCallback(() => {
    // 删除或注释掉音效播放代码
    // console.log('Timer completed');

    // 发送通知
    if (notificationsEnabled) {
      sendNotification("休息时间结束", {
        body: "回到工作状态！",
        timeout: 5000,
      });
    }

    // 更新Redux状态
    dispatch(completeBreak());

    // 添加通知
    dispatch(
      addNotification({
        message: "休息时间结束",
        type: "info",
      })
    );

    // 如果设置了自动开始番茄钟且有下一个番茄钟要完成，则自动开始
    if (autoStartPomodoros && completedPomodoros < targetPomodoros) {
      dispatch(startTimer());
    }
  }, [
    alarmSound,
    alarmVolume,
    notificationsEnabled,
    autoStartPomodoros,
    completedPomodoros,
    targetPomodoros,
    dispatch,
  ]);

  // 处理开始按钮点击
  const handleStartClick = () => {
    if (status === TIMER_STATES_ENUM.PAUSED) {
      dispatch(resumeTimer());
    } else {
      dispatch(startTimer());
    }
  };

  // 处理暂停按钮点击
  const handlePauseClick = () => {
    dispatch(pauseTimer());
  };

  // 处理停止按钮点击
  const handleStopClick = () => {
    dispatch(stopTimer());
  };

  // 处理跳过按钮点击
  const handleSkipClick = () => {
    if (
      status === TIMER_STATES_ENUM.BREAK ||
      status === TIMER_STATES_ENUM.LONG_BREAK
    ) {
      handleCompleteBreak();
    } else if (status === TIMER_STATES_ENUM.RUNNING) {
      if (window.confirm("确定要跳过当前番茄钟吗？这不会计入完成统计。")) {
        dispatch(stopTimer());
      }
    }
  };

  // 获取主要按钮状态
  const getMainActionButton = () => {
    if (
      status === TIMER_STATES_ENUM.RUNNING ||
      status === TIMER_STATES_ENUM.BREAK ||
      status === TIMER_STATES_ENUM.LONG_BREAK
    ) {
      return (
        <IconButton
          color="primary"
          size="large"
          onClick={handlePauseClick}
          sx={{
            width: 80,
            height: 80,
            backgroundColor: `${theme.palette.primary.main}20`,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}40`,
            },
          }}
        >
          <Pause sx={{ fontSize: 40 }} />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          color="primary"
          size="large"
          onClick={handleStartClick}
          sx={{
            width: 80,
            height: 80,
            backgroundColor: `${theme.palette.primary.main}20`,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}40`,
            },
          }}
        >
          <PlayArrow sx={{ fontSize: 40 }} />
        </IconButton>
      );
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (status) {
      case TIMER_STATES_ENUM.RUNNING:
        return "专注工作中";
      case TIMER_STATES_ENUM.PAUSED:
        return "已暂停";
      case TIMER_STATES_ENUM.BREAK:
        return "短休息中";
      case TIMER_STATES_ENUM.LONG_BREAK:
        return "长休息中";
      default:
        return "准备开始";
    }
  };

  // 获取状态颜色
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
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        px: 2,
        maxWidth: 600,
        mx: "auto",
      }}
    >
      {/* 当前任务显示 */}
      {status !== TIMER_STATES_ENUM.IDLE ? (
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            mb: 4,
            borderColor: getStatusColor(),
            transition: "all 0.3s ease",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              当前{status === TIMER_STATES_ENUM.RUNNING ? "任务" : "状态"}
            </Typography>
            <Typography variant="h6" component="div" noWrap>
              {currentTask ? currentTask.title : getStatusText()}
            </Typography>

            {status === TIMER_STATES_ENUM.RUNNING && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  进度: {completedPomodoros} / {targetPomodoros} 番茄钟
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(completedPomodoros / targetPomodoros) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <TaskSelector />
      )}

      {/* 计时器显示 */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
          cursor: status === TIMER_STATES_ENUM.IDLE ? "pointer" : "default",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          if (status === TIMER_STATES_ENUM.IDLE) {
            handleStartClick();
          }
        }}
      >
        <TimerProgressRing
          progress={progress}
          status={status}
          size={300}
          strokeWidth={8}
        />

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h1"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "4rem", sm: "5rem" },
              lineHeight: 1.1,
              color: getStatusColor(),
              userSelect: "none",
            }}
          >
            {timeDisplay}
          </Typography>

          <Typography
            variant="subtitle1"
            color="textSecondary"
            sx={{ mt: 1, fontWeight: 500, userSelect: "none" }}
          >
            {getStatusText()}
          </Typography>
        </Box>
      </Box>

      {/* 控制按钮 */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        {status !== TIMER_STATES_ENUM.IDLE && (
          <Tooltip title="停止">
            <IconButton
              onClick={handleStopClick}
              color="error"
              sx={{ backgroundColor: `${theme.palette.error.main}10` }}
            >
              <Stop />
            </IconButton>
          </Tooltip>
        )}

        {getMainActionButton()}

        {(status === TIMER_STATES_ENUM.BREAK ||
          status === TIMER_STATES_ENUM.LONG_BREAK ||
          status === TIMER_STATES_ENUM.RUNNING) && (
          <Tooltip title="跳过">
            <IconButton
              onClick={handleSkipClick}
              color="info"
              sx={{ backgroundColor: `${theme.palette.info.main}10` }}
            >
              <SkipNext />
            </IconButton>
          </Tooltip>
        )}

        {status === TIMER_STATES_ENUM.IDLE && (
          <Tooltip title="重置">
            <IconButton
              onClick={() => dispatch(updateTimeLeft(initialTime))}
              color="info"
              sx={{ backgroundColor: `${theme.palette.info.main}10` }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};

export default Timer;

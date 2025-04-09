import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Divider,
  Paper,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  Refresh,
  CheckCircle,
  Settings,
  Alarm,
} from "@mui/icons-material";

import TaskSelector from "../components/timer/TaskSelector";
import {
  startTimer,
  pauseTimer,
  resetTimer,
  completePomodoro,
  skipBreak,
  updateTimeLeft,
} from "../store/timerSlice";
import { completeTask } from "../store/tasksSlice";
import { sendNotification } from "../utils/notification";

const TimerPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    isRunning,
    timeLeft,
    currentSession,
    sessionsCompleted,
    totalSessions,
    activeTaskId,
    mode,
  } = useSelector((state) => state.timer);

  const activeTask = useSelector((state) =>
    state.tasks.tasks.find((task) => task.id === activeTaskId)
  );

  const {
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
  } = useSelector((state) => state.settings);

  const [showCompleteTaskDialog, setShowCompleteTaskDialog] = useState(false);

  // 计算会话总时长（以秒为单位）
  const getSessionDuration = () => {
    switch (mode) {
      case "pomodoro":
        return pomodoroDuration * 60;
      case "shortBreak":
        return shortBreakDuration * 60;
      case "longBreak":
        return longBreakDuration * 60;
      default:
        return pomodoroDuration * 60;
    }
  };

  // 计算进度百分比
  const calculateProgress = () => {
    const duration = getSessionDuration();
    return ((duration - timeLeft) / duration) * 100;
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // 获取会话类型显示文本
  const getModeText = () => {
    switch (mode) {
      case "pomodoro":
        return "专注时间";
      case "shortBreak":
        return "短休息";
      case "longBreak":
        return "长休息";
      default:
        return "专注时间";
    }
  };

  // 处理计时器完成
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      // 发送通知
      if (mode === "pomodoro") {
        sendNotification("番茄钟完成！", {
          body: "恭喜完成一个番茄钟，休息一下吧！",
          timeout: 5000,
        });
      } else {
        sendNotification("休息结束！", {
          body: "休息时间结束，准备开始新的番茄钟吧！",
          timeout: 5000,
        });
      }

      // 自动标记任务完成
      if (mode === "pomodoro" && activeTaskId) {
        setShowCompleteTaskDialog(true);
      }

      // 完成番茄钟
      dispatch(completePomodoro());
    }
  }, [timeLeft, isRunning, dispatch, mode, activeTaskId]);

  // 添加计时器效果
  useEffect(() => {
    let timerInterval = null;

    if (isRunning && timeLeft > 0) {
      // 创建定时器每秒减少timeLeft
      timerInterval = setInterval(() => {
        dispatch(updateTimeLeft(timeLeft - 1));
      }, 1000);
    }

    // 清理定时器
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isRunning, timeLeft, dispatch]);

  // 处理开始/暂停按钮
  const handleStartPause = () => {
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  // 处理重置按钮
  const handleReset = () => {
    dispatch(resetTimer());
  };

  // 处理跳过按钮
  const handleSkip = () => {
    dispatch(skipBreak());
  };

  // 处理任务完成
  const handleCompleteTask = () => {
    if (activeTaskId) {
      dispatch(completeTask(activeTaskId));
    }
    setShowCompleteTaskDialog(false);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // 垂直居中
        alignItems: "flex-start", // 水平方向靠左对齐
        minHeight: "calc(100vh - 64px)", // 占满整个视口高度
        py: 5, // 上下内边距
        pl: { xs: 2, md: 4 }, // 左侧内边距
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "900px" }}>
        <Grid container spacing={4} justifyContent="flex-start">
          {/* 计时器部分 */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                ...(mode === "pomodoro"
                  ? { borderTop: `8px solid ${theme.palette.primary.main}` }
                  : { borderTop: `8px solid ${theme.palette.success.main}` }),
                backgroundColor: "rgba(255, 255, 255, 0.3)", // 半透明
                backdropFilter: "blur(10px)", // 毛玻璃效果
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={getModeText()}
                    color={mode === "pomodoro" ? "primary" : "success"}
                    sx={{ fontSize: "1rem", px: 1 }}
                  />
                  <Box>
                    <Tooltip title="重置">
                      <IconButton
                        onClick={handleReset}
                        disabled={timeLeft === getSessionDuration()}
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    {(mode === "shortBreak" || mode === "longBreak") && (
                      <Tooltip title="跳过休息">
                        <IconButton onClick={handleSkip} disabled={!isRunning}>
                          <SkipNext />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography
                    variant="h1"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "4rem", md: "6rem" },
                      color:
                        mode === "pomodoro" ? "primary.main" : "success.main",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={calculateProgress()}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 3,
                    backgroundColor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        mode === "pomodoro"
                          ? theme.palette.primary.main
                          : theme.palette.success.main,
                    },
                  }}
                />

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={isRunning ? <Pause /> : <PlayArrow />}
                    onClick={handleStartPause}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1.1rem",
                    }}
                    color={mode === "pomodoro" ? "primary" : "success"}
                  >
                    {isRunning ? "暂停" : "开始"}
                  </Button>
                </Box>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="textSecondary">
                    {sessionsCompleted} / {totalSessions} 番茄钟已完成
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                  >
                    {[...Array(totalSessions)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor:
                            index < sessionsCompleted
                              ? theme.palette.primary.main
                              : theme.palette.grey[300],
                          mx: 0.5,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 任务选择部分 */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                height: "100%",
                minHeight: 300,
                backgroundColor: "rgba(255, 255, 255, 0.3)", // 半透明
                backdropFilter: "blur(10px)", // 毛玻璃效果
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  当前任务
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TaskSelector />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 任务完成对话框 */}
        <Dialog
          open={showCompleteTaskDialog}
          onClose={() => setShowCompleteTaskDialog(false)}
        >
          <DialogTitle>是否将任务标记为已完成？</DialogTitle>
          <DialogContent>
            <DialogContentText>
              你刚刚完成了一个番茄钟。要将当前任务"{activeTask?.title || ""}
              "标记为已完成吗？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowCompleteTaskDialog(false)}
              color="primary"
            >
              稍后手动标记
            </Button>
            <Button
              onClick={handleCompleteTask}
              color="primary"
              variant="contained"
              startIcon={<CheckCircle />}
            >
              标记为已完成
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TimerPage;

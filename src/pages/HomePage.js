import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import Timer from "../components/timer/Timer";
import { selectFilteredTasks } from "../store/tasksSlice";
import { calculateLastSevenDays } from "../store/statsSlice";
import { addNotification } from "../store/uiSlice";
import { requestNotificationPermission } from "../utils/notification";

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const tasks = useSelector(selectFilteredTasks);
  const activeTasks = tasks.filter((task) => !task.completed);
  const { lastSevenDays } = useSelector((state) => state.stats);
  const { notificationsEnabled } = useSelector((state) => state.settings);
  const totalPomodoros = Object.values(lastSevenDays).reduce(
    (sum, day) => sum + day.count,
    0
  );

  // 在组件加载时计算最近 7 天的统计数据
  useEffect(() => {
    dispatch(calculateLastSevenDays());

    // 如果启用了通知，请求通知权限
    if (notificationsEnabled) {
      requestNotificationPermission().then((granted) => {
        if (!granted) {
          dispatch(
            addNotification({
              message: "通知权限被拒绝，您可能会错过一些重要提醒",
              type: "warning",
            })
          );
        }
      });
    }
  }, [dispatch, notificationsEnabled]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          今日番茄钟
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          专注完成任务，高效管理时间
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 主计时器区域 */}
        <Grid item xs={12} md={8}>
          <Timer />
        </Grid>

        {/* 侧边栏区域 */}
        <Grid item xs={12} md={4}>
          {/* 统计卡片 */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                本周概览
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center", py: 1 }}>
                    <Typography
                      variant="h4"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {totalPomodoros}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      番茄钟
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center", py: 1 }}>
                    <Typography
                      variant="h4"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {activeTasks.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      待完成任务
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  to="/stats"
                  variant="text"
                  size="small"
                  fullWidth
                >
                  查看完整统计
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* 今日任务卡片 */}
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">今日任务</Typography>
                <Chip
                  label={`${activeTasks.length}个待完成`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {activeTasks.length > 0 ? (
                <Box>
                  {activeTasks.slice(0, 3).map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: "background.default",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="subtitle2" noWrap sx={{ mb: 0.5 }}>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                          {task.completedPomodoros} / {task.estimatedPomodoros}{" "}
                          番茄钟
                        </Typography>

                        {task.tags &&
                          task.tags.length > 0 &&
                          !isSmallScreen && (
                            <Chip
                              label={task.tags[0]}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                      </Box>
                    </Box>
                  ))}

                  {activeTasks.length > 3 && (
                    <Button
                      component={Link}
                      to="/tasks"
                      variant="text"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      查看全部 ({activeTasks.length})
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    没有待完成的任务
                  </Typography>
                  <Button
                    component={Link}
                    to="/tasks"
                    variant="contained"
                    size="small"
                  >
                    添加任务
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;

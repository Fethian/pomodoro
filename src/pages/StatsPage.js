import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Timer,
  EmojiEvents,
  LocalFireDepartment,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  calculateLastSevenDays,
  selectProductivityByDay,
  selectMostProductiveDay,
} from "../store/statsSlice";
import { formatDate } from "../utils/formatTime";
import {
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { zhCN } from "date-fns/locale";

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // 从Redux获取状态
  const {
    totalPomodoros,
    totalMinutes,
    pomodoroHistory,
    lastSevenDays,
    streakData,
  } = useSelector((state) => state.stats);

  const { pomodoroDuration } = useSelector((state) => state.settings);
  const tasks = useSelector((state) => state.tasks.tasks);

  // 本地状态
  const [timeRange, setTimeRange] = useState("week");
  const [tabValue, setTabValue] = useState(0);
  const productivityByDay = useSelector(selectProductivityByDay);
  const mostProductiveDay = useSelector(selectMostProductiveDay);

  // 在组件加载时计算最近数据
  useEffect(() => {
    dispatch(calculateLastSevenDays());
  }, [dispatch]);

  // 处理标签页更改
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 处理时间范围更改
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // 计算任务完成情况
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // 获取当前时间范围内的日期
  const getDatesForRange = () => {
    const today = new Date();

    switch (timeRange) {
      case "week":
        const startDay = startOfWeek(today, { weekStartsOn: 1 }); // 从周一开始
        const endDay = endOfWeek(today, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: startDay, end: endDay });

      case "month":
        const startMonth = startOfMonth(today);
        const endMonth = endOfMonth(today);
        return eachDayOfInterval({ start: startMonth, end: endMonth });

      case "year":
        // 显示最近12个月
        const months = [];
        for (let i = 0; i < 12; i++) {
          months.push(new Date(today.getFullYear(), today.getMonth() - i, 1));
        }
        return months.reverse();

      default: // 'week'
        const start = subDays(today, 6);
        return eachDayOfInterval({ start, end: today });
    }
  };

  // 准备图表数据
  const prepareChartData = () => {
    const dates = getDatesForRange();

    // 对于年视图特殊处理
    if (timeRange === "year") {
      const labels = dates.map((date) =>
        format(date, "yyyy年MM月", { locale: zhCN })
      );
      const pomodoroData = dates.map((date) => {
        const yearMonth = format(date, "yyyy-MM");
        let count = 0;

        // 统计该月所有番茄钟
        Object.entries(pomodoroHistory).forEach(([dateStr, data]) => {
          if (dateStr.startsWith(yearMonth)) {
            count += data.count;
          }
        });

        return count;
      });

      return {
        labels,
        pomodoroData,
      };
    }

    // 周和月视图
    const labels = dates.map((date) =>
      timeRange === "month"
        ? format(date, "MM月dd日", { locale: zhCN })
        : format(date, "EEE", { locale: zhCN })
    );

    const pomodoroData = dates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return pomodoroHistory[dateStr] ? pomodoroHistory[dateStr].count : 0;
    });

    return {
      labels,
      pomodoroData,
    };
  };

  // 准备任务统计数据
  const prepareTasksChartData = () => {
    // 统计各优先级完成情况
    const priorityStats = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 },
    };

    tasks.forEach((task) => {
      const priority = task.priority || "medium";
      priorityStats[priority].total += 1;
      if (task.completed) {
        priorityStats[priority].completed += 1;
      }
    });

    // 统计各标签任务数
    const tagCounts = {};
    tasks.forEach((task) => {
      if (task.tags && task.tags.length) {
        task.tags.forEach((tag) => {
          if (!tagCounts[tag]) tagCounts[tag] = 0;
          tagCounts[tag] += 1;
        });
      }
    });

    // 取出前5个最常用的标签
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      priorityStats,
      topTags,
    };
  };

  // 获取图表数据
  const { labels, pomodoroData } = prepareChartData();
  const { priorityStats, topTags } = prepareTasksChartData();

  // 番茄钟统计图表配置
  const pomodoroChartData = {
    labels,
    datasets: [
      {
        label: "番茄钟数",
        data: pomodoroData,
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  // 任务优先级完成率图表配置
  const priorityChartData = {
    labels: ["高优先级", "中优先级", "低优先级"],
    datasets: [
      {
        label: "已完成",
        data: [
          priorityStats.high.completed,
          priorityStats.medium.completed,
          priorityStats.low.completed,
        ],
        backgroundColor: theme.palette.success.main,
      },
      {
        label: "未完成",
        data: [
          priorityStats.high.total - priorityStats.high.completed,
          priorityStats.medium.total - priorityStats.medium.completed,
          priorityStats.low.total - priorityStats.low.completed,
        ],
        backgroundColor: theme.palette.error.main,
      },
    ],
  };

  // 标签分布图表配置
  const tagChartData = {
    labels: topTags.map(([tag]) => tag),
    datasets: [
      {
        data: topTags.map(([, count]) => count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // 图表选项
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "番茄钟统计",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // 定义透明模糊的卡片样式
  const glassCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: 3,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          统计
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          查看你的专注时间和任务完成情况
        </Typography>
      </Box>

      {/* 总体统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...glassCardStyle }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Timer color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">总番茄钟</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                {totalPomodoros}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                总专注时间: {Math.round(totalMinutes / 60)} 小时{" "}
                {totalMinutes % 60} 分钟
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...glassCardStyle }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalFireDepartment
                  color="error"
                  sx={{ fontSize: 40, mr: 1 }}
                />
                <Typography variant="h6">连续记录</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                color="error"
                sx={{ fontWeight: 700 }}
              >
                {streakData.currentStreak}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                最长连续: {streakData.longestStreak} 天
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...glassCardStyle }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmojiEvents color="warning" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">任务完成率</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                color="warning"
                sx={{ fontWeight: 700 }}
              >
                {completionRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                已完成 {completedTasks}/{totalTasks} 个任务
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...glassCardStyle }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BarChartIcon color="success" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">最高效的日子</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                color="success"
                sx={{ fontWeight: 700 }}
              >
                {mostProductiveDay.count || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {mostProductiveDay.date
                  ? formatDate(mostProductiveDay.date)
                  : "暂无数据"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 图表标签页 */}
      <Paper sx={{ mb: 4, ...glassCardStyle }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="番茄钟统计" />
          <Tab label="任务统计" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* 时间范围选择器 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>时间范围</InputLabel>
              <Select
                value={timeRange}
                label="时间范围"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="week">本周</MenuItem>
                <MenuItem value="month">本月</MenuItem>
                <MenuItem value="year">全年</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* 番茄钟统计图表 */}
          {tabValue === 0 && (
            <Box>
              <Bar
                data={pomodoroChartData}
                options={chartOptions}
                height={80}
              />

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ ...glassCardStyle }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        每日番茄钟分布
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ height: 300 }}>
                        <Pie
                          data={{
                            labels: Object.keys(lastSevenDays).map((date) =>
                              format(new Date(date), "EEE", { locale: zhCN })
                            ),
                            datasets: [
                              {
                                data: Object.values(lastSevenDays).map(
                                  (day) => day.count
                                ),
                                backgroundColor: [
                                  "#FF6384",
                                  "#36A2EB",
                                  "#FFCE56",
                                  "#4BC0C0",
                                  "#9966FF",
                                  "#FF9F40",
                                  "#8AC249",
                                ],
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ ...glassCardStyle }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        过去7天趋势
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ height: 300 }}>
                        <Line
                          data={{
                            labels: Object.keys(lastSevenDays).map((date) =>
                              format(new Date(date), "MM/dd")
                            ),
                            datasets: [
                              {
                                label: "番茄钟数",
                                data: Object.values(lastSevenDays).map(
                                  (day) => day.count
                                ),
                                fill: false,
                                borderColor: theme.palette.primary.main,
                                tension: 0.1,
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* 任务统计图表 */}
          {tabValue === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ ...glassCardStyle }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        优先级任务完成情况
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ height: 300 }}>
                        <Bar
                          data={priorityChartData}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                stacked: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                              x: {
                                stacked: true,
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ ...glassCardStyle }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        标签分布
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      {topTags.length > 0 ? (
                        <Box sx={{ height: 300 }}>
                          <Pie
                            data={tagChartData}
                            options={{
                              maintainAspectRatio: false,
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                          <Typography variant="body1" color="textSecondary">
                            暂无标签数据
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ ...glassCardStyle }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        任务完成时间分布
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ height: 300 }}>
                        <Line
                          data={{
                            labels: labels,
                            datasets: [
                              {
                                label: "完成任务数",
                                data: labels.map((_, index) => {
                                  // 根据日期统计已完成的任务数
                                  const date = format(
                                    getDatesForRange()[index],
                                    "yyyy-MM-dd"
                                  );
                                  return tasks.filter(
                                    (task) =>
                                      task.completed &&
                                      task.completedAt &&
                                      new Date(task.completedAt)
                                        .toISOString()
                                        .split("T")[0] === date
                                  ).length;
                                }),
                                fill: false,
                                borderColor: theme.palette.success.main,
                                backgroundColor: theme.palette.success.main,
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* 数据详情 */}
      <Card variant="outlined" sx={{ ...glassCardStyle }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            详细数据
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                平均每日番茄钟
              </Typography>
              <Typography variant="h6">
                {Object.keys(pomodoroHistory).length > 0
                  ? (
                      totalPomodoros / Object.keys(pomodoroHistory).length
                    ).toFixed(1)
                  : "0"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                平均每个任务番茄钟数
              </Typography>
              <Typography variant="h6">
                {completedTasks > 0
                  ? (totalPomodoros / completedTasks).toFixed(1)
                  : "0"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                总专注天数
              </Typography>
              <Typography variant="h6">
                {Object.keys(pomodoroHistory).length}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                首次番茄钟日期
              </Typography>
              <Typography variant="h6">
                {Object.keys(pomodoroHistory).length > 0
                  ? formatDate(Object.keys(pomodoroHistory).sort()[0])
                  : "无记录"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                最近一次番茄钟日期
              </Typography>
              <Typography variant="h6">
                {Object.keys(pomodoroHistory).length > 0
                  ? formatDate(Object.keys(pomodoroHistory).sort().reverse()[0])
                  : "无记录"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                总累计专注时长
              </Typography>
              <Typography variant="h6">
                {Math.floor(totalMinutes / 60)} 小时 {totalMinutes % 60} 分钟
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StatsPage;

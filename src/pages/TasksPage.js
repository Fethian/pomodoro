import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  FilterList,
  Sort,
  Search,
  Flag,
  Label,
  MoreVert,
  PlayArrow,
  Pause,
  CheckCircle,
  CheckCircleOutline,
  Schedule,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { zhCN } from "date-fns/locale";
import {
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  setTasksFilter,
  setTasksSort,
  bulkDeleteTasks,
  archiveCompletedTasks,
  selectFilteredTasks,
} from "../store/tasksSlice";
import { startTimer, pauseTimer } from "../store/timerSlice";
import { formatDate } from "../utils/formatTime";

const TasksPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // 从Redux获取状态
  const tasks = useSelector(selectFilteredTasks);
  const { filter, sortBy, sortDirection } = useSelector((state) => state.tasks);
  const activeTaskId = useSelector((state) => state.timer.activeTaskId);
  const isRunning = useSelector((state) => state.timer.isRunning);

  // 本地状态
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    estimatedPomodoros: 1,
    dueDate: null,
    tags: [],
    priority: "medium",
  });
  const [tagInput, setTagInput] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // 计算标签列表
  const allTags = [...new Set(tasks.flatMap((task) => task.tags || []))];

  // 处理标签页更改
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    switch (newValue) {
      case 0:
        dispatch(setTasksFilter("all"));
        break;
      case 1:
        dispatch(setTasksFilter("active"));
        break;
      case 2:
        dispatch(setTasksFilter("completed"));
        break;
      case 3:
        dispatch(setTasksFilter("today"));
        break;
    }
  };

  // 根据搜索查询过滤任务
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags &&
        task.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  // 处理任务对话框打开
  const handleOpenTaskDialog = (task = null) => {
    if (task) {
      setEditingTask(task.id);
      setNewTask({
        title: task.title,
        description: task.description || "",
        estimatedPomodoros: task.estimatedPomodoros,
        dueDate: task.dueDate,
        tags: task.tags || [],
        priority: task.priority || "medium",
      });
    } else {
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        estimatedPomodoros: 1,
        dueDate: null,
        tags: [],
        priority: "medium",
      });
    }
    setTaskDialogOpen(true);
  };

  // 处理任务对话框关闭
  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setTagInput("");
  };

  // 处理任务保存
  const handleSaveTask = () => {
    if (newTask.title.trim()) {
      if (editingTask) {
        dispatch(
          updateTask({
            id: editingTask,
            ...newTask,
          })
        );
      } else {
        dispatch(addTask(newTask));
      }
      handleCloseTaskDialog();
    }
  };

  // 处理添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // 处理删除标签
  const handleDeleteTag = (tagToDelete) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  // 处理任务删除
  const handleDeleteTask = (taskId) => {
    if (window.confirm("确定要删除此任务吗？")) {
      dispatch(deleteTask(taskId));
    }
  };

  // 处理开始任务
  const handleStartTask = (taskId) => {
    if (activeTaskId === taskId && isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer({ taskId }));
    }
  };

  // 处理完成任务
  const handleCompleteTask = (taskId) => {
    dispatch(completeTask(taskId));
  };

  // 处理排序方式更改
  const handleSortChange = (sortField) => {
    if (sortBy === sortField) {
      // 如果已经按此字段排序，则切换排序方向
      dispatch(
        setTasksSort({
          sortDirection: sortDirection === "asc" ? "desc" : "asc",
        })
      );
    } else {
      // 否则，更改排序字段，使用默认降序排列
      dispatch(
        setTasksSort({
          sortBy: sortField,
          sortDirection: "desc",
        })
      );
    }
    setSortMenuAnchor(null);
  };

  // 处理批量删除选中任务
  const handleBulkDeleteTasks = () => {
    if (
      selectedTaskIds.length > 0 &&
      window.confirm(`确定要删除 ${selectedTaskIds.length} 个选中的任务吗？`)
    ) {
      dispatch(bulkDeleteTasks(selectedTaskIds));
      setSelectedTaskIds([]);
      setSelectMode(false);
    }
  };

  // 处理归档已完成任务
  const handleArchiveCompletedTasks = () => {
    if (window.confirm("确定要归档所有已完成的任务吗？此操作不可撤销。")) {
      dispatch(archiveCompletedTasks());
    }
  };

  // 处理单个任务的选择
  const handleSelectTask = (taskId) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((task) => task.id));
    }
  };

  // 获取优先级文本和颜色
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return { label: "高", color: theme.palette.error.main };
      case "medium":
        return { label: "中", color: theme.palette.warning.main };
      case "low":
        return { label: "低", color: theme.palette.success.main };
      default:
        return { label: "中", color: theme.palette.warning.main };
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            任务
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {/* 选择模式开关 */}
            {filteredTasks.length > 0 && (
              <FormControlLabel
                control={
                  <Switch
                    checked={selectMode}
                    onChange={() => {
                      setSelectMode(!selectMode);
                      if (selectMode) {
                        setSelectedTaskIds([]);
                      }
                    }}
                  />
                }
                label="选择模式"
                sx={{ mr: 1 }}
              />
            )}

            {/* 批量操作按钮 */}
            {selectMode && selectedTaskIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDeleteTasks}
              >
                删除选中 ({selectedTaskIds.length})
              </Button>
            )}

            {/* 添加任务按钮 */}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenTaskDialog()}
            >
              添加任务
            </Button>

            {/* 更多操作按钮 */}
            <Tooltip title="更多操作">
              <IconButton
                onClick={(e) => setActionsMenuAnchor(e.currentTarget)}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* 工具栏 */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          {/* 搜索框 */}
          <TextField
            placeholder="搜索任务..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          {/* 筛选按钮 */}
          <Tooltip title="筛选">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              size="small"
            >
              筛选
              {filter !== "all" &&
                filter !== "active" &&
                filter !== "completed" &&
                filter !== "today" && (
                  <Chip
                    label={
                      filter.startsWith("tag:")
                        ? filter.substring(4)
                        : filter.startsWith("priority:")
                        ? getPriorityInfo(filter.substring(9)).label
                        : filter
                    }
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
            </Button>
          </Tooltip>

          {/* 排序按钮 */}
          <Tooltip title="排序">
            <Button
              variant="outlined"
              startIcon={<Sort />}
              onClick={(e) => setSortMenuAnchor(e.currentTarget)}
              size="small"
              endIcon={
                sortDirection === "asc" ? (
                  <ArrowUpward fontSize="small" />
                ) : (
                  <ArrowDownward fontSize="small" />
                )
              }
            >
              {sortBy === "createdAt"
                ? "创建日期"
                : sortBy === "dueDate"
                ? "截止日期"
                : sortBy === "estimatedPomodoros"
                ? "番茄钟数"
                : sortBy === "priority"
                ? "优先级"
                : sortBy === "title"
                ? "标题"
                : "排序"}
            </Button>
          </Tooltip>
        </Box>

        {/* 标签页 */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="全部" />
          <Tab label="待完成" />
          <Tab label="已完成" />
          <Tab label="今日" />
        </Tabs>
      </Box>

      {/* 任务列表 */}
      {filteredTasks.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: `4px solid ${
                    getPriorityInfo(task.priority).color
                  }`,
                  opacity: task.completed ? 0.8 : 1,
                  position: "relative",
                  ...(selectMode && {
                    outline: selectedTaskIds.includes(task.id)
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                    bgcolor: selectedTaskIds.includes(task.id)
                      ? `${theme.palette.primary.main}10`
                      : "inherit",
                  }),
                }}
                onClick={() => {
                  if (selectMode) {
                    handleSelectTask(task.id);
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  {/* 任务标题和操作 */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed
                          ? "text.secondary"
                          : "text.primary",
                        flexGrow: 1,
                        mr: 1,
                      }}
                    >
                      {task.title}
                    </Typography>

                    {!selectMode && (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {!task.completed && (
                          <Tooltip
                            title={
                              activeTaskId === task.id && isRunning
                                ? "暂停"
                                : "开始专注"
                            }
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleStartTask(task.id)}
                            >
                              {activeTaskId === task.id && isRunning ? (
                                <Pause fontSize="small" />
                              ) : (
                                <PlayArrow fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip
                          title={
                            task.completed ? "标记为未完成" : "标记为已完成"
                          }
                        >
                          <IconButton
                            size="small"
                            color={task.completed ? "default" : "success"}
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            {task.completed ? (
                              <CheckCircleOutline fontSize="small" />
                            ) : (
                              <CheckCircle fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="编辑">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenTaskDialog(task)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="删除">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* 任务描述 */}
                  {task.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}

                  {/* 任务信息 */}
                  <Box sx={{ mt: "auto" }}>
                    {/* 番茄钟信息 */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Schedule
                        fontSize="small"
                        sx={{ mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {task.completedPomodoros} / {task.estimatedPomodoros}{" "}
                        番茄钟
                      </Typography>
                    </Box>

                    {/* 截止日期和优先级 */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      {task.dueDate && (
                        <Chip
                          icon={<Schedule fontSize="small" />}
                          label={formatDate(task.dueDate)}
                          size="small"
                          variant="outlined"
                        />
                      )}

                      <Chip
                        icon={<Flag fontSize="small" />}
                        label={getPriorityInfo(task.priority).label}
                        size="small"
                        sx={{
                          color: getPriorityInfo(task.priority).color,
                          borderColor: getPriorityInfo(task.priority).color,
                        }}
                        variant="outlined"
                      />
                    </Box>

                    {/* 标签 */}
                    {task.tags && task.tags.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {task.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            icon={<Label fontSize="small" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setTasksFilter(`tag:${tag}`));
                              setTabValue(-1); // 取消选中任何标签页
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            没有找到任务
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenTaskDialog()}
            sx={{ mt: 2 }}
          >
            添加新任务
          </Button>
        </Box>
      )}

      {/* 添加/编辑任务对话框 */}
      <Dialog
        open={taskDialogOpen}
        onClose={handleCloseTaskDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingTask ? "编辑任务" : "添加新任务"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                label="任务标题"
                fullWidth
                required
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="描述"
                fullWidth
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>优先级</InputLabel>
                <Select
                  value={newTask.priority}
                  label="优先级"
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <MenuItem value="high">高</MenuItem>
                  <MenuItem value="medium">中</MenuItem>
                  <MenuItem value="low">低</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="预计番茄钟数"
                type="number"
                fullWidth
                value={newTask.estimatedPomodoros}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    estimatedPomodoros: Math.max(
                      1,
                      parseInt(e.target.value) || 1
                    ),
                  })
                }
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={zhCN}
              >
                <DatePicker
                  label="截止日期"
                  value={newTask.dueDate ? new Date(newTask.dueDate) : null}
                  onChange={(date) =>
                    setNewTask({
                      ...newTask,
                      dueDate: date ? date.toISOString() : null,
                    })
                  }
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  标签
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}
                >
                  {newTask.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    placeholder="添加标签..."
                    size="small"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    添加
                  </Button>
                </Box>
              </Box>

              {allTags.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    常用标签:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {allTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          if (!newTask.tags.includes(tag)) {
                            setNewTask({
                              ...newTask,
                              tags: [...newTask.tags, tag],
                            });
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>取消</Button>
          <Button
            onClick={handleSaveTask}
            variant="contained"
            disabled={!newTask.title.trim()}
          >
            {editingTask ? "保存" : "添加"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 筛选菜单 */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            dispatch(setTasksFilter("all"));
            setFilterMenuAnchor(null);
            setTabValue(0);
          }}
          selected={filter === "all"}
        >
          <ListItemText>全部任务</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(setTasksFilter("active"));
            setFilterMenuAnchor(null);
            setTabValue(1);
          }}
          selected={filter === "active"}
        >
          <ListItemText>待完成</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(setTasksFilter("completed"));
            setFilterMenuAnchor(null);
            setTabValue(2);
          }}
          selected={filter === "completed"}
        >
          <ListItemText>已完成</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(setTasksFilter("today"));
            setFilterMenuAnchor(null);
            setTabValue(3);
          }}
          selected={filter === "today"}
        >
          <ListItemText>今日任务</ListItemText>
        </MenuItem>

        <Divider />

        <Typography variant="body2" color="textSecondary" sx={{ px: 2, py: 1 }}>
          按优先级
        </Typography>
        {["high", "medium", "low"].map((priority) => (
          <MenuItem
            key={priority}
            onClick={() => {
              dispatch(setTasksFilter(`priority:${priority}`));
              setFilterMenuAnchor(null);
              setTabValue(-1);
            }}
            selected={filter === `priority:${priority}`}
          >
            <ListItemIcon>
              <Flag sx={{ color: getPriorityInfo(priority).color }} />
            </ListItemIcon>
            <ListItemText>{getPriorityInfo(priority).label}优先级</ListItemText>
          </MenuItem>
        ))}

        {allTags.length > 0 && (
          <>
            <Divider />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ px: 2, py: 1 }}
            >
              按标签
            </Typography>
            {allTags.map((tag) => (
              <MenuItem
                key={tag}
                onClick={() => {
                  dispatch(setTasksFilter(`tag:${tag}`));
                  setFilterMenuAnchor(null);
                  setTabValue(-1);
                }}
                selected={filter === `tag:${tag}`}
              >
                <ListItemIcon>
                  <Label />
                </ListItemIcon>
                <ListItemText>{tag}</ListItemText>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      {/* 排序菜单 */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => handleSortChange("createdAt")}
          selected={sortBy === "createdAt"}
        >
          <ListItemText>创建日期</ListItemText>
          {sortBy === "createdAt" && (
            <ListItemIcon sx={{ justifyContent: "flex-end" }}>
              {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </ListItemIcon>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => handleSortChange("dueDate")}
          selected={sortBy === "dueDate"}
        >
          <ListItemText>截止日期</ListItemText>
          {sortBy === "dueDate" && (
            <ListItemIcon sx={{ justifyContent: "flex-end" }}>
              {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </ListItemIcon>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => handleSortChange("title")}
          selected={sortBy === "title"}
        >
          <ListItemText>任务标题</ListItemText>
          {sortBy === "title" && (
            <ListItemIcon sx={{ justifyContent: "flex-end" }}>
              {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </ListItemIcon>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => handleSortChange("priority")}
          selected={sortBy === "priority"}
        >
          <ListItemText>优先级</ListItemText>
          {sortBy === "priority" && (
            <ListItemIcon sx={{ justifyContent: "flex-end" }}>
              {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </ListItemIcon>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => handleSortChange("estimatedPomodoros")}
          selected={sortBy === "estimatedPomodoros"}
        >
          <ListItemText>番茄钟数</ListItemText>
          {sortBy === "estimatedPomodoros" && (
            <ListItemIcon sx={{ justifyContent: "flex-end" }}>
              {sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </ListItemIcon>
          )}
        </MenuItem>
      </Menu>

      {/* 更多操作菜单 */}
      <Menu
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={() => setActionsMenuAnchor(null)}
      >
        {filteredTasks.length > 0 && (
          <MenuItem
            onClick={() => {
              setSelectMode(!selectMode);
              if (selectMode) {
                setSelectedTaskIds([]);
              }
              setActionsMenuAnchor(null);
            }}
          >
            <ListItemIcon>
              {selectMode ? <CheckCircle /> : <CheckCircleOutline />}
            </ListItemIcon>
            <ListItemText>
              {selectMode ? "退出选择模式" : "进入选择模式"}
            </ListItemText>
          </MenuItem>
        )}

        {selectMode && filteredTasks.length > 0 && (
          <MenuItem
            onClick={() => {
              handleSelectAll();
              setActionsMenuAnchor(null);
            }}
          >
            <ListItemIcon>
              <CheckCircle />
            </ListItemIcon>
            <ListItemText>
              {selectedTaskIds.length === filteredTasks.length
                ? "取消全选"
                : "全选"}
            </ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem
          onClick={() => {
            handleArchiveCompletedTasks();
            setActionsMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>归档已完成任务</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default TasksPage;

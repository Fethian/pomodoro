import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Add,
  CheckCircleOutline,
  Search,
  ArrowForward,
  Timer as TimerIcon,
  Refresh,
} from "@mui/icons-material";
import { setActiveTask, startTimer } from "../../store/timerSlice";
import { addTask } from "../../store/tasksSlice";

const TaskSelector = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [showAllTasks, setShowAllTasks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const { activeTaskId } = useSelector((state) => state.timer);
  const tasks = useSelector((state) => state.tasks.tasks) || [];
  const activeTasks = Array.isArray(tasks)
    ? tasks.filter((task) => !task.completed)
    : [];

  const filteredTasks = activeTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTasks = showAllTasks
    ? filteredTasks
    : filteredTasks.slice(0, 5) || [];

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  const handleSelectTask = (taskId) => {
    dispatch(setActiveTask(taskId));
  };

  const handleStartTaskNow = (taskId) => {
    dispatch(setActiveTask(taskId));
    dispatch(startTimer());
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {activeTaskId ? (
        <Box sx={{ mb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: `${theme.palette.primary.main}10`,
              border: `1px solid ${theme.palette.primary.main}40`,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary" gutterBottom>
              正在专注:
            </Typography>
            <Typography variant="h6" component="div" noWrap>
              {activeTask?.title || "选择一个任务"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <TimerIcon
                fontSize="small"
                sx={{ color: "text.secondary", mr: 0.5 }}
              />
              <Typography variant="body2" color="textSecondary">
                {activeTask?.completedPomodoros || 0} /{" "}
                {activeTask?.estimatedPomodoros || 1} 番茄钟
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<Refresh />}
              onClick={() => dispatch(setActiveTask(null))}
              sx={{ mt: 1.5 }}
            >
              更换任务
            </Button>
          </Paper>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 1.5, display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="搜索任务..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {filteredTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                没有找到待完成的任务
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setQuickAddOpen(true)}
                sx={{ mt: 1 }}
              >
                添加新任务
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ mb: 2, flex: 1, overflow: "auto" }}>
                {displayedTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    button
                    onClick={() => handleSelectTask(task.id)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <TimerIcon
                            fontSize="small"
                            sx={{ mr: 0.5, fontSize: "0.875rem" }}
                          />
                          {task.completedPomodoros || 0} /{" "}
                          {task.estimatedPomodoros || 1}
                        </Box>
                      }
                      primaryTypographyProps={{ noWrap: true }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleStartTaskNow(task.id)}
                        title="开始专注此任务"
                      >
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {filteredTasks.length > 5 && !showAllTasks && (
                <Button
                  fullWidth
                  onClick={() => setShowAllTasks(true)}
                  sx={{ mb: 2 }}
                >
                  显示全部 ({filteredTasks.length} 个任务)
                </Button>
              )}

              {showAllTasks && (
                <Button
                  fullWidth
                  onClick={() => setShowAllTasks(false)}
                  sx={{ mb: 2 }}
                >
                  收起
                </Button>
              )}
            </>
          )}

          <Divider sx={{ my: 1 }} />

          <Button
            variant="contained"
            fullWidth
            startIcon={<Add />}
            onClick={() => setQuickAddOpen(true)}
          >
            添加新任务
          </Button>
        </>
      )}

      {/* 快速添加任务对话框 */}
      <QuickAddTask
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </Box>
  );
};

// 快速添加任务表单
const QuickAddTask = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      setIsSubmitting(true);

      const newTask = {
        title: title.trim(),
        description: "",
        estimatedPomodoros: estimatedPomodoros,
        completedPomodoros: 0,
        tags: [],
        priority: "medium",
        completed: false,
        createdAt: new Date().toISOString(),
      };

      dispatch(addTask(newTask));

      setTitle("");
      setEstimatedPomodoros(1);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>添加新任务</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="任务名称"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          sx={{ mb: 2, mt: 1 }}
        />

        <TextField
          label="预计番茄钟数"
          type="number"
          value={estimatedPomodoros}
          onChange={(e) =>
            setEstimatedPomodoros(Math.max(1, parseInt(e.target.value) || 1))
          }
          variant="outlined"
          InputProps={{ inputProps: { min: 1 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskSelector;

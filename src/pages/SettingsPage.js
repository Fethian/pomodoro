import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Slider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  useTheme,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  VolumeUp,
  VolumeDown,
  Refresh,
  DeleteForever,
  InfoOutlined,
  ColorLens,
  PlayCircleOutline,
} from "@mui/icons-material";
import { updateSettingsAndSync, resetSettings } from "../store/settingsSlice";
import { resetStats } from "../store/statsSlice";
import { clearState, loadState } from "../utils/localStorage";

// 颜色选项
const colorOptions = [
  { value: "#ff5252", label: "番茄红" },
  { value: "#3f51b5", label: "靛蓝色" },
  { value: "#2196f3", label: "蓝色" },
  { value: "#4caf50", label: "绿色" },
  { value: "#ff9800", label: "橙色" },
  { value: "#9c27b0", label: "紫色" },
];

// 背景图片选项
const backgroundImages = [
  "/backgrounds/图片123.jpg",
  "/backgrounds/图片124.jpg",
  // ... 其他图片
  "/backgrounds/图片138.jpg",
];

// 定义透明模糊的卡片样式
const glassCardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(10px)",
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const SettingsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // 从Redux获取设置
  const settings = useSelector((state) => state.settings);

  // 本地状态
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [resetStatsDialogOpen, setResetStatsDialogOpen] = useState(false);
  const [resetSettingsDialogOpen, setResetSettingsDialogOpen] = useState(false);
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  // 处理设置变更
  const handleSettingChange = (setting, value) => {
    setLocalSettings({
      ...localSettings,
      [setting]: value,
    });
    setSettingsChanged(true);
  };

  // 保存设置
  const handleSaveSettings = () => {
    dispatch(updateSettingsAndSync(localSettings));
    setSettingsChanged(false);
  };

  // 重置统计数据
  const handleResetStats = () => {
    dispatch(resetStats());
    setResetStatsDialogOpen(false);
  };

  // 重置设置
  const handleResetSettings = () => {
    dispatch(resetSettings());
    setLocalSettings({ ...settings });
    setResetSettingsDialogOpen(false);
    setSettingsChanged(false);
  };

  // 清除所有数据
  const handleClearAllData = () => {
    clearState();
    window.location.reload();
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
          设置
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          自定义番茄钟和应用程序设置
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 番茄钟设置 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, ...glassCardStyle }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                番茄钟设置
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    番茄钟时长 ({localSettings.pomodoroDuration} 分钟)
                  </Typography>
                  <Slider
                    value={localSettings.pomodoroDuration}
                    min={5}
                    max={60}
                    step={5}
                    marks={[
                      { value: 5, label: "5" },
                      { value: 25, label: "25" },
                      { value: 60, label: "60" },
                    ]}
                    valueLabelDisplay="auto"
                    onChange={(e, value) =>
                      handleSettingChange("pomodoroDuration", value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>
                    短休息时长 ({localSettings.shortBreakDuration} 分钟)
                  </Typography>
                  <Slider
                    value={localSettings.shortBreakDuration}
                    min={1}
                    max={15}
                    step={1}
                    marks={[
                      { value: 1, label: "1" },
                      { value: 5, label: "5" },
                      { value: 15, label: "15" },
                    ]}
                    valueLabelDisplay="auto"
                    onChange={(e, value) =>
                      handleSettingChange("shortBreakDuration", value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>
                    长休息时长 ({localSettings.longBreakDuration} 分钟)
                  </Typography>
                  <Slider
                    value={localSettings.longBreakDuration}
                    min={5}
                    max={30}
                    step={5}
                    marks={[
                      { value: 5, label: "5" },
                      { value: 15, label: "15" },
                      { value: 30, label: "30" },
                    ]}
                    valueLabelDisplay="auto"
                    onChange={(e, value) =>
                      handleSettingChange("longBreakDuration", value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>
                    长休息间隔 (每 {localSettings.longBreakInterval} 个番茄钟)
                  </Typography>
                  <Slider
                    value={localSettings.longBreakInterval}
                    min={2}
                    max={6}
                    step={1}
                    marks={[
                      { value: 2, label: "2" },
                      { value: 4, label: "4" },
                      { value: 6, label: "6" },
                    ]}
                    valueLabelDisplay="auto"
                    onChange={(e, value) =>
                      handleSettingChange("longBreakInterval", value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localSettings.autoStartBreaks}
                          onChange={(e) =>
                            handleSettingChange(
                              "autoStartBreaks",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="番茄钟结束后自动开始休息"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localSettings.autoStartPomodoros}
                          onChange={(e) =>
                            handleSettingChange(
                              "autoStartPomodoros",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="休息结束后自动开始下一个番茄钟"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 通知设置 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, ...glassCardStyle }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                通知
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localSettings.notificationsEnabled}
                          onChange={(e) =>
                            handleSettingChange(
                              "notificationsEnabled",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="启用浏览器通知"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 自定义外观 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, ...glassCardStyle }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                自定义外观
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>主题颜色</InputLabel>
                    <Select
                      value={localSettings.primaryColor}
                      label="主题颜色"
                      onChange={(e) =>
                        handleSettingChange("primaryColor", e.target.value)
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: selected,
                              mr: 1,
                            }}
                          />
                          {colorOptions.find(
                            (option) => option.value === selected
                          )?.label || selected}
                        </Box>
                      )}
                    >
                      {colorOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: option.value,
                              mr: 1,
                            }}
                          />
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>语言</InputLabel>
                    <Select
                      value={localSettings.language}
                      label="语言"
                      onChange={(e) =>
                        handleSettingChange("language", e.target.value)
                      }
                    >
                      <MenuItem value="zh-CN">简体中文</MenuItem>
                      <MenuItem value="en-US">English (美国英语)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 数据管理 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...glassCardStyle }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                数据管理
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Refresh />}
                    fullWidth
                    onClick={() => setResetSettingsDialogOpen(true)}
                  >
                    重置所有设置
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<Refresh />}
                    fullWidth
                    onClick={() => setResetStatsDialogOpen(true)}
                  >
                    重置统计数据
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForever />}
                    fullWidth
                    onClick={() => setClearDataDialogOpen(true)}
                  >
                    清除所有数据
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 背景图片选择部分 */}
        <Grid item xs={12}>
          <Card sx={{ ...glassCardStyle }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                背景设置
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  选择背景图片
                </Typography>

                <Grid container spacing={2}>
                  {/* 动态生成背景选项 */}
                  {Array.from({ length: 16 }, (_, i) => i + 123).map((num) => (
                    <Grid item xs={6} sm={4} md={3} key={num}>
                      <Box
                        sx={{
                          width: "100%",
                          paddingTop: "56.25%", // 16:9 比例
                          backgroundImage: `url(/backgrounds/图片${num}.jpg)`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: 1,
                          cursor: "pointer",
                          border:
                            localStorage.getItem("selectedBackground") ===
                            `/backgrounds/图片${num}.jpg`
                              ? "3px solid white"
                              : "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          "&:hover": {
                            opacity: 0.9,
                            transform: "scale(1.03)",
                            transition: "all 0.2s",
                          },
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "selectedBackground",
                            `/backgrounds/图片${num}.jpg`
                          );
                          window.location.reload(); // 立即应用新背景
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 保存按钮 */}
      {settingsChanged && (
        <Box
          sx={{ position: "sticky", bottom: 16, textAlign: "center", mt: 3 }}
        >
          <Card
            sx={{
              display: "inline-block",
              boxShadow: theme.shadows[8],
              ...glassCardStyle,
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                你的设置有变更，记得保存！
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setLocalSettings({ ...settings });
                    setSettingsChanged(false);
                  }}
                >
                  取消
                </Button>
                <Button variant="contained" onClick={handleSaveSettings}>
                  保存设置
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* 重置统计对话框 */}
      <Dialog
        open={resetStatsDialogOpen}
        onClose={() => setResetStatsDialogOpen(false)}
      >
        <DialogTitle>重置统计数据</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要重置所有统计数据吗？这将删除所有番茄钟历史记录和统计信息。此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetStatsDialogOpen(false)}>取消</Button>
          <Button onClick={handleResetStats} color="error">
            重置
          </Button>
        </DialogActions>
      </Dialog>

      {/* 重置设置对话框 */}
      <Dialog
        open={resetSettingsDialogOpen}
        onClose={() => setResetSettingsDialogOpen(false)}
      >
        <DialogTitle>重置所有设置</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要将所有设置恢复到默认值吗？此操作不会影响你的任务和统计数据。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetSettingsDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={handleResetSettings} color="warning">
            重置
          </Button>
        </DialogActions>
      </Dialog>

      {/* 清除所有数据对话框 */}
      <Dialog
        open={clearDataDialogOpen}
        onClose={() => setClearDataDialogOpen(false)}
      >
        <DialogTitle>清除所有数据</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要清除所有数据吗？这将删除所有任务、统计数据和设置。此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDataDialogOpen(false)}>取消</Button>
          <Button onClick={handleClearAllData} color="error">
            清除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;

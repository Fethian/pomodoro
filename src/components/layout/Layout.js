import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Timer as TimerIcon,
  FormatListBulleted as TasksIcon,
  BarChart as StatsIcon,
  Settings as SettingsIcon,
  Close,
} from "@mui/icons-material";

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: "番茄钟", path: "/timer", icon: <TimerIcon /> },
    { label: "任务", path: "/tasks", icon: <TasksIcon /> },
    { label: "统计", path: "/stats", icon: <StatsIcon /> },
    { label: "设置", path: "/settings", icon: <SettingsIcon /> },
  ];

  const drawerWidth = 170;

  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="h6" component="div">
          番茄钟
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            selected={isActive(item.path)}
            sx={{
              "&.Mui-selected": {
                bgcolor: `${theme.palette.primary.main}15`,
                borderRight: `3px solid ${theme.palette.primary.main}`,
              },
              "&.Mui-selected:hover": {
                bgcolor: `${theme.palette.primary.main}25`,
              },
            }}
          >
            <ListItemIcon
              sx={{ color: isActive(item.path) ? "primary.main" : "inherit" }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* 侧边栏 */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            top: 0, // 直接从顶部开始，不再留出AppBar的空间
            height: "100%", // 充满整个高度
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
          display: { xs: "none", md: "block" }, // 在移动设备上隐藏侧边栏，因为没有开关按钮了
        }}
      >
        {drawer}
      </Drawer>

      {/* 在移动设备上添加一个简单的菜单按钮 */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(5px)",
            borderRadius: "50%",
          }}
        >
          <IconButton color="primary" onClick={handleDrawerToggle} size="large">
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* 主要内容 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 3, // 减小顶部padding，因为没有导航栏了
          ml: { md: `${drawerWidth}px` },
          minHeight: "100vh",
          backgroundColor: "transparent",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;

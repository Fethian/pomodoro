import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";

import Layout from "./components/layout/Layout";
import TimerPage from "./pages/TimerPage";
import TasksPage from "./pages/TasksPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import BackgroundImage from "./components/common/BackgroundImage";

import { requestNotificationPermission } from "./utils/notification";

function App() {
  const dispatch = useDispatch();

  // 应用启动时请求通知权限
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <BackgroundImage>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          // 移除背景色，使其透明
          background: "transparent",
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/timer" replace />} />
            <Route path="timer" element={<TimerPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Box>
    </BackgroundImage>
  );
}

export default App;

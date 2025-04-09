import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const BackgroundImage = ({ children }) => {
  // 从public/backgrounds目录读取背景图片
  const [background, setBackground] = useState("");

  useEffect(() => {
    // 从localStorage获取保存的背景，或使用默认背景
    const savedBackground =
      localStorage.getItem("selectedBackground") || "/backgrounds/图片123.jpg";
    setBackground(savedBackground);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // 这里是全屏背景设置
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -1,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default BackgroundImage;

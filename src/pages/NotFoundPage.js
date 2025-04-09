import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ mb: 2, fontSize: { xs: "4rem", md: "6rem" } }}
        >
          404
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
          页面未找到
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: "600px" }}
        >
          很抱歉，您要查找的页面不存在或已被移动。请返回首页继续您的番茄钟之旅。
        </Typography>
        <Button variant="contained" component={Link} to="/" size="large">
          返回首页
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;

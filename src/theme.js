import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

// 创建应用主题
const createAppTheme = (primaryColor) => {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor || "#ff5252",
      },
      secondary: {
        main: "#3f51b5",
      },
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
};

// 默认主题
const theme = createAppTheme("#ff5252");

export default theme;

// 主题选择器组件
export const useAppTheme = () => {
  const primaryColor = useSelector((state) => state.settings?.primaryColor);
  return createAppTheme(primaryColor);
};

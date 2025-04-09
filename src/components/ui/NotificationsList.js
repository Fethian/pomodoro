import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { Clear, CheckCircle, Info, Warning, Error } from "@mui/icons-material";
import { removeNotification, clearAllNotifications } from "../../store/uiSlice";
import { formatDateTime } from "../../utils/formatTime";

const getNotificationIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle color="success" />;
    case "warning":
      return <Warning color="warning" />;
    case "error":
      return <Error color="error" />;
    case "info":
    default:
      return <Info color="info" />;
  }
};

const NotificationsList = ({ onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.ui.notifications);

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box>
      {notifications.length > 0 ? (
        <>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveNotification(notification.id)}
                  >
                    <Clear />
                  </IconButton>
                }
                sx={{ p: 0, mb: 1 }}
              >
                <Alert
                  severity={notification.type}
                  icon={getNotificationIcon(notification.type)}
                  sx={{ width: "100%" }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={formatDateTime(notification.timestamp)}
                  />
                </Alert>
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            onClick={handleClearAll}
            fullWidth
            sx={{ mt: 2 }}
          >
            清除所有通知
          </Button>
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            没有通知
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotificationsList;

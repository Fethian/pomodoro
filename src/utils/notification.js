// 处理浏览器通知的工具函数

// 请求通知权限
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// 发送通知
export const sendNotification = (title, options = {}) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    console.log("Notifications not supported or permission not granted");
    return null;
  }

  // 合并默认选项
  const notificationOptions = {
    badge: "/favicon.ico",
    icon: "/logo192.png",
    vibrate: [200, 100, 200],
    ...options,
  };

  try {
    const notification = new Notification(title, notificationOptions);

    // 设置点击事件
    if (options.onClick) {
      notification.onclick = options.onClick;
    } else {
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // 设置关闭事件
    if (options.onClose) {
      notification.onclose = options.onClose;
    }

    // 自动关闭
    if (options.timeout) {
      setTimeout(() => {
        notification.close();
      }, options.timeout);
    }

    return notification;
  } catch (error) {
    console.error("Error showing notification:", error);
    return null;
  }
};

// 移除了playSound函数，不再支持音效功能

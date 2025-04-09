const fs = require("fs");
const path = require("path");

// 创建一个最小的图标文件
const createEmptyIcon = (filename) => {
  // 创建一个1x1像素的透明PNG
  const buffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  fs.writeFileSync(path.join(__dirname, filename), buffer);
  console.log(`Created ${filename}`);
};

// 创建图标文件
createEmptyIcon("favicon.ico");
createEmptyIcon("logo192.png");
createEmptyIcon("logo512.png");

console.log("Icons created successfully");

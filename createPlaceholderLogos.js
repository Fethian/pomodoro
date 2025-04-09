const fs = require("fs");
const { createCanvas } = require("canvas");

// 创建一个简单的番茄形状的favicon
function createFavicon() {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext("2d");

  // 画一个红色圆形
  ctx.fillStyle = "#ff5252";
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  // 添加一个绿色叶子
  ctx.fillStyle = "#4caf50";
  ctx.beginPath();
  ctx.ellipse(32, 15, 8, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("favicon.ico", buffer);
}

// 创建logo (192x192)
function createLogo192() {
  const canvas = createCanvas(192, 192);
  const ctx = canvas.getContext("2d");

  // 画一个红色圆形
  ctx.fillStyle = "#ff5252";
  ctx.beginPath();
  ctx.arc(96, 96, 90, 0, Math.PI * 2);
  ctx.fill();

  // 添加绿色叶子
  ctx.fillStyle = "#4caf50";
  ctx.beginPath();
  ctx.ellipse(96, 45, 24, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("logo192.png", buffer);
}

// 创建logo (512x512)
function createLogo512() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext("2d");

  // 画一个红色圆形
  ctx.fillStyle = "#ff5252";
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fill();

  // 添加绿色叶子
  ctx.fillStyle = "#4caf50";
  ctx.beginPath();
  ctx.ellipse(256, 120, 64, 120, 0, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("logo512.png", buffer);
}

// 注意：要运行此脚本，需要安装canvas包: npm install canvas
console.log("创建占位图标...");
createFavicon();
createLogo192();
createLogo512();
console.log("图标创建完成");

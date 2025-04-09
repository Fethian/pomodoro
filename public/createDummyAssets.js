const fs = require("fs");
const path = require("path");

// 确保目录存在
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 创建所需目录
const publicDir = path.join(__dirname);
const soundsDir = path.join(publicDir, "sounds");

ensureDir(soundsDir);

// 创建简单的音效文件
const createEmptyAudioFile = (fileName) => {
  // 创建一个非常小的MP3文件（实际上只是文件头）
  // 这不是真正可播放的文件，只是为了测试
  fs.writeFileSync(
    path.join(soundsDir, `${fileName}.mp3`),
    Buffer.from([0xff, 0xfb, 0x90, 0x44, 0x00]), // 简单MP3文件头
    "binary"
  );
};

// 创建简单图标文件
const createDummyImage = (fileName, size = 64) => {
  // 创建一个简单的PNG文件
  const buffer = Buffer.alloc(100); // 只是一个假文件
  fs.writeFileSync(path.join(publicDir, fileName), buffer);
};

// 创建音效文件
["bell", "digital", "kitchen", "piano", "tick1", "tick2", "water"].forEach(
  (sound) => createEmptyAudioFile(sound)
);

// 创建图标文件
createDummyImage("favicon.ico");
createDummyImage("logo192.png");
createDummyImage("logo512.png");

console.log("创建了必要的资源文件");

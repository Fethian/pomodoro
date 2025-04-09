# 番茄钟应用程序

这是一个功能完整的番茄钟应用程序，包含任务管理、统计分析和自定义设置功能。

## 运行说明

### 前提条件

确保你的电脑上已安装：

- Node.js (推荐 v14.0.0 或更高版本)
- npm (通常随 Node.js 一起安装)

### 安装依赖

1. 打开命令行工具（如 CMD、PowerShell 或 Terminal）
2. 进入项目目录：

```bash
cd d:\webstorm\pomodoro
```

3. 安装项目依赖：

```bash
npm install
```

这将安装 `package.json` 中列出的所有必要依赖项，包括 React、Redux、Material UI 等。

> **注意**：安装过程中，你会看到终端中出现一个旋转的 L 形状图案或其他加载指示器，这表示 npm 正在下载和安装依赖包。依赖较多，安装可能需要几分钟时间，请耐心等待安装完成。安装完成后，指示器会停止，终端会显示安装结果。

> **成功标志**：安装成功完成后，你会看到类似"added X packages, and audited Y packages in Z time"的消息。即使有一些警告信息（如"npm warn deprecated"），只要没有报错，就表示安装已成功完成，可以继续下一步。

### 启动应用程序前的必要文件

在启动应用程序之前，需要确保项目结构完整。根据错误信息，项目缺少 `public/index.html` 文件。请先创建以下必要的目录和文件：

1. 创建 `public` 目录：

```bash
mkdir public
```

2. 在 `public` 目录中创建 `index.html` 文件，内容如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#ff5252" />
    <meta
      name="description"
      content="番茄钟 - 一个帮助您提高工作效率的时间管理工具"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <title>番茄钟</title>
  </head>
  <body>
    <noscript>您需要启用JavaScript才能运行此应用。</noscript>
    <div id="root"></div>
  </body>
</html>
```

3. 同时创建 `public/manifest.json` 文件：

```json
{
  "short_name": "番茄钟",
  "name": "番茄钟时间管理应用",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#ff5252",
  "background_color": "#ffffff"
}
```

4. 创建必要的图标文件或使用占位图标：
   - 在 `public` 目录中放置 `favicon.ico`
   - 在 `public` 目录中放置 `logo192.png` 和 `logo512.png`

完成上述步骤后，再次尝试启动应用：

```bash
npm start
```

## 如何启动应用

1. 打开命令提示符或 PowerShell
2. 进入项目目录：
   ```bash
   cd d:\webstorm\pomodoro
   ```
3. 启动开发服务器：
   ```bash
   npm start
   ```
4. 应用会自动在默认浏览器中打开，地址是：http://localhost:3000

如果浏览器没有自动打开，请手动打开浏览器并访问 http://localhost:3000

## 常见问题解决

- 如果提示"端口 3000 已被占用"，可以使用其他端口启动：
  ```bash
  set PORT=3001 && npm start
  ```
- 如果遇到其他启动问题，可以尝试清除缓存后重启：

  ```bash
  npm cache clean --force
  npm start
  ```

- 确保已安装所有依赖：
  ```bash
  npm install
  ```

### 启动应用程序

在项目目录下，运行以下命令启动开发服务器：

```bash
npm start
```

应用程序将在开发模式下启动，并自动在默认浏览器中打开 http://localhost:3000

> **注意**：安装依赖后可能会看到一些关于过时包的警告（如`npm warn deprecated`），这些通常不会影响应用程序的正常运行。这些是底层依赖包的警告，在 React 应用中很常见。你可以安全地忽略这些警告，继续使用应用程序。

> **安全提示**：如果看到脆弱性警告，通常可以运行`npm audit fix`尝试修复，但对于此项目，不建议使用`--force`选项，因为它可能会破坏依赖关系。大多数脆弱性与开发工具相关，不会影响生产应用的安全性。

### 构建生产版本

如果你想创建一个生产优化版本，可以运行：

```bash
npm run build
```

这将在 `build` 文件夹中生成优化后的静态文件，可以部署到任何静态网站托管服务。

## 部署番茄钟应用

### 部署到 GitHub Pages

#### 正确的部署命令

```bash
# 初始化Git仓库（如果尚未初始化）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 重命名分支为main
git branch -M main

# 添加远程仓库（使用您的GitHub用户名）
git remote add origin https://github.com/Fethian/pomodoro.git

# 推送代码到GitHub
git push -u origin main
```

#### 如果遇到连接问题

如果仍然遇到"Failed to connect to github.com port 443"错误，可以尝试以下解决方法：

1. **检查网络连接**：确保您可以正常访问 GitHub 网站

2. **设置 HTTP 代理**（如果您使用代理）：

```bash
git config --global http.proxy http://proxyserver:port
```

3. **尝试使用 SSH 连接**：

```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加SSH密钥到GitHub账号（请先复制~/.ssh/id_ed25519.pub的内容并添加到GitHub设置中）

# 更改远程仓库URL为SSH格式
git remote set-url origin git@github.com:Fethian/pomodoro.git

# 再次尝试推送
git push -u origin main
```

### 使用现有 SSH 密钥连接 GitHub

如果您之前已经设置过 SSH 密钥，可以按照以下步骤检查并使用它：

## 1. 检查现有的 SSH 密钥

```bash
# 查看是否有现有的 SSH 密钥
ls -la ~/.ssh
```

如果看到 `id_rsa.pub`、`id_ed25519.pub` 等文件，说明已经有密钥。

## 2. 确认 SSH 密钥已添加到 GitHub

您可以访问 [GitHub SSH 设置页面](https://github.com/settings/keys) 查看您的密钥是否已添加。

如果没有添加，复制您的公钥：

```bash
# 查看并复制公钥内容
cat ~/.ssh/id_rsa.pub   # 或 cat ~/.ssh/id_ed25519.pub
```

然后将公钥内容添加到 GitHub 账户设置中。

## 3. 使用 SSH 而非 HTTPS 推送代码

将远程仓库从 HTTPS 切换到 SSH 格式：

```bash
# 将远程仓库 URL 更改为 SSH 格式
git remote set-url origin git@github.com:Fethian/pomodoro.git

# 验证更改
git remote -v

# 推送代码
git push -u origin main
```

使用 SSH 通常能解决 HTTPS 连接问题，同时不需要每次都输入用户名和密码。

部署后，记得在 package.json 中添加主页配置：

```json
{
  "homepage": "https://Fethian.github.io/pomodoro",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

然后运行:

```bash
npm install --save-dev gh-pages
npm run deploy
```

### 替代部署选项

#### 选项 1：使用 Netlify (推荐，更简单)

1. 注册 Netlify 账号：https://app.netlify.com/signup
2. 安装 netlify-cli：

```bash
npm install -g netlify-cli
```

3. 登录和部署：

```bash
# 构建项目
npm run build

# 登录Netlify
netlify login

# 部署
netlify deploy --prod
```

按照提示选择或创建站点，几分钟后您会获得一个类似 `https://your-site-name.netlify.app` 的链接。

#### 选项 2：使用 Vercel

1. 注册 Vercel 账号：https://vercel.com/signup
2. 安装 Vercel CLI：

```bash
npm install -g vercel
```

3. 部署：

```bash
vercel login
vercel
```

几分钟后您会获得一个类似 `https://pomodoro-xxxx.vercel.app` 的链接。

#### 选项 3：本地展示方法

如果只是临时展示给朋友看，可以使用：

```bash
# 安装serve工具
npm install -g serve

# 构建项目
npm run build

# 启动本地服务器
serve -s build

# 找到局域网IP地址
ipconfig
# 或
ip addr

# 通知朋友访问 http://你的IP:5000
```

朋友需要与您在同一 WiFi 网络才能访问。

## 功能特点

- 高度可定制的番茄钟计时器
- 任务管理系统（添加、编辑、删除任务）
- 详细的统计和数据分析
- 自定义设置（计时长度、声音、主题等）
- 响应式设计，适配各种设备尺寸

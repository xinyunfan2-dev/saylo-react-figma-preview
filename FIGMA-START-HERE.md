# 在 Figma Make 中打开 Saylo 原型

本项目是一个可运行的 React + Vite 静态交互原型，包含 Home、Hermes「我的写法」、Profile 三页和浅色/深色主题。压缩包不含 `node_modules`、构建缓存、账号信息或密钥。

## 导入方式

1. 解压 `saylo-react-ui-figma.zip` 到本地文件夹。
2. 在 Figma 桌面 Beta 中新建 Figma Make 文件。
3. 在 Make 提示区选择 **Open a folder**，选择解压后的 `saylo-react-ui` 文件夹，再开启新 session。
4. Make 首次初始化会安装 `package.json` 中的依赖并启动 Vite。项目附带 `.figma/make` 的 setup/install/dev/verify/env 配置。
5. 在 Figma Make 对话中描述你要调整的视觉和交互。

如果你只是希望把当前界面复制成 Figma Design 里的可编辑图层：先在浏览器打开页面和目标状态，再在 Figma Make 预览里使用 **Copy design**。官方文档说明复制的是当前预览状态，不会把整个 React 项目变成 Figma Design 中的功能原型。

## 本地运行

```bash
npm ci
npm run dev
```

## 设计说明

- 主界面：Home / 我的写法 / Profile 三个底部导航页。
- 主题：可在顶部按钮或 Profile 外观项切换，并在当前浏览器保存选择。
- Hermes：直接描述、示例提取、A/B 比较、规则编辑、示例预览和本地保存；计时帮助只会追问、建议跳过或建议暂停，不自动选择答案。
- 账户、用量、历史和试写文字均为演示数据；不接入任何服务端或真实账号。
- 预览图在 `previews/`。

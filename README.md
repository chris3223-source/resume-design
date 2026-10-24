# resume-design

AI 求职简历工作台的前端交互原型，使用 React、Ant Design 和 Ant Design X 构建。

## 本地运行

环境：pnpm 11.19.0、Node.js >=22.18.0；本次验证使用 Node.js 24.18.0。

```sh
pnpm install --frozen-lockfile
pnpm dev --port 5178
```

打开 http://localhost:5178/。

## 验证与构建

```sh
pnpm lint
pnpm format
pnpm format:check
pnpm test
pnpm build
pnpm test:sites
```

前端构建产物位于 `dist/client/`。构建脚本同时生成 `dist/server/index.js` 和 `dist/.openai/hosting.json`，供静态资源托管使用。

## 原型范围

- Agent 对话与多标签简历工作区。
- 在左侧切换手动编辑、返回对话，实时更新右侧简历。
- 简历列表、空状态、独立预览，以及新建、复制、重命名、删除演示。
- 文件上传、文本粘贴两种简历导入入口。
- 模拟面试、账户设置、登录与注册流程演示。

此仓库仅包含前端原型。AI 回复和语音字幕为演示；导入文件不上传、不解析；登录、短信、保存和 PDF 下载尚未接入真实服务。页面内状态刷新后重置。演示验证码为 `123456`，不会创建真实账号或保存密码。

当前使用蓝白配色。页面位于 `src/pages/`，原型数据位于 `src/mocks/`，复用图标位于 `src/components/icons.js`，全局样式入口为 `src/styles/index.css`。`src/App.jsx` 保留主题入口，`src/app/Application.jsx` 负责共享状态和页面装配。

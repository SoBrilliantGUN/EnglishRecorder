# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

所有命令在 `app/` 目录下执行：

```bash
cd app
npm run dev      # 启动 Vite 开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
npm run lint     # ESLint 检查（flat config 格式）
npx tsc --noEmit # TypeScript 类型检查
```

项目未配置测试框架。

## 项目文档

`desc/` 目录包含项目的完整描述文档，每次代码修改都需要检查 `desc/` 下的文件、本文件（CLAUDE.md）和 README.md 是否需要同步更新：

- [desc/00-项目结构.md](desc/00-项目结构.md) — 技术选型、文件结构、数据结构、视觉规范
- [desc/01-数据层.md](desc/01-数据层.md) — localStorage 操作 API
- [desc/02-打卡日历.md](desc/02-打卡日历.md) — Calendar 组件
- [desc/03-学习记录视图.md](desc/03-学习记录视图.md) — RecordsView 组件
- [desc/04-分享功能.md](desc/04-分享功能.md) — ShareModal 与主题卡片
- [desc/05-复习提醒.md](desc/05-复习提醒.md) — ReviewReminder 组件
- [desc/06-复习设置.md](desc/06-复习设置.md) — ReviewSettings 组件
- [desc/07-使用说明.md](desc/07-使用说明.md) — InfoModal 使用说明弹窗
- [desc/08-工具函数与Toast.md](desc/08-工具函数与Toast.md) — dayjs 日期工具、Toast
- [desc/09-布局与样式.md](desc/09-布局与样式.md) — SCSS Modules、token 体系、暗黑模式、响应式布局
- [desc/10-主入口与状态管理.md](desc/10-主入口与状态管理.md) — App.tsx 状态管理

## 架构概览

单页 React 19 + TypeScript（strict）应用，Vite 8 构建。所有数据存储在 localStorage，无后端。

### 状态刷新机制

App.tsx 维护一个 `tick` 计数器作为全局刷新信号。组件通过 `store.ts` 修改数据后，调用 `onRefresh` prop（递增 tick）。子组件接收 `tick` 作为 prop，变化时重新从 localStorage 读取数据。这是刻意的设计——不要替换为 useEffect 触发的 setState，也不要引入状态管理库。

### 数据层（store.ts）

带完整类型定义的纯函数模块，直接读写 localStorage。非响应式，组件命令式调用后手动触发刷新。日期处理统一使用 dayjs。localStorage key 前缀：`ep_records`、`ep_coef`、`ep_first`、`ep_resets`、`ep_initialized`、`ep_theme`、`ep_show_review`、`ep_share_theme`。

### 视图切换

无路由库。App.tsx 根据 `view` 状态字符串（`'calendar'` / `'records'`）渲染对应组件，通过回调切换。

### 样式方案

- **全局 token**：`src/styles/_variables.scss` 定义语义化 CSS 变量（颜色、圆角、字号、阴影、动画），含 `[data-theme="dark"]` 暗黑模式覆盖
- **全局样式**：`src/index.scss` 定义复用类（`.card`、`.btn-primary`、`.btn-secondary`、`.modal-overlay`）
- **组件样式**：每个组件使用 `index.module.scss`（SCSS Modules，局部作用域）
- **App 样式**：`src/App.module.scss` 定义 Header 和图标按钮样式
- **响应式**：flexWrap 实现桌面 7:3 布局，移动端纵向堆叠
- **暗黑模式**：`hooks/useTheme.ts` 管理主题状态，通过 `data-theme` 属性切换 CSS 变量，持久化到 `ep_theme`

### 分享导出

`ShareModal` 通过主题注册表（`themes.ts`）选择卡片组件渲染，再用 `html2canvas` 截图导出 PNG。

### 艾宾浩斯复习

`store.ts` 中 `getNextReview()` 使用间隔 `[1, 2, 4, 7, 15, 30, 60]` 天乘以用户可调系数。统计重置点之后的独立学习天数来判断复习轮次。

## 项目约定

- 所有界面文字和注释使用中文
- TypeScript strict 模式，不允许 `any`
- 组件目录结构：`ComponentName/index.tsx` + `ComponentName/index.module.scss`
- 颜色值不硬编码在组件中，使用 `_variables.scss` 中定义的 CSS 变量
- 日期处理使用 dayjs，不手写 Date 操作
- 日期格式统一为 `YYYY-MM-DD` 字符串
- 日历周一为每周起始日
- `tasks/` 目录下的需求文档描述了原始设计意图，行为不明确时应参考

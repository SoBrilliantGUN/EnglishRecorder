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
- [desc/11-课程库.md](desc/11-课程库.md) — EnglishPod 课程列表与详情页（含翻译功能）

## 架构概览

单页 React 19 + TypeScript（strict）应用，Vite 8 构建。所有数据存储在 localStorage，无后端。

### 翻译功能

课程内容支持中英对照翻译，通过 `TransSegment[]` 结构化数据存储：
- **课程数据唯一源**: `public/transcripts/englishpod_XXXX.json`（365个文件，各含 `code`/`title`/`level`/`transcript`/`dialogue`），详情页按需 fetch 加载
- **元数据索引**: `src/data/podcasts-index.ts`（从 transcript 文件提取 `id`/`code`/`title`/`level` 生成，构建时打包）
- **文字稿**: 同上文件中的 `transcript` 字段（ID 1-9, 22 人工校对；ID 10-34 翻译审校完成；其余未翻译）
- **课文对话**: 同上文件中的 `dialogue` 字段（ID 1-50 已翻译）
- **类型**: `types/podcast.ts` 定义 `TransSegment { en: string; zh: string }`
- **显示模式**: 课文内「译」按钮切换两种显示方式（完全显示/悬浮显示）。悬浮模式用 `visibility: hidden` 占位防抖。
- **处理流程**: `scripts/split-sentences.mjs`（逐句拆分 + `--split-long` 长句二次拆分）→ `scripts/rebalance-transcripts.mjs`（批量拆分至 ≤55 字符）→ 人工/并行 EN→ZH 翻译 → `scripts/apply-translations.mjs`（课文翻译写入）或 `scripts/apply-transcript-translations.mjs`（文字稿翻译写入）
- **校对后对齐**: 课文校对完成后，必须将对应文字稿中3遍对话的 en 和 zh 同步为与课文一致（同一录音播放3遍）。使用 `scripts/sync-dialogue-to-transcript.mjs` 脚本完成，流程见下。

### 课文→文字稿同步流程

校对完 dialogue 后，按以下步骤同步 transcript 中的 3 遍对话：

1. **LLM 定位范围**：读取 transcript，找到 3 段对话的起止 segment 索引（inclusive）
2. **执行脚本**：
   ```bash
   node scripts/sync-dialogue-to-transcript.mjs <json路径> <start1>,<end1> <start2>,<end2> <start3>,<end3>
   ```
   脚本自动去掉 dialogue 的人物标签（`A: ` → 空），替换 transcript 中 3 段指定范围，幂等运行无副作用。
- **兼容性**: content 和 transcript 均支持旧格式（string）和新格式（TransSegment[]）

### 状态刷新机制

App.tsx 维护一个 `tick` 计数器作为全局刷新信号。组件通过 `store.ts` 修改数据后，调用 `onRefresh` prop（递增 tick）。子组件接收 `tick` 作为 prop，变化时重新从 localStorage 读取数据。这是刻意的设计——不要替换为 useEffect 触发的 setState，也不要引入状态管理库。

### 数据层（store.ts）

带完整类型定义的纯函数模块，直接读写 localStorage。非响应式，组件命令式调用后手动触发刷新。日期处理统一使用 dayjs。localStorage key 前缀：`ep_records`、`ep_coef`、`ep_first`、`ep_resets`、`ep_initialized`、`ep_theme`、`ep_show_review`、`ep_share_theme`、`ep_show_translation`。

### 视图切换

无路由库。App.tsx 根据 `view` 状态字符串（`'calendar'` / `'records'`）渲染对应组件，通过回调切换。

### 分页组件

项目中所有分页统一使用 `Pagination` 组件（`src/components/Pagination/`），**禁止在各组件中自行实现分页**。

```typescript
interface PaginationProps {
  page: number;              // 当前页码（1-based）
  totalPages: number;        // 总页数
  onPageChange: (page: number) => void;

  variant?: 'simple' | 'full';  // simple=上/下页+指示器 | full=页码按钮+省略号（默认 simple）
  size?: 'sm' | 'md';           // sm=28px | md=32px（默认 md）

  // simple 模式
  prevLabel?: string;           // 默认「上一页」（simple）或 ‹（full）
  nextLabel?: string;           // 默认「下一页」（simple）或 ›（full）
  showIndicator?: boolean;      // 显示 "page/totalPages"，simple 默认 true

  // full 模式
  maxVisible?: number;          // 超过此页数启用省略号，默认 7
  siblingCount?: number;        // 当前页两侧各显示几页，默认 1

  // 每页条数选择器（传入则显示下拉框）
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;

  // 其他
  hideOnSinglePage?: boolean;   // 仅一页时隐藏，默认 true
  showDivider?: boolean;        // 顶部分割线，默认 true
}
```

**各场景使用方式：**

| 场景 | variant | 额外 props |
|---|---|---|
| 学习内容（DailyCard） | `simple`（默认） | — |
| 复习提醒（ReviewReminder） | `simple`（默认） | — |
| 打卡记录（RecordsView） | `full` | `size="sm"` |
| 课程库（PodcastList） | `full` | `pageSize`, `pageSizeOptions`, `onPageSizeChange` |

### 样式方案

- **全局 token**：`src/styles/_variables.scss` 定义语义化 CSS 变量（颜色、圆角、字号、阴影、动画），含 `[data-theme="dark"]` 暗黑模式覆盖
- **全局样式**：`src/index.scss` 定义复用类（`.card`、`.btn-primary`、`.btn-secondary`、`.modal-overlay`），以及 `@media (pointer: coarse)` 触屏适配和 `@media (hover: none)` hover 降级
- **组件样式**：每个组件使用 `index.module.scss`（SCSS Modules，局部作用域）
- **App 布局**：`src/App.module.scss` 定义 `.layout`（桌面双栏 flex）、`.layoutFull`（全宽单栏）、`.main`（左侧主区域 `flex: 1`）、`.sidebar`（右侧 350px 固定宽），移动端 `@media (max-width: 768px)` sidebar 全宽堆叠
- **暗黑模式**：`hooks/useTheme.ts` 管理主题状态，通过 `data-theme` 属性切换 CSS 变量，持久化到 `ep_theme`
- **弹窗小屏适配**：`.modal-content` 设置 `max-height: calc(100vh - 32px)` + `overflow: hidden` 防溢出；`hooks/useScaleToFit.ts` 提供通用缩放 hook，弹窗内容超过视口时用 `transform: scale()` 等比缩小，无滚动条

### 分享导出

`ShareModal` 通过主题注册表（`themes.ts`）选择卡片组件渲染，再用 `html2canvas` 截图导出 PNG。`onclone` 回调中清除缩放样式，截图保持原始分辨率且无视觉抖动。

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

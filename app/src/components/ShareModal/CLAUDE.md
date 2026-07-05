# ShareModal 设计规范

本文件约束 `ShareModal/` 目录下所有分享卡片组件的设计标准，**新增或修改任何卡片主题前必须阅读**。

## 现有主题一览

| id | 标签 | 多课组件 | 多课TopN组件 | 单课组件 | 风格关键词 |
|----|------|----------|--------------|----------|-----------|
| `golden` | 落日余晖 | `CardGolden` | `CardGoldenTopN` | `SingleCardGolden` | 深暖棕底·琥珀金点缀·光线纹理·日落氛围 |
| `warm` | 清新活泼 | `CardWarm` | `CardWarmTopN` | `SingleCardWarm` | 青绿渐变顶部·白色圆角卡片·薄荷色系 |
| `cream` | 奶油纸本 | `CardCream` | `CardCreamTopN` | `SingleCardCream` | 深绿hero·米白底·手账竖条·信笺纸纹 |

新主题必须在 `themes.ts` 的 `MULTI_THEMES`、`TOPN_THEMES`、`SINGLE_THEMES` 中同时注册，三套共享同一 `id`。

---

## 自动分流规则

`ShareModal/index.tsx` 的 `getDisplayMode()` 根据 `groups.length` 自动选择展示模式，**调用方无需感知**：

| 课程数 | 展示模式 | 使用主题集 | 说明 |
|--------|----------|------------|------|
| = 1 | `single` | `SINGLE_THEMES` | 从 `groups[0]` + `src/data/podcasts.ts` 反查数据，自动补全课程信息 |
| 2 ~ 5 | `multi` | `MULTI_THEMES` | 完整课程列表 |
| > 5 | `topn` | `TOPN_THEMES` | Top 4 明星课程 + 归并行（还学了 N 门，共 X 次） |

TopN 组件内部排序逻辑：`[...groups].sort((a, b) => b[1] - a[1])`，取前 4 条展示，剩余汇总为归并行。

---

## 组件硬性约束

### 样式
- **所有样式必须内联（inline style）**，禁止引入 CSS Modules 或外部样式表
- 原因：`html2canvas` 导出时无法读取外部样式，会导致截图空白或样式丢失
- 颜色、字号、间距全部写在 `style={{}}` 里，不引用任何 CSS 变量

### 尺寸
- **所有卡片**：统一固定 `width: 360, height: 640`，不可改变，分享图片尺寸一致
- **多课/TopN 卡片**：使用 `display: flex; flexDirection: column`，课程列表区 `flex: 1` + `justifyContent: center` 居中填充，footer `flexShrink: 0` 固定底部

### 字体
- 使用系统通用字体栈，保证截图环境可用：`'Outfit', 'PingFang SC', sans-serif`
- 衬线标题可用：`'DM Serif Display', 'Noto Serif SC', Georgia, serif`
- 等宽代码感可用：`'JetBrains Mono', monospace`
- **禁止**引用只在开发环境 Google Fonts 加载的字体作为主要字体——截图时 html2canvas 环境可能无法加载

### 省略号处理
- 课程标题截断：父容器加 `minWidth: 0`，文字元素用 `overflow: hidden; textOverflow: ellipsis; whiteSpace: nowrap`
- **禁止**用 `maxWidth` 固定像素值截断标题，会导致短标题也提前截断

### TypeScript
- 未使用的 prop 加 `_` 前缀（如 `lessonId: _lessonId`），保持 strict 模式零报错
- 不允许 `any`

---

## 设计质量标准

### 1. 明确的视觉层次
每张卡片必须有清晰的「主角区」和「配角区」：
- 单课：课程标题是主角，数字是配角但要够大
- 多课：时间标签（label）是主角，课程列表是配角

数字大小参考：主要统计数字不低于 `font-size: 36px`，单课大数字 `60px+`。

### 2. 有主见的色彩
- 选定 1～2 个主色，其他颜色服务于主色
- 暗色主题：主色作为发光点缀（neon glow / text-shadow），背景要足够暗（`#08` 到 `#10` 开头的色值）
- 亮色主题：主色用在标题区块/顶部 hero，内容区退到米白/浅灰
- **禁止**使用毫无个性的纯白底 + 黑字 + 蓝色按钮的通用配色

### 3. 背景不能是死色
至少使用以下一种手段让背景有质感：
- 渐变（`linear-gradient` / `radial-gradient`）
- 点阵底纹（`radial-gradient` 重复小圆点）
- 横线纸纹（绝对定位多条 `1px` 细线）
- 光晕/模糊圆（`border-radius: 50%` + `radial-gradient`）
- 细微几何纹（`repeating-linear-gradient`）

### 4. 装饰元素克制而精准
好的装饰：大水印课号、圆圈边框、渐变分割线、彩色竖条、条纹顶底边
坏的装饰：随机撒花、无意义 emoji、过多阴影叠加导致视觉噪音

每个装饰元素必须有存在理由，加 `pointerEvents: 'none'` 和 `userSelect: 'none'`。

### 5. 多课课程列表的处理
已验证效果好的方案：
- **进度条**：`flex: 1` 横条 + 右侧数字，适合暗色主题
- **tag 卡片**（当前 CardGolden）：每行独立圆角卡片 + 右侧大数字，通用性强
- **手账竖条**（当前 CardCream）：左侧 `4px` 彩色竖条 + 右侧文字 + 数字，适合亮色/纸质主题
- **圆点列表**（当前 CardWarm）：左侧圆点 + 白色卡片行，清爽简洁

**禁止**只用纯文字 `flex justify-between` 做列表。

### 6. TopN 组件规范
- 固定展示次数最多的前 4 课（`TOP_N = 4`）
- 第 1 名要有明显视觉强调（更深的颜色、更亮的发光、更粗的边框等）
- 剩余课程归并为一行：「还学了 N 课  共 X 次」，样式要克制（虚线边框或浅色背景）
- 若 `rest.length === 0`（恰好 4 或 5 课进入 topn 分支），归并行不渲染

### 7. 多课与单课风格要统一
同一主题（`id` 相同）的三种组件（多课/TopN/单课）需使用相同主色、字体搭配和装饰语言。

---

## 开发新主题流程

1. **先出 HTML 预览**：在根目录 `share-card-preview.html` 中验证视觉效果，多课、TopN、单课各出方案
2. **确认后写 TSX**：参照 HTML 还原为 React 内联样式组件，共需新建 5 个文件（Card/CardTopN/SingleCard 各一个）
3. **注册主题**：在 `themes.ts` 的 `MULTI_THEMES`、`TOPN_THEMES`、`SINGLE_THEMES` 中各加一条，`id` 保持一致
4. **类型检查**：`npx tsc --noEmit` 零报错后才算完成

---

## 文件结构

```
ShareModal/
├── CLAUDE.md               ← 本文件
├── index.tsx               ← Modal 容器，自动分流逻辑（getDisplayMode）
├── themes.ts               ← 主题注册表（MULTI_THEMES / TOPN_THEMES / SINGLE_THEMES）
├── types.ts                ← MultiCardProps / SingleCardProps
└── components/
    ├── CardGolden.tsx       ← 多课·落日余晖（2-5 课）
    ├── CardGoldenTopN.tsx   ← 多课·落日余晖·TopN（>5 课）
    ├── CardWarm.tsx         ← 多课·清新活泼（2-5 课）
    ├── CardWarmTopN.tsx     ← 多课·清新活泼·TopN（>5 课）
    ├── CardCream.tsx        ← 多课·奶油纸本（2-5 课）
    ├── CardCreamTopN.tsx    ← 多课·奶油纸本·TopN（>5 课）
    ├── SingleCardGolden.tsx ← 单课·落日余晖
    ├── SingleCardWarm.tsx   ← 单课·清新活泼
    └── SingleCardCream.tsx  ← 单课·奶油纸本
```

组件**必须是单文件**，禁止拆分为目录形式（`ComponentName/index.tsx`），否则 html2canvas 路径解析可能出问题。

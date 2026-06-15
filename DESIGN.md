---
name: EnglishPod 学习打卡
description: 一个温和克制的 EnglishPod 学习追踪工具，轻量卡片、清晰层级、可信赖的工具感。
colors:
  spring-leaf: "#07C160"
  spring-leaf-deep: "#06ad52"
  canvas: "#f7f7f7"
  card-white: "#ffffff"
  cloud: "#f3f3f3"
  mist: "#ececec"
  slate-ink: "#2c3e50"
  stone: "#5c6a6b"
  silver: "#bfbfbf"
  white: "#ffffff"
  hairline: "#e8e8e8"
  poppy: "#e74c3c"
  forest: "#27ae60"
  sky: "#3498db"
  amber: "#F59E0B"
  amber-dark: "#D97706"
  amber-text: "#B45309"
  amber-wash-start: "#FFF9F0"
  amber-wash-end: "#FFF4E6"
typography:
  display:
    fontFamily: "'Noto Serif SC', Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "'Noto Serif SC', Georgia, serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
rounded:
  sm: "5px"
  md: "8px"
  lg: "12px"
  pill: "100px"
  toast: "24px"
components:
  button-primary:
    backgroundColor: "{colors.spring-leaf}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.spring-leaf-deep}"
  button-secondary:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.stone}"
    padding: "6px 8px"
  button-ghost-hover:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.slate-ink}"
---

# Design System: EnglishPod 学习打卡

## 1. Overview

**Creative North Star: "The Gentle Guide"**

EnglishRecorder 是一个学习伴侣，不是成绩裁判。它的视觉系统服务于一个核心隐喻：一位温和的向导，轻声提醒你「该复习了」，然后退到一边让你专注学习。

界面语言借鉴 Apple Health / Things 3 的轻量卡片体系——表面默认扁平，阴影仅在交互时出现。信息层级通过背景色差（纸白 → 浅灰 → 中灰）自然递进，不需要厚重阴影来区分。排版上，Noto Serif SC 衬线标题带来一点人文温度，系统无衬线正文保证可读性。Spring Leaf 绿是唯一的强调色，出现在按钮、选中态和关键标记上，用克制达成清晰。

这个系统明确拒绝两类极端：游戏化教育 App 的跳跃多彩和积分弹窗（不像 Duolingo），以及冰冷开发者工具的超小字号和纯功能堆砌（不像 IDE）。它也拒绝 AI 生成的默认审美——没有渐变文字、玻璃拟态、侧边条纹边框、或每个 section 上面的全大写 eyebrow。

**Key Characteristics:**
- 默认扁平，阴影仅作为交互反馈
- 单一强调色（Spring Leaf 绿），≤10% 表面面积
- 卡片靠背景色差分层，不靠阴影
- 衬线标题 + 无衬线正文，温和但不花哨
- 所有交互可预期、可信任

## 2. Colors

Spring Leaf 绿是唯一的强调色。其余是色相中性的灰度色列，从纯白纸面到深灰蓝墨水。

### Primary
- **Spring Leaf** (#07C160): 主按钮背景、选中态、打卡标记圆点、链接色。唯一的品牌强调色。
- **Spring Leaf Deep** (#06ad52): 主按钮 hover 加深。仅在悬浮态使用。

### Neutral
- **Canvas** (#f7f7f7): 页面背景。色相中性（chroma 0），不偏暖不偏冷。干净、安静，让内容和卡片成为主角。
- **Card White** (#ffffff): 卡片和模态框表面。与背景形成轻微但明确的分层。
- **Cloud** (#f3f3f3): 次级表面。列表行交替背景、课程详情内容区。
- **Mist** (#ececec): 低强调表面。hover 反馈背景、代码标签底色。
- **Slate Ink** (#2c3e50): 正文颜色。深蓝灰比纯黑更温和。
- **Stone** (#5c6a6b): 次级文字。描述、提示、辅助信息。满足 ≥4.5:1 对比度。
- **Silver** (#bfbfbf): 禁用态文字。不可交互元素的视觉信号。
- **White** (#ffffff): 反转文字。用于主按钮和彩色 tag 上的文字。
- **Hairline** (#e8e8e8): 边框和分割线。足够可见但不抢占注意力。

### Functional
- **Poppy** (#e74c3c): 危险/删除操作。红色温和但明确。
- **Forest** (#27ae60): 成功状态。比 Spring Leaf 深，用于区分操作反馈和品牌色。
- **Sky** (#3498db): 信息提示。用于帮助链接和中性状态。
- **Amber** (#F59E0B): 过期提醒专用。温暖的琥珀色传达「需要关注」但不制造焦虑。
- **Amber Dark / Amber Text / Amber Wash**: 过期提醒的暗色、文字色和渐变背景，构成完整的提醒层级。

### Named Rules
**The One Voice Rule.** Spring Leaf 绿在任一屏幕上不超过 10% 的表面面积。它的克制出现才是它的力量。

**The Warm Gradient Rule.** 过期提醒使用 amber-wash 渐变背景 + 左侧 3px Amber 强调条 + amber-glow 动画。这是唯一允许超过 1px 的侧边强调——因为它承载了明确的功能信号（过期 = 需要行动）。

## 3. Typography

**Display Font:** 'Noto Serif SC', Georgia, serif
**Body Font:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Character:** 衬线标题带人文温度，无衬线正文保证屏幕可读性。一个字重（600）的衬线标题，不做粗细对比——简单、清晰、不炫技。

### Hierarchy
- **Display** (600, 20px, 1.3): 页面主标题、Header 应用名。Noto Serif SC。仅一个尺寸，信息层级靠位置而非字号竞赛。
- **Title** (600, 16px, 1.4): 区块标题。卡片头、弹窗标题、日历月份标签。
- **Body** (400, 14px, 1.6): 正文和大多数 UI 文字。系统无衬线。行宽控制在 65–75ch。
- **Label** (400, 12–13px, 1.5, 0.01em letter-spacing): 辅助信息、时间戳、统计数字标签、placeholder。

### Named Rules
**The One Weight Rule.** 衬线标题仅使用 weight 600。不做粗细对比——清晰来自层级位置，而非字重变化。

## 4. Elevation

默认扁平。表面通过背景色差区分层级：Canvas（页底）→ Card White（卡片）→ Cloud（次级表面）→ Mist（hover 反馈）。这套色差体系在日常使用中足够区分层级，不需要阴影。

阴影仅在状态变化时出现：
- 卡片 hover 时出现 `shadow-md`（0 4px 12px rgba(0,0,0,0.1)），作为「可交互」的触觉反馈
- 主按钮 hover 时上移 1px + 颜色加深，无阴影
- 过期提醒使用 amber-glow 动画（2.5s 循环），这是唯一持续存在的阴影效果——用于传达时间敏感的紧迫感

### Shadow Vocabulary
- **Ambient Low** (`box-shadow: 0 1px 3px rgba(0,0,0,0.06)`): 极轻微的 ambient shadow。几乎不可见。
- **Card Rest** (`box-shadow: 0 2px 8px rgba(0,0,0,0.08)`): 卡片默认阴影。很轻，主要用于和纯白背景区分。
- **Card Hover** (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`): 卡片悬浮阴影。这是「可点击」的信号。
- **Modal** (`box-shadow: 0 8px 24px rgba(0,0,0,0.15)`): 模态框阴影。最深的阴影，用于最高层级表面。
- **Warning Glow** (`box-shadow: 0 2px 12px rgba(245,158,11,0.2)`): 过期提醒光晕。唯一使用颜色而非灰度的阴影。

### Named Rules
**The Flat-By-Default Rule.** 表面在静止状态下是扁平的。阴影仅在 hover、focus、或 modal 状态下出现，作为状态反馈而非装饰。

## 5. Components

### Buttons
- **Shape:** 三种按钮共享 8px 圆角（`radius-md`）。
- **Primary:** Spring Leaf 背景 + 白色文字。`padding: 10px 20px`。Hover 时加深为 Spring Leaf Deep（#06ad52）+ 上移 1px。禁用时 opacity 0.4。
- **Secondary:** 白色背景 + 1px Hairline 边框 + Slate Ink 文字。`padding: 8px 16px`。Hover 时边框和文字变为 Spring Leaf。
- **Ghost:** 无背景无边框。Stone 灰色文字。`padding: 6px 8px`。Hover 时背景变为 Mist + 文字变为 Slate Ink。用于图标按钮、工具栏操作。

### Chips / Pills
- **Style:** 1px Hairline 边框 + Card White 背景 + 圆角 pill（100px）。内部含 6px 色点 + 文字 + 计数。
- **Active:** Spring Leaf 背景 + 白色文字 + 无边框。色点变为白色。
- **Hover:** 非激活态 hover 时背景变为 Cloud + 上移 1px。
- 用于课程级别筛选（Elementary / Intermediate / Upper-Intermediate / Advanced）。

### Cards / Containers
- **Corner Style:** 12px 圆角（`radius-lg`）。
- **Background:** Card White（#ffffff）。
- **Shadow Strategy:** Card Rest 阴影默认存在，与 Warm Paper 背景区分。Hover 时升至 Card Hover。
- **Border:** 1px Hairline（#e8e8e8），仅在需要明确边界时使用（如课程卡片）。
- **Internal Padding:** 20px（全局 `.card` 类）。课程列表卡片 1rem。

### Inputs / Fields
- **Style:** 1px Hairline 边框 + Canvas 或 Card White 背景 + 8px 圆角。`padding: 0.75rem 1rem`。
- **Focus:** 边框变为 Spring Leaf + 背景变为 Card White。无外发光（glow-free，保持克制）。
- **With Icon:** 左侧图标绝对定位，输入框左内边距增至 2.75rem 为图标留空。
- **Placeholder:** Stone 色（#5c6a6b）。满足 ≥4.5:1 对比度。

### Navigation
- **Breadcrumb:** 无背景文字链接，Stone 色。Hover 时变为 Spring Leaf。分隔符使用 Hairline。
- **Prev/Next:** 同 Secondary Button 风格。1px Hairline 边框 + 8px 圆角。Hover 时边框和文字变 Spring Leaf。
- **Page Navigation:** 数字按钮，32px 高。当前页：Spring Leaf 背景 + 白色文字。其他页：Card White 背景 + Hairline 边框。Hover 时边框变 Spring Leaf。

### Modal
- **Overlay:** `rgba(0,0,0,0.5)` 固定遮罩。Fade in (0.2s)。
- **Content:** Card White 背景 + 12px 圆角 + 24px 内边距。最大宽 500px，宽 90%。最大高 `calc(100vh - 32px)`。Slide up 动画 (0.3s)。
- **Close Button:** Ghost 样式，右上角。

### Toast
- **Style:** 半透明深色背景 (`rgba(0,0,0,0.8)`) + 白色反转文字。24px 圆角（pill-toast）。`padding: 12px 24px`。
- **Position:** 固定底部居中，距底部 80px。
- **Animation:** CSS animation 控制显隐（0% → 15% fade in → 75% hold → 100% fade out）。无 JS setTimeout。

### Lesson Card (课程库)
- **Style:** 1px Hairline 边框 + Card White 背景 + 8px 圆角。`padding: 1rem`。flex column 布局。
- **Accent:** 左侧 3px Hairline 色条（`::before` 伪元素），hover 时变为 4px Spring Leaf。
- **Level Tag:** 右侧绝对定位的 4px 宽竖条，opacity 0.3，颜色按级别区分（绿/蓝/橙/红）。
- **Title:** 最多 2 行，超出省略号（`-webkit-line-clamp: 2`）。
- **Code:** monospace 小号字（12px），Stone 色。

### Overdue Reminder Item
- **Style:** amber-wash 渐变背景 + 左侧 3px Amber 强调条 + 10px 圆角 + amber-glow 动画（2.5s 循环）。
- 这是唯一突破「Flat-By-Default Rule」的表面——因为过期 = 需要行动。

## 6. Do's and Don'ts

### Do:
- **Do** 用背景色差（Canvas → Card White → Cloud → Mist）建立信息层级。阴影只是辅助。
- **Do** 保持 Spring Leaf 绿在任一屏幕上不超过 10% 表面积。用在对的地方——主按钮、选中态、关键标记。
- **Do** 用 Noto Serif SC 衬线标题带出人文温度，正文用系统无衬线保证可读性。
- **Do** 卡片 hover 时上移 1-2px + 阴影加深，作为可交互的触觉信号。
- **Do** placeholder 文字使用 Stone（#5c6a6b），确保 ≥4.5:1 对比度。
- **Do** 弹窗内容在小屏上用 `transform: scale()` 等比缩小（`useScaleToFit` hook），不出现滚动条。
- **Do** 动画提供 `prefers-reduced-motion: reduce` 降级方案，切换为 instant 或 crossfade。

### Don't:
- **Don't** 使用侧边条纹边框（`border-left` 或 `border-right` > 1px 作为彩色装饰）。唯一例外：过期提醒的 3px Amber 左边条——它承载明确的功能信号。
- **Don't** 使用 gradient text（`background-clip: text` 渐变文字）。Emphasis 通过 weight 或 size 实现。
- **Don't** 使用玻璃拟态（glassmorphism）——模糊半透明背景作为装饰。
- **Don't** 使用超过 4px 的 border-radius 在不合适的地方——输入框和按钮用 8px，卡片用 12px，标签用 pill。不发明新的圆角值。
- **Don't** 硬编码颜色值在组件样式中。始终引用 `_variables.scss` 中的 CSS 变量。
- **Don't** 使用 `maxWidth` 固定像素值截断标题——用 flex + `minWidth: 0` + text overflow 让标题自然截断。
- **Don't** 在非交互元素上使用阴影。阴影 = 可交互的信号。
- **Don't** 制造游戏化感觉——不使用积分、排行榜、成就徽章、弹窗庆祝、跳跃多彩配色。
- **Don't** 做成冰冷工具——字号不低于 12px，不纯功能堆砌，不用 terminal/monospace 做正文排版。
- **Don't** 使用 cream/sand 暖白作为默认背景——Canvas（#f7f7f7）已设定为色相中性。温度通过 Spring Leaf 绿和 Noto Serif SC 衬线传达，不通过背景色。

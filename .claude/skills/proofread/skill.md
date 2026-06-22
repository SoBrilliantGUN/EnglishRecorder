---
name: proofread
description: 人工校对完成某课后，更新角标（isProofread）和文档中的校对进度
---

# 校对完成 — 更新角标与文档

用户通过 `/proofread <id>` 调用，如 `/proofread 25`。收到调用后，立即执行以下全部步骤，无需询问确认。

## 步骤

### 1. 提取 ID

从 args 中提取课程 ID。如果用户未提供 ID（如只说「第X课校对完了」），根据上下文推断 ID 后继续，不要停下来问。

### 2. 更新 PROOFREAD_IDS

编辑 `scripts/build-index.mjs`，在 `PROOFREAD_IDS` Set 中添加该 ID，保持数值排序。

```js
// 例：ID=25
const PROOFREAD_IDS = new Set([..., 24, 25]);
```

### 3. 重新生成索引

```bash
node scripts/build-index.mjs
```

### 4. 更新 CLAUDE.md

编辑 `CLAUDE.md`，找到以 `- **文字稿**:` 开头的那行，更新其中的「已校对」和「翻译完成」ID 范围。

当前已校对 ID 集合为 `{1,2,3,4,5,6,7,8,9,10,11,22,23,24,25}`，翻译完成（含已校对）为 `{1..50}`。根据新增 ID 重新计算连续区间。

格式：`- **文字稿**: 同上文件中的 `transcript` 字段（ID <已校对范围> 人工校对；ID <翻译完成范围> 翻译完成；其余未翻译）`

### 5. 更新翻译进度 memory

编辑 `memory/translation-feature-progress.md`，更新这两行：

```
- 🟢 已校对：ID <新范围>
- 🟡 待校对：ID <新范围>
```

### 6. 报告结果

向用户报告：
- 修改了哪 4 个文件
- 当前已校对总数和新 ID 列表

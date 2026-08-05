---
name: qa-transcript
description: 检查 transcript 翻译质量并修复问题。扫描粘连词、空翻译、翻译偏移、大段抢跑等问题。
---

# Transcript 翻译质量检查与修复 SOP

## 核心原则

1. **Agent 直接翻译，不写匹配脚本** — 这是最重要的教训。写脚本做 dialogue-text 模糊匹配 100% 导致错位。并行 Agent 逐段翻译才可靠。
2. **先扫描分类，再修复** — 不要边扫边修。扫描全部问题后先分类（系统性偏移 vs 孤立错误），再决定策略。
3. **先修结构，再修内容** — 系统性偏移必须最先修复。在偏移的 transcript 上修 keyword 只会造成二次破坏。
4. **git 操作前检查工作树** — `git show HEAD:path` 会覆盖工作树所有内容（包括已翻译的 dialogue），执行前用 `node -e` 确认工作树内有哪些数据。

## 完整流程

### Phase 1: 全量扫描（只读，不做任何修改）

```bash
node scripts/scan-transcripts.mjs <start>-<end>
```

扫描内容包括：
- **EMPTY_ZH**: transcript 或 dialogue 中有空 zh 的 segment
- **GLUED_WORDS**: 英文粘连词（`anotherexample`, `manuallabor`, `reallife` 等）
- **CAMEL_CASE**: 小写后紧跟大写（排除已知专有名词）
- **SHORT_ZH**: zh 极短（≤2 字符去标点）但 en 很长（>15 字符）
- **INCONSISTENT_DIALOGUE**: transcript 中相同 en 但不同 zh 的段
- **KEYWORD_MISSING**: en 含环节名称但 zh 不含
- **EMPTY_DIALOGUE**: dialogue 中有空 zh

### Phase 2: 问题分类

将每课的问题归类为以下类型之一：

| 类型 | 特征 | 修复策略 |
|------|------|----------|
| **系统性偏移** | 连续 ≥5 段 short zh，且前后相邻段互换 | Agent 重译整课 transcript |
| **大段抢跑** | 某段 zh 提前翻译了后续 1-2 段 en 的内容 | Agent 重译整课 transcript |
| **孤立错误** | ≤5 段 short zh，不连续，无偏移模式 | 手动精确修复 |
| **粘连词** | 英文单词粘连 | 正则替换，不改 zh |
| **对话不一致** | 同一 en 在 transcript 中 2+ 处有不同 zh | 若 ≥3 处不一致 → Agent 重译；否则手动 |

**经验法则**: 如果 short zh ≥ 10 段，直接 Agent 重译，不要尝试手动修复。L82（55 段偏移）和 L84（25 段抢跑）都证明了手动修复不可靠。

### Phase 3: 修复执行

#### 3a. 粘连词修复（脚本）
```bash
node scripts/fix-glued-words.mjs <file1> <file2> ...
```
这个操作安全、可逆、不涉及翻译对齐。

#### 3b. Agent 重译（系统性偏移/大段抢跑）
对每个需要重译的课启动一个 Agent：

```
任务：重新翻译 EnglishPod 第XX课的 transcript
源文件：app/public/transcripts/englishpod_XXXX.json
规则：
  1. 1:1 严格对齐，禁止跨段错位
  2. 对话部分使用 dialogue 已有翻译（去掉说话人标签）
  3. 3遍对话重复必须使用相同翻译
  4. 保留专有名词和环节名称不翻译
  5. 不修改 en 字段，不增删 segment
验证：确保 zero empty segments
```

**关键**: 给 Agent 的指令中必须包含 dialogue 已有翻译的引用路径，以及 3 遍对话一致性的明确要求。

#### 3c. 手动精确修复（孤立错误）
仅当 ≤5 段 short zh 且确认无偏移模式时使用。每次修复后立即验证该段及相邻段。

### Phase 4: 验证

每课修复后执行：
```js
const d = JSON.parse(require('fs').readFileSync('file','utf-8'));
const t = d.transcript;
// 1. Zero empty
console.log('Empty:', t.filter(s => !s.zh).length);
// 2. Short zh count
let shorts = 0;
t.forEach(s => {
  const zhClean = (s.zh||'').replace(/[，。！？、；：\s,.!?;:'\"()]/g, '');
  if (zhClean.length <= 2 && s.en.length > 15) shorts++;
});
console.log('Short zh:', shorts);
// 3. Dialogue repeat consistency
// (check that 3 dialogue plays have matching zh)
```

### Phase 5: 索引重建
```bash
node scripts/build-index.mjs
```

## 禁止事项

- ❌ 写模糊匹配脚本做 dialogue→transcript 映射
- ❌ 在未检查工作树内容的情况下执行 `git show HEAD:path` 或 `git checkout -- path`
- ❌ 在偏移的 transcript 上修复 keyword、punctuation 等内容问题
- ❌ 手动操作 10+ 段的数组移位（用 Agent 代替）
- ❌ 反向循环做数组移位（`for i = end; i >= start; i--` 会让所有值变成同一个）
- ❌ 修复后不验证

## 修复经验数据

| 问题类型 | 课程案例 | 有效修复方式 |
|----------|----------|-------------|
| +1 偏移（55段） | L82 | Agent 重译 |
| 大段抢跑（25段） | L84 | Agent 重译 |
| +1 偏移（36段） | L87 | Agent 重译 |
| -1 偏移（整体） | L87 | Agent 重译 |
| 孤立抢跑（4段） | L72 | 手动重分配 zh |
| 对话+1偏移（3×7段） | L81 | 手动逐段修复 |
| 粘连词 | L76/77/78/79/82/86/88 | 正则脚本 |
| git restore 误删 dialogue | L78/79/86 | 手动补译 dialogue |
| keyword 缺失 | L71/72/82/83/85/86/87/90 | 脚本 + 手动验证 |

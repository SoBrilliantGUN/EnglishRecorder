---
name: sync
description: 课文校对完成后，将 dialogue 同步到 transcript 的 3 遍对话中
---

# 同步课文到文字稿

将当前已校对好的 `dialogue` 同步到 `transcript` 中的 3 段对话。

## 步骤

### 1. 确认目标文件

检查 `app/public/transcripts/` 下对应的 JSON 文件，确认该文件的 `dialogue` 已经是最终版本（校对完成）。

### 2. 定位 3 段对话的 transcript 索引

```
node -e "
const d = JSON.parse(require('fs').readFileSync('app/public/transcripts/englishpod_XXXX.json','utf8'));
const t = d.transcript;
for (let i = 0; i < t.length; i++) {
  const en = t[i].en;
  if (en === \"Oh, I don't know if you've heard,\") {
    console.log('Pass start:', i, '→', JSON.stringify(en));
  }
  if (en.startsWith('I mean') && (en.includes('over for dinner') || en.includes('both for dinner'))) {
    console.log('Pass end:', i, '→', JSON.stringify(en));
  }
}
"
```

注意：不同课程的第一句可能不同（如 `"Hello, I'd like to..."`），根据实际 dialogue 的第一段 en 文本来搜索。

### 3. 确认段数

定位完成后，检查是否恰好找到 **3 段**对话。用 dialogue 中一句不会出现在讲解中的文本辅助计数：

```
node -e "
const d = JSON.parse(require('fs').readFileSync('app/public/transcripts/englishpod_XXXX.json','utf8'));
const t = d.transcript;
let count = 0;
t.forEach((s,i) => { if (s.en.includes('<对话中某句唯一文本>')) { count++; console.log('@', i, ':', s.en.substring(0,60)); } });
console.log('共', count, '次（应为 3）');
"
```

**如果不是恰好 3 段，立即停止，不要执行后续步骤。** 向用户报告实际段数，说明本课 transcript 结构与脚本预期不符，由用户决定如何处理。

### 4. 执行同步脚本

```
node .claude/skills/sync/sync-dialogue-to-transcript.mjs app/public/transcripts/englishpod_XXXX.json <start1>,<end1> <start2>,<end2> <start3>,<end3>
```

### 5. 验证

用 dialogue 中的几句关键文本（如修改过的句子）在 transcript 中搜索，确认每遍对话都出现了且共 3 次：

```
node -e "
const d = JSON.parse(require('fs').readFileSync('app/public/transcripts/englishpod_XXXX.json','utf8'));
const t = d.transcript;
let count = 0;
t.forEach((s,i) => { if (s.en.includes('<关键文本>')) { count++; console.log('@', i, ':', s.en.substring(0,60)); } });
console.log('共', count, '次（应为 3）');
"
```

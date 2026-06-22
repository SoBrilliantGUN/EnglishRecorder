---
name: sync
description: 课文校对完成后，将 dialogue 同步到 transcript 的对话回放段落中
---

# 同步课文到文字稿

将当前已校对好的 `dialogue` 同步到 `transcript` 中的对话回放段落（通常 2~3 遍）。

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

定位完成后，检查找到的对话段数与预期是否一致。用 dialogue 中一句不会出现在讲解中的文本辅助计数：

```
node -e "
const d = JSON.parse(require('fs').readFileSync('app/public/transcripts/englishpod_XXXX.json','utf8'));
const t = d.transcript;
let count = 0;
t.forEach((s,i) => { if (s.en.includes('<对话中某句唯一文本>')) { count++; console.log('@', i, ':', s.en.substring(0,60)); } });
console.log('共', count, '段对话回放');
"
```

**将实际段数与步骤 2 找到的起止索引数量进行核对。** 如果段数与索引组数不匹配，立即停止，向用户报告差异，由用户决定如何处理。

### 4. 执行同步脚本

```
node .claude/skills/sync/sync-dialogue-to-transcript.mjs app/public/transcripts/englishpod_XXXX.json <start1>,<end1> [<start2>,<end2> ...]
```

### 5. 验证

用 dialogue 中的几句关键文本（如修改过的句子）在 transcript 中搜索，确认每遍对话都出现了且次数与同步段数一致：

```
node -e "
const d = JSON.parse(require('fs').readFileSync('app/public/transcripts/englishpod_XXXX.json','utf8'));
const t = d.transcript;
let count = 0;
t.forEach((s,i) => { if (s.en.includes('<关键文本>')) { count++; console.log('@', i, ':', s.en.substring(0,60)); } });
console.log('共', count, '次（应与同步段数一致）');
"
```

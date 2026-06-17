/**
 * 将课文（dialogue）同步到节目文字稿（transcript）中的 3 段对话。
 *
 * 用法：
 *   node scripts/sync-dialogue-to-transcript.mjs <json路径> <start1>,<end1> <start2>,<end2> <start3>,<end3>
 *
 *   其中 start/end 为 transcript 数组中的 segment 索引（均为 inclusive）。
 *
 * 示例：
 *   node scripts/sync-dialogue-to-transcript.mjs app/public/transcripts/englishpod_0010.json 90,128 223,261 364,402
 *
 * 工作流程（LLM 负责前两步，脚本负责第三步）：
 *   1. LLM 读取 transcript，定位 3 段对话的起止索引
 *   2. LLM 执行脚本，传入索引
 *   3. 脚本去掉 dialogue 的人物标签 → 替换 transcript 中指定范围的 segments
 */

import { readFileSync, writeFileSync } from 'node:fs';

// ── 工具函数 ──────────────────────────────────────────────

function stripEnSpeaker(en) {
  return en.replace(/^[A-Z]:\s*/, '');
}

function stripZhSpeaker(zh) {
  return zh.replace(/^[A-Z]：\s*/, '');
}

function parseRange(raw) {
  const parts = raw.split(',');
  if (parts.length !== 2) throw new Error(`无法解析范围 "${raw}"，应为 "start,end" 格式`);
  const start = Number(parts[0]);
  const end = Number(parts[1]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start) {
    throw new Error(`范围 "${raw}" 无效：start=${start}, end=${end}`);
  }
  return { start, end };
}

// ── 主流程 ─────────────────────────────────────────────────

function syncDialogue(filePath, ranges) {
  console.log(`读取: ${filePath}`);
  const data = JSON.parse(readFileSync(filePath, 'utf8'));

  const { dialogue, transcript } = data;
  if (!dialogue || !transcript) {
    console.error('错误：文件缺少 dialogue 或 transcript 字段');
    process.exit(1);
  }

  // 1. 转换 dialogue → transcript 格式（去掉人物标签）
  const converted = dialogue.map(seg => ({
    en: stripEnSpeaker(seg.en),
    zh: stripZhSpeaker(seg.zh),
  }));
  console.log(`dialogue ${dialogue.length} segments → 转换后 ${converted.length} segments`);

  // 2. 验证范围
  for (const { start, end } of ranges) {
    if (start >= transcript.length || end >= transcript.length) {
      console.error(`错误：范围 [${start}, ${end}] 超出 transcript 长度 ${transcript.length}`);
      process.exit(1);
    }
  }

  // 3. 幂等检查
  let needsUpdate = false;
  for (const { start, end } of ranges) {
    const oldSegs = transcript.slice(start, end + 1);
    if (
      oldSegs.length !== converted.length ||
      oldSegs.some((s, i) => s.en !== converted[i].en || s.zh !== converted[i].zh)
    ) {
      needsUpdate = true;
      break;
    }
  }

  if (!needsUpdate) {
    console.log('✅ 3 段对话已与 dialogue 一致，无需更新');
    return;
  }

  // 4. 替换（从后往前，避免索引偏移）
  for (let i = ranges.length - 1; i >= 0; i--) {
    const { start, end } = ranges[i];
    const deleteCount = end - start + 1;
    console.log(`  替换 transcript[${start}...${end}] (${deleteCount} segments) → ${converted.length} segments`);
    transcript.splice(start, deleteCount, ...converted.map(s => ({ en: s.en, zh: s.zh })));
  }

  // 5. 写回
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('✅ 完成！已将 3 段 transcript 对话替换为与 dialogue 一致的版本');
}

// ── 入口 ───────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length !== 4) {
  console.error('用法: node scripts/sync-dialogue-to-transcript.mjs <json路径> <start1>,<end1> <start2>,<end2> <start3>,<end3>');
  process.exit(1);
}

const [filePath, ...rangeArgs] = args;
const ranges = rangeArgs.map(parseRange);

syncDialogue(filePath, ranges);

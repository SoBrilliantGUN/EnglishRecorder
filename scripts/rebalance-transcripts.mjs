/**
 * 批量重拆分文字稿，将超过 55 字符的段落按自然断点二次拆分。
 * 对已有中文翻译的段落，同步拆分 zh 字段。
 *
 * 用法:
 *   node scripts/rebalance-transcripts.mjs [--dry-run] [--start-id N] [--end-id N] [--all]
 *
 * --dry-run:  仅统计，不写入
 * --start-id: 起始 ID（默认 1）
 * --end-id:   结束 ID（默认 365）
 * --all:      处理全部文件（含已翻译的），默认保护已翻译文件
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSCRIPTS_DIR = path.join(__dirname, '..', 'app', 'public', 'transcripts');

// ============================================================
// splitLongLine — 与 split-sentences.mjs 保持一致
// ============================================================
function splitLongLine(text, maxLen = 55) {
  if (text.length <= maxLen) return [text];

  const parts = [];
  let remaining = text;

  while (remaining.length > maxLen) {
    const searchEnd = Math.min(maxLen, remaining.length);
    let splitPos = -1;

    // 1. 句末标点：在 maxLen 范围内找最右边的 .!? 后跟空格+大写
    const sentenceMatch = remaining
      .substring(0, searchEnd)
      .match(/.*[.!?]\s+(?=[A-Z"'])/g);
    if (sentenceMatch && sentenceMatch.length > 0) {
      const last = sentenceMatch[sentenceMatch.length - 1];
      const endIdx = last.length;
      if (endIdx >= maxLen * 0.35) {
        splitPos = endIdx;
      }
    }

    // 2. 逗号+空格
    if (splitPos < 0) {
      const workArea = remaining.substring(0, searchEnd);
      const commaIdx = workArea.lastIndexOf(', ');
      if (commaIdx >= maxLen * 0.4) {
        splitPos = commaIdx + 2;
      }
    }

    // 3. 分号+空格
    if (splitPos < 0) {
      const workArea = remaining.substring(0, searchEnd);
      const semiIdx = workArea.lastIndexOf('; ');
      if (semiIdx >= maxLen * 0.4) {
        splitPos = semiIdx + 2;
      }
    }

    // 4. 破折号
    if (splitPos < 0) {
      const workArea = remaining.substring(0, searchEnd);
      const dashIdx = Math.max(
        workArea.lastIndexOf(' — '),
        workArea.lastIndexOf(' -- ')
      );
      if (dashIdx >= maxLen * 0.35) {
        splitPos = dashIdx + 3;
      }
    }

    // 5. 并列连词（前后有空格）
    if (splitPos < 0) {
      const conjunctions = [' and ', ' but ', ' or ', ' so ', ' yet '];
      let bestConj = -1;
      for (const conj of conjunctions) {
        const idx = remaining.substring(0, searchEnd).lastIndexOf(conj);
        if (idx > bestConj && idx >= maxLen * 0.35) {
          bestConj = idx;
        }
      }
      if (bestConj >= 0) {
        splitPos = bestConj + 1;
      }
    }

    // 6. 最后一个空格
    if (splitPos < 0) {
      const workArea = remaining.substring(0, searchEnd);
      const spaceIdx = workArea.lastIndexOf(' ');
      if (spaceIdx >= maxLen * 0.3) {
        splitPos = spaceIdx + 1;
      }
    }

    // 7. 兜底：硬断
    if (splitPos < 0 || splitPos < 10) {
      splitPos = maxLen;
    }

    parts.push(remaining.substring(0, splitPos).trim());
    remaining = remaining.substring(splitPos).trim();
  }

  if (remaining) {
    parts.push(remaining);
  }

  return parts;
}

// ============================================================
// splitZh — 将中文翻译对应拆分为子段
// ============================================================
function splitZh(zhText, enParts, originalEn) {
  if (!zhText || zhText.trim() === '') {
    // 无翻译，返回空字符串数组
    return enParts.map(() => '');
  }

  if (enParts.length === 1) {
    return [zhText];
  }

  // 策略：根据英文拆分点在中文中找到对应断点
  const zhParts = [];
  let zhRemaining = zhText;
  let enOffset = 0;

  for (let i = 0; i < enParts.length - 1; i++) {
    const enPart = enParts[i];
    const enPartEnd = enOffset + enPart.length;

    // 确定英文实际拆分标记：查看 enPart 尾部字符（注意 trim 去掉了尾部空格）
    let splitMarker = 'space'; // 默认空格拆分
    if (enPart.endsWith('.')) splitMarker = '.';
    else if (enPart.endsWith('!')) splitMarker = '!';
    else if (enPart.endsWith('?')) splitMarker = '?';
    else if (enPart.endsWith(',')) splitMarker = ',';
    else if (enPart.endsWith(';')) splitMarker = ';';
    else if (enPart.endsWith('—') || enPart.endsWith('--')) splitMarker = 'dash';
    else {
      // 检查尾部是否有连词（英文中连词归到下一行）
      const afterSplit = originalEn.substring(enPartEnd).trimStart();
      const conjunctions = ['and ', 'but ', 'or ', 'so ', 'yet '];
      for (const conj of conjunctions) {
        if (afterSplit.startsWith(conj)) {
          splitMarker = conj.trim();
          break;
        }
      }
    }

    // 尝试在中文中找到对应的断点
    let zhSplitPos = findZhSplitPointV2(zhRemaining, splitMarker, enPart.length);

    if (zhSplitPos > 0) {
      zhParts.push(zhRemaining.substring(0, zhSplitPos).trim());
      zhRemaining = zhRemaining.substring(zhSplitPos).trim();
    } else {
      // 按比例拆分
      const ratio = enPart.length / originalEn.length;
      const zhSplit = Math.round(zhRemaining.length * ratio);
      if (zhSplit > 0 && zhSplit < zhRemaining.length) {
        zhParts.push(zhRemaining.substring(0, zhSplit).trim());
        zhRemaining = zhRemaining.substring(zhSplit).trim();
      } else {
        // 无法拆分，把剩余中文全给这一段
        zhParts.push(zhRemaining);
        zhRemaining = '';
      }
    }

    enOffset = enPartEnd + 1; // +1 跳过空格
  }

  // 最后一段
  zhParts.push(zhRemaining);

  // 确保数组长度一致
  while (zhParts.length < enParts.length) {
    zhParts.push('');
  }
  while (zhParts.length > enParts.length) {
    const last = zhParts.pop();
    zhParts[zhParts.length - 1] += last;
  }

  return zhParts;
}

/**
 * 在中文文本中找到与英文拆分标记对应的断点位置
 * splitMarker: '.', ',', ';', '!', '?', 'dash', 'and', 'but', 'or', 'so', 'yet', 'space'
 */
function findZhSplitPointV2(zhRemaining, splitMarker, enPartLen) {
  const minRatio = 0.3;
  let idx = -1;

  switch (splitMarker) {
    case '.':
    case '!':
    case '?':
      // 句末标点 → 找所有 。！？，选最接近中部的（避免选到末尾的句号）
      {
        const puncts = ['。', '！', '？'];
        let bestIdx = -1;
        let bestDist = Infinity;
        const target = zhRemaining.length * 0.5;
        for (const p of puncts) {
          let pos = -1;
          while ((pos = zhRemaining.indexOf(p, pos + 1)) !== -1) {
            // 过滤掉在开头(<15%)和末尾(>85%)的标点
            if (pos > zhRemaining.length * 0.15 && pos < zhRemaining.length * 0.85) {
              const dist = Math.abs(pos - target);
              if (dist < bestDist) {
                bestDist = dist;
                bestIdx = pos;
              }
            }
          }
        }
        if (bestIdx >= 0) return bestIdx + 1;
      }
      // 没有中间的句末标点，回退到逗号
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case ',':
      // 英文逗号 → 中文逗号
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      // 也可能是顿号
      idx = zhRemaining.lastIndexOf('、');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case ';':
      // 英文分号 → 中文分号
      idx = zhRemaining.lastIndexOf('；');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      // 回退到逗号
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case 'dash':
      // 英文破折号 → 中文破折号或逗号
      idx = zhRemaining.lastIndexOf('——');
      if (idx > zhRemaining.length * minRatio) return idx;
      idx = zhRemaining.lastIndexOf('—');
      if (idx > zhRemaining.length * minRatio) return idx;
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case 'and':
      idx = findLastZhConj(zhRemaining, ['和', '而且', '并且', '以及', '还有'], minRatio);
      if (idx >= 0) return idx;
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case 'but':
      idx = findLastZhConj(zhRemaining, ['但是', '但', '不过', '然而', '可是', '却'], minRatio);
      if (idx >= 0) return idx;
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case 'or':
      idx = findLastZhConj(zhRemaining, ['或者', '还是', '或', '要么'], minRatio);
      if (idx >= 0) return idx;
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case 'so':
    case 'yet':
      idx = findLastZhConj(zhRemaining, ['所以', '因此', '于是', '那么', '然而'], minRatio);
      if (idx >= 0) return idx;
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;

    case 'space':
    default:
      // 空格拆分 → 按比例或找最近标点
      idx = zhRemaining.lastIndexOf('，');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      idx = zhRemaining.lastIndexOf('、');
      if (idx > zhRemaining.length * minRatio) return idx + 1;
      break;
  }

  return -1;
}

function findLastZhConj(text, conjunctions, minRatio) {
  let best = -1;
  for (const conj of conjunctions) {
    const idx = text.lastIndexOf(conj);
    if (idx > best && idx > text.length * minRatio) {
      best = idx; // 断在连词之前
    }
  }
  return best;
}

// ============================================================
// 处理单个段落数组
// ============================================================
function rebalanceSegments(segments, label) {
  if (!Array.isArray(segments)) return { result: segments, splits: 0, newSegments: 0 };

  const newSegments = [];
  let splits = 0;

  for (const seg of segments) {
    const en = seg.en || '';
    if (en.length <= 55) {
      newSegments.push({ ...seg });
      continue;
    }

    const enParts = splitLongLine(en);
    if (enParts.length <= 1) {
      newSegments.push({ ...seg });
      continue;
    }

    // 有拆分：同步拆分 zh
    const zhParts = splitZh(seg.zh || '', enParts, en);
    splits++;

    for (let i = 0; i < enParts.length; i++) {
      newSegments.push({
        en: enParts[i],
        zh: zhParts[i] || '',
      });
    }
  }

  return {
    result: newSegments,
    splits,
    newSegments: newSegments.length - segments.length,
  };
}

// ============================================================
// 主流程
// ============================================================
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const forceAll = args.includes('--all');
let startId = 1;
let endId = 365;

const startIdx = args.indexOf('--start-id');
if (startIdx >= 0 && args[startIdx + 1]) {
  startId = parseInt(args[startIdx + 1]);
}
const endIdx = args.indexOf('--end-id');
if (endIdx >= 0 && args[endIdx + 1]) {
  endId = parseInt(args[endIdx + 1]);
}

let totalTranscriptSplits = 0;
let totalTranscriptAdded = 0;
let totalDialogueSplits = 0;
let totalDialogueAdded = 0;
let filesChanged = 0;
let filesSkipped = 0;
let filesProcessed = 0;

for (let id = startId; id <= endId; id++) {
  const filename = `englishpod_${String(id).padStart(4, '0')}.json`;
  const filePath = path.join(TRANSCRIPTS_DIR, filename);

  if (!fs.existsSync(filePath)) continue;

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  filesProcessed++;

  // 检查是否有翻译需要保护
  const hasTranscriptZh = Array.isArray(raw.transcript)
    && raw.transcript.some(s => s.zh && s.zh.trim() !== '');
  const hasDialogueZh = Array.isArray(raw.dialogue)
    && raw.dialogue.some(s => s.zh && s.zh.trim() !== '');

  if (!forceAll && (hasTranscriptZh || hasDialogueZh)) {
    filesSkipped++;
    // 仅对无 zh 的段落做拆分
    if (dryRun) continue;
  }

  const tResult = rebalanceSegments(raw.transcript, 'transcript');
  const dResult = rebalanceSegments(raw.dialogue, 'dialogue');

  const tChanged = tResult.splits > 0;
  const dChanged = dResult.splits > 0;

  if (!tChanged && !dChanged) continue;

  totalTranscriptSplits += tResult.splits;
  totalTranscriptAdded += tResult.newSegments;
  totalDialogueSplits += dResult.splits;
  totalDialogueAdded += dResult.newSegments;
  filesChanged++;

  const beforeStr = `T:${raw.transcript?.length ?? 0} D:${raw.dialogue?.length ?? 0}`;
  const afterStr = `T:${tResult.result.length} D:${dResult.result.length}`;

  if (dryRun) {
    console.log(`  [${id}] ${filename}: ${beforeStr} → ${afterStr} (${tResult.splits + dResult.splits} splits)`);
  } else {
    const data = {
      ...raw,
      transcript: tResult.result,
      dialogue: dResult.result,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  [${id}] ${beforeStr} → ${afterStr}`);
  }
}

console.log(`\n========================================`);
console.log(`${dryRun ? '[DRY RUN] ' : ''}Done:`);
console.log(`  Files processed: ${filesProcessed}`);
console.log(`  Files changed:   ${filesChanged}`);
console.log(`  Files skipped:   ${filesSkipped} (has translations, use --all to force)`);
console.log(`  Transcript:      ${totalTranscriptSplits} segments split, +${totalTranscriptAdded} new`);
console.log(`  Dialogue:        ${totalDialogueSplits} segments split, +${totalDialogueAdded} new`);
console.log(`========================================`);
if (dryRun) {
  console.log(`\nRun without --dry-run to apply changes.`);
  console.log(`Use --all to also process files with existing translations.`);
}

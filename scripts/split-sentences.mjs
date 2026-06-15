/**
 * 将 transcript 按句子边界拆分（非换行），一句一段
 * 用法: node scripts/split-sentences.mjs <id> [--split-long]
 *
 * --split-long: 额外对超过 55 字符的句子按自然断点二次拆分
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '..', 'app', 'public', 'transcripts');

function splitSentences(text) {
  // Fix common issues first
  let t = text;
  // Preserve abbreviation dots from being treated as sentence boundaries
  t = t.replace(/\b(Mr|Mrs|Ms|Dr|St|Prof|Capt|Gen|Col|Maj|Lt|Sgt)\./g, '$1<DOT>');
  // Fix stuck words
  t = t.replace(/otherexamples/g, 'other examples');
  t = t.replace(/practicallife/g, 'practical life');
  t = t.replace(/physicallocation/g, 'physical location');
  t = t.replace(/quiteLaughs/g, 'quite. Laughs.');
  // Fix smart quotes
  t = t.replace(/['']/g, "'").replace(/[""]/g, '"');
  // Fix missing apostrophes
  const apoFixes = [
    ['dont', "don't"], ['cant', "can't"], ['wont', "won't"], ['isnt', "isn't"],
    ['arent', "aren't"], ['didnt', "didn't"], ['doesnt', "doesn't"], ['hasnt', "hasn't"],
    ['havent', "haven't"], ['wasnt', "wasn't"], ['werent', "weren't"], ['couldnt', "couldn't"],
    ['wouldnt', "wouldn't"], ['shouldnt', "shouldn't"], ['Thats', "That's"],
    ['Im', "I'm"], ['Ive', "I've"], ['Id', "I'd"], ['Ill', "I'll"],
    ['youre', "you're"], ['hes', "he's"], ['shes', "she's"], ['theres', "there's"],
    ['whats', "what's"], ['whos', "who's"], ['lets', "let's"],
  ];
  for (const [f, to] of apoFixes) {
    t = t.replace(new RegExp('\\b' + f + '\\b', 'g'), to);
  }

  // Split by sentence boundaries: .!? followed by space and capital letter
  // But also handle cases where sentences are just separated by newlines
  // First normalize newlines
  t = t.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into lines first
  const lines = t.split('\n').map(l => l.trim()).filter(l => l);

  // Now merge continuation lines and split sentences
  const segments = [];
  let current = '';

  for (const line of lines) {
    if (!current) {
      current = line;
    } else if (/^[a-z]/.test(line)) {
      // Line starts with lowercase — continuation of previous sentence
      current += ' ' + line;
    } else {
      // Line starts with uppercase — new sentence or new thought
      // Check if current ends with sentence-ending punctuation
      if (/[.!?]$/.test(current.trim())) {
        segments.push(current.trim());
        current = line;
      } else {
        // Current doesn't end with punctuation — might be continuation
        current += ' ' + line;
      }
    }
  }
  if (current) segments.push(current.trim());

  // Now split any remaining multi-sentence segments
  const finalSegments = [];
  for (const seg of segments) {
    // Split on sentence boundaries: .!? followed by space and capital or number
    const parts = seg.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed) finalSegments.push(trimmed);
    }
  }

  // Restore abbreviation dots
  return finalSegments.map(s => s.replace(/<DOT>/g, '.'));
}

/**
 * 将超过 maxLen 的句子按自然断点二次拆分
 * 返回拆分后的子句数组（如果不需要拆分则返回单元素数组）
 *
 * 拆分优先级（从最优到兜底）：
 * 1. 句末标点（. ! ?）后跟空格和大写字母
 * 2. 逗号+空格（, ）
 * 3. 分号+空格（; ）
 * 4. 破折号（ — 或 -- ）
 * 5. 并列连词（ and / but / or / so ）前后有空格
 * 6. 最后一个空格
 * 7. 硬断在 maxLen 处
 */
export function splitLongLine(text, maxLen = 55) {
  if (text.length <= maxLen) return [text];

  const parts = [];
  let remaining = text;

  while (remaining.length > maxLen) {
    // 在 maxLen 范围内找最佳断点
    const searchEnd = Math.min(maxLen, remaining.length);
    let splitPos = -1;

    // 1. 句末标点：在 maxLen 范围内找最右边的 .!? 后跟空格+大写
    const sentenceMatch = remaining
      .substring(0, searchEnd)
      .match(/.*[.!?]\s+(?=[A-Z"'])/g);
    if (sentenceMatch && sentenceMatch.length > 0) {
      const last = sentenceMatch[sentenceMatch.length - 1];
      const endIdx = last.length;
      // 确保断点在 20% ~ 100% 范围内（不要太偏）
      if (endIdx >= maxLen * 0.35) {
        splitPos = endIdx;
      }
    }

    // 2. 逗号+空格
    if (splitPos < 0) {
      const workArea = remaining.substring(0, searchEnd);
      const commaIdx = workArea.lastIndexOf(', ');
      if (commaIdx >= maxLen * 0.4) {
        splitPos = commaIdx + 2; // 断在逗号空格之后
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
        splitPos = bestConj + 1; // 断在连词之前（连词归下一行）
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

const targetId = parseInt(process.argv[2]);
if (!targetId) { console.error('Usage: node split-sentences.mjs <id> [--split-long]'); process.exit(1); }

const filename = `englishpod_${String(targetId).padStart(4, '0')}.json`;
const filePath = path.join(DIR, filename);

const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// 处理 transcript
const text = typeof raw.transcript === 'string'
  ? raw.transcript
  : raw.transcript.map(s => s.en).join('\n');

let sentences = splitSentences(text);
if (useSplitLong) {
  sentences = sentences.flatMap(s => splitLongLine(s));
}
const newTranscript = sentences.map(en => {
  // 尝试保留已有翻译（仅当拆分后仍能匹配时）
  const trimmed = en.trim();
  const existing = Array.isArray(raw.transcript)
    ? raw.transcript.find(s => s.en.trim() === trimmed)
    : null;
  return { en: trimmed, zh: existing?.zh ?? '' };
});

// 处理 dialogue（如果有且是数组）
let newDialogue = raw.dialogue;
if (Array.isArray(raw.dialogue) && useSplitLong) {
  newDialogue = raw.dialogue.flatMap(s => {
    const subEns = splitLongLine(s.en);
    return subEns.map(subEn => {
      const trimmed = subEn.trim();
      return { en: trimmed, zh: s.en.trim() === trimmed ? (s.zh ?? '') : '' };
    });
  });
}

const data = {
  ...raw,
  transcript: newTranscript,
  dialogue: newDialogue,
};
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
const note = useSplitLong ? ` (long lines split)` : '';
console.log(`[${targetId}] transcript: ${newTranscript.length} segments, dialogue: ${Array.isArray(newDialogue) ? newDialogue.length : 'N/A'} segments${note}`);

/**
 * 修复 podcasts.json 中的文本问题，并将 content 字符串拆分为 TransSegment[]
 *
 * 常见问题：
 * 1. & 替换为适当的标点（通常为 ... 或 , ）
 * 2. 缺失的空格 (look!Like → look! Like)
 * 3. 奇怪的单词内大写 (oVerbooked → overbooked)
 * 4. 智能引号 ' " → 直引号 ' "
 * 5. 缺失的撇号 (Thats → That's, Its → It's)
 * 6. 单词中断 (fi rst → first, al l → all, no t → not)
 * 7. 多余的页码数字
 * 8. 合并的课程分离
 */

import * as fs from 'fs';
import * as path from 'path';

const PODCASTS_PATH = path.join(__dirname, '..', 'app', 'src', 'data', 'podcasts.json');

interface PodcastOld {
  id: number;
  code: string;
  level: string;
  title: string;
  content: string;
}

interface TransSegment {
  en: string;
  zh: string;
}

interface PodcastNew {
  id: number;
  code: string;
  level: string;
  title: string;
  content: TransSegment[];
}

function fixContent(text: string): string {
  let fixed = text;

  // 1. 替换智能引号
  fixed = fixed.replace(/[‘’‚‛]/g, "'");
  fixed = fixed.replace(/[“”„‟]/g, '"');
  fixed = fixed.replace(/[′″]/g, "'");

  // 2. 修复 & — 根据上下文替换
  // & 后跟大写字母 → ...（省略号）
  // & 在行尾 → ...
  // & 后跟小写字母 → , （逗号）
  fixed = fixed.replace(/&\s*and\b/gi, ', and');
  fixed = fixed.replace(/&Here\b/gi, '... Here');
  fixed = fixed.replace(/&$/gm, '...');
  fixed = fixed.replace(/\s+&/g, '... ');
  fixed = fixed.replace(/&/g, '... ');

  // 3. 修复奇怪大小写
  fixed = fixed.replace(/\boVerbooked\b/g, 'overbooked');

  // 4. 修复单词中断（空格在单词内）
  fixed = fixed.replace(/\bno t\b/g, 'not');
  fixed = fixed.replace(/\bal l\b/g, 'all');
  fixed = fixed.replace(/\bfi rst\b/g, 'first');
  fixed = fixed.replace(/\bla st\b/g, 'last');
  fixed = fixed.replace(/\btherefor e\b/g, 'therefore');
  fixed = fixed.replace(/\bfo rce\b/g, 'force');
  fixed = fixed.replace(/\bpe ople\b/g, 'people');
  fixed = fixed.replace(/\btoda y\b/g, 'today');
  fixed = fixed.replace(/\bgene ral\b/g, 'general');
  fixed = fixed.replace(/\bint he\b/g, 'in the');
  fixed = fixed.replace(/\bofth e\b/g, 'of the');
  fixed = fixed.replace(/\bterm sof\b/g, 'terms of');
  fixed = fixed.replace(/\bwoul dbe\b/g, 'would be');
  fixed = fixed.replace(/\bt oday\b/g, 'today');
  fixed = fixed.replace(/\bfo r\b/g, 'for');
  fixed = fixed.replace(/\bwit h\b/g, 'with');
  fixed = fixed.replace(/\btha t\b/g, 'that');
  fixed = fixed.replace(/\bwhic h\b/g, 'which');
  fixed = fixed.replace(/\bTher e\b/g, 'There');
  fixed = fixed.replace(/\bther e\b/g, 'there');
  fixed = fixed.replace(/\bar e\b/g, 'are');
  fixed = fixed.replace(/\bwher e\b/g, 'where');
  fixed = fixed.replace(/\bherearethe\b/g, 'here are the');
  fixed = fixed.replace(/\binthe\b/g, 'in the');
  fixed = fixed.replace(/\batthe\b/g, 'at the');
  fixed = fixed.replace(/\btothe\b/g, 'to the');
  fixed = fixed.replace(/\bandthe\b/g, 'and the');
  fixed = fixed.replace(/\bofthe\b/g, 'of the');
  fixed = fixed.replace(/\bforthe\b/g, 'for the');
  fixed = fixed.replace(/\bwiththe\b/g, 'with the');
  fixed = fixed.replace(/\bonthe\b/g, 'on the');
  fixed = fixed.replace(/\bfromthe\b/g, 'from the');

  // 5. 修复缺失撇号
  fixed = fixed.replace(/\bThats\b/g, "That's");
  fixed = fixed.replace(/\bIts\b/g, "It's");
  fixed = fixed.replace(/\bIll\b/g, "I'll");
  fixed = fixed.replace(/\bIm\b/g, "I'm");
  fixed = fixed.replace(/\byoure\b/g, "you're");
  fixed = fixed.replace(/\bhes\b/g, "he's");
  fixed = fixed.replace(/\bHes\b/g, "He's");
  fixed = fixed.replace(/\bshes\b/g, "she's");
  fixed = fixed.replace(/\bShes\b/g, "She's");
  fixed = fixed.replace(/\btheres\b/g, "there's");
  fixed = fixed.replace(/\bTheres\b/g, "There's");
  fixed = fixed.replace(/\bwont\b/g, "won't");
  fixed = fixed.replace(/\bdont\b/g, "don't");
  fixed = fixed.replace(/\bcant\b/g, "can't");
  fixed = fixed.replace(/\barent\b/g, "aren't");
  fixed = fixed.replace(/\bisnt\b/g, "isn't");
  fixed = fixed.replace(/\bdidnt\b/g, "didn't");
  fixed = fixed.replace(/\bdoesnt\b/g, "doesn't");
  fixed = fixed.replace(/\bhasnt\b/g, "hasn't");
  fixed = fixed.replace(/\bhavent\b/g, "haven't");
  fixed = fixed.replace(/\bwasnt\b/g, "wasn't");
  fixed = fixed.replace(/\bwerent\b/g, "weren't");
  fixed = fixed.replace(/\bcouldnt\b/g, "couldn't");
  fixed = fixed.replace(/\bwouldnt\b/g, "wouldn't");
  fixed = fixed.replace(/\bshouldnt\b/g, "shouldn't");
  fixed = fixed.replace(/\bIve\b/g, "I've");
  fixed = fixed.replace(/\byouve\b/g, "you've");
  fixed = fixed.replace(/\bweve\b/g, "we've");
  fixed = fixed.replace(/\btheyve\b/g, "they've");
  fixed = fixed.replace(/\bIm\b/g, "I'm");
  fixed = fixed.replace(/\bId\b/g, "I'd");
  fixed = fixed.replace(/\byoud\b/g, "you'd");
  fixed = fixed.replace(/\bwed\b/g, "we'd");
  fixed = fixed.replace(/\btheyd\b/g, "they'd");
  fixed = fixed.replace(/\bwhos\b/g, "who's");
  fixed = fixed.replace(/\bwhats\b/g, "what's");
  fixed = fixed.replace(/\blets\b/g, "let's");

  // 6. 修复缺失空格（标点后紧跟字母或连词）
  fixed = fixed.replace(/([.!?])([A-Z])/g, '$1 $2');
  fixed = fixed.replace(/([a-z])([A-Z])/g, (match, p1, p2) => {
    // 只在明显是错误的情况下修复（小写后跟大写）
    // 但保留正常的专有名词
    if (/^[a-z]$/.test(p1) && /^[A-Z]/.test(p2)) {
      return p1 + ' ' + p2;
    }
    return match;
  });

  // 7. 移除残留的页码数字（单独的数字在行尾或引号后）
  fixed = fixed.replace(/\"\s*\d+\s*$/gm, '"');
  fixed = fixed.replace(/\n\d+\s*\n/g, '\n');

  // 8. 修复空格标点（句号前多了空格）
  fixed = fixed.replace(/\s+\./g, '.');
  fixed = fixed.replace(/\s+,/g, ',');
  fixed = fixed.replace(/\s+;/g, ';');

  // 9. 修复缺失撇号的变体
  fixed = fixed.replace(/\barent\b/g, "aren't");
  fixed = fixed.replace(/\bcouldn\b/g, "couldn");

  // 10. 清理多余的 ...
  fixed = fixed.replace(/\.{4,}/g, '...');

  // 11. 修复特殊字符
  fixed = fixed.replace(/–|—/g, '-'); // em-dash, en-dash → 普通横线

  // 12. 修复 "right ?" → "right?"
  fixed = fixed.replace(/\s+\?/g, '?');
  fixed = fixed.replace(/\s+!/g, '!');

  // 13. 修复 &quot; → 双引号
  fixed = fixed.replace(/&quot;/g, '"');

  // 14. 清理合并课程的污染标记及其后所有内容
  // 匹配类似 "Elementary -Intermediate -I'm Sorry I love You IV" 的标记行
  // 或 "Elementary -Uppe-Intermediate -EmergencyRoom (D046)"
  const markerPattern = /\b(Elementary|Intermediate|Upper-Intermediate|Advanced)\s*[-–—]\s*(Uppe|Intermediate|Upper|Advanced)?\s*[-–—]?\s*.*$/m;
  const markerMatch = fixed.match(markerPattern);
  if (markerMatch && markerMatch.index !== undefined) {
    fixed = fixed.substring(0, markerMatch.index).trim();
  }

  // 15. 修复连在一起的词
  fixed = fixed.replace(/\bruinedeverything\b/g, 'ruined everything');
  fixed = fixed.replace(/\blead timesfor\b/g, 'lead times for');
  fixed = fixed.replace(/\blittletoo\b/g, 'little too');
  fixed = fixed.replace(/\bnext doorI\b/g, 'next door. I');
  fixed = fixed.replace(/\btrick-ortreatingwith\b/g, 'trick-or-treating with');
  fixed = fixed.replace(/\bTrick -ortreatingis\b/g, 'Trick-or-treating is');
  fixed = fixed.replace(/I 'msure\b/g, "I'm sure");
  fixed = fixed.replace(/I'mgoing\b/g, "I'm going");
  fixed = fixed.replace(/\bwith kids NCP at night\b/g, 'with kids at night');

  // 16. 清理行尾孤立数字（页码残留）
  fixed = fixed.replace(/\n\d{1,2}\s*$/g, '');

  return fixed.trim();
}

/**
 * 将对话文本按 A:/B:/C: 角色拆分
 */
function splitDialogToSegments(text: string): TransSegment[] {
  // 先统一换行符
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 按 \n 分割，然后将连续的非角色行合并到上一个角色行
  const lines = normalized.split('\n');
  const turns: string[] = [];
  let currentTurn = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentTurn) {
        turns.push(currentTurn.trim());
        currentTurn = '';
      }
      continue;
    }
    // 检测是否为新的对话轮次开始（A:, B:, C: 等，可能有多角色如 Host:）
    if (/^[A-Z][a-z]*\s*:/.test(trimmed) && !/^[A-Z]{2,}/.test(trimmed)) {
      if (currentTurn) {
        turns.push(currentTurn.trim());
      }
      currentTurn = trimmed;
    } else {
      // 续行：追加到当前轮次
      if (currentTurn) {
        currentTurn += ' ' + trimmed;
      } else {
        // 没有当前轮次时，作为独立行
        currentTurn = trimmed;
      }
    }
  }
  if (currentTurn) {
    turns.push(currentTurn.trim());
  }

  // 对于没有角色标记的文本，按句子拆分
  if (turns.length === 0) {
    return [{ en: text, zh: '' }];
  }

  // 检查是否所有 turn 都没有角色标记
  const hasSpeaker = turns.some(t => /^[A-Z][a-z]*\s*:/.test(t));
  if (!hasSpeaker) {
    // 按句子拆分
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.filter(s => s.trim()).map(s => ({ en: s.trim(), zh: '' }));
  }

  return turns.map(t => ({ en: t, zh: '' }));
}

function main() {
  console.log('Reading podcasts.json...');
  const raw = fs.readFileSync(PODCASTS_PATH, 'utf-8');
  const podcasts: PodcastOld[] = JSON.parse(raw);

  console.log(`Found ${podcasts.length} podcasts`);

  const fixed: PodcastNew[] = [];
  const issues: string[] = [];

  for (const p of podcasts) {
    const origContent = p.content;
    let fixedContent = fixContent(origContent);
    const segments = splitDialogToSegments(fixedContent);

    // 检查是否有明显的文本问题残留
    if (fixedContent.includes('&')) {
      issues.push(`ID ${p.id} (${p.code}): & still present`);
    }

    fixed.push({
      id: p.id,
      code: p.code,
      level: p.level,
      title: p.title,
      content: segments,
    });
  }

  // 检查特殊合并课程（一个 content 包含多个课程）
  const mergedEntries = fixed.filter(p =>
    p.content.some(s => s.en.includes('Elementary -Uppe') || s.en.includes('EmergencyRoom'))
  );
  if (mergedEntries.length > 0) {
    console.log('\n⚠️  Possible merged entries:');
    mergedEntries.forEach(p => console.log(`  ID ${p.id} (${p.code}): ${p.title}`));
  }

  // 输出结果
  const outPath = path.join(__dirname, '..', 'app', 'src', 'data', 'podcasts-fixed.json');
  fs.writeFileSync(outPath, JSON.stringify(fixed, null, 2), 'utf-8');
  console.log(`\nWrote ${fixed.length} podcasts to podcasts-fixed.json`);

  if (issues.length > 0) {
    console.log(`\n${issues.length} issues remaining:`);
    issues.forEach(i => console.log(`  - ${i}`));
  }
}

main();

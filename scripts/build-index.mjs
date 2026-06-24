/**
 * 构建课程索引文件 src/data/podcasts-index.ts
 * 从 public/transcripts/ 下的 JSON 文件中提取元数据与翻译/校正状态
 *
 * 用法: node scripts/build-index.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const TRANSCRIPTS_DIR = path.join(repoRoot, 'app', 'public', 'transcripts');
const OUTPUT_FILE = path.join(repoRoot, 'app', 'src', 'data', 'podcasts-index.ts');

// ============================================================
// 人工校正过的课文 ID 列表（手动维护）
// ============================================================
const PROOFREAD_IDS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 22, 23, 24, 25]);

// ============================================================
// 级别映射：根据 code 前缀推导级别
// EnglishPod code 命名规则: A/B=Elementary, C=Intermediate,
//   D=Upper-Intermediate, E/F=Advanced
// JSON 文件中的 level 字段不准确，统一从此处推导
// ============================================================
const LEVEL_MAP = {
  A: 'Elementary',
  B: 'Elementary',
  C: 'Intermediate',
  D: 'Upper-Intermediate',
  E: 'Advanced',
  F: 'Advanced',
};

function deriveLevel(code) {
  if (!code || typeof code !== 'string') return 'Intermediate';
  const prefix = code.charAt(0).toUpperCase();
  return LEVEL_MAP[prefix] || 'Intermediate';
}

/**
 * 检查 TransSegment[] 中所有 zh 字段是否非空
 */
function hasAllZh(segments) {
  if (!Array.isArray(segments) || segments.length === 0) return false;
  return segments.every(s => typeof s.zh === 'string' && s.zh.trim().length > 0);
}

// 读取所有 transcript JSON 文件
const files = fs.readdirSync(TRANSCRIPTS_DIR)
  .filter(f => /^englishpod_\d{4}\.json$/.test(f))
  .sort();

const records = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(TRANSCRIPTS_DIR, file), 'utf-8');
  const data = JSON.parse(raw);
  const id = Number(data.id) || parseInt(file.match(/\d+/)[0], 10);

  records.push({
    id,
    code: data.code || '',
    title: data.title || '',
    level: deriveLevel(data.code),
    isProofread: PROOFREAD_IDS.has(id),
    hasDialogueTranslation: hasAllZh(data.dialogue),
    hasTranscriptTranslation: hasAllZh(data.transcript),
  });
}

// 按 id 排序
records.sort((a, b) => a.id - b.id);

// 生成 TypeScript 文件
const lines = [
  '// 自动生成，数据源: public/transcripts/englishpod_XXXX.json',
  '// 重新生成: node scripts/build-index.mjs',
  'import type { PodcastMeta } from \'../types/podcast\';',
  '',
  'const index: PodcastMeta[] = [',
];

for (let i = 0; i < records.length; i++) {
  const r = records[i];
  const comma = i < records.length - 1 ? ',' : '';
  lines.push(`  {`);
  lines.push(`    "id": ${r.id},`);
  lines.push(`    "code": ${JSON.stringify(r.code)},`);
  lines.push(`    "title": ${JSON.stringify(r.title)},`);
  lines.push(`    "level": ${JSON.stringify(r.level)},`);
  lines.push(`    "isProofread": ${r.isProofread},`);
  lines.push(`    "hasDialogueTranslation": ${r.hasDialogueTranslation},`);
  lines.push(`    "hasTranscriptTranslation": ${r.hasTranscriptTranslation}`);
  lines.push(`  }${comma}`);
}

lines.push('];');
lines.push('');
lines.push('export default index;');
lines.push(`export const MAX_LESSON = ${records.length};`);
lines.push('');

fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');

// 统计输出
const proofCount = records.filter(r => r.isProofread).length;
const transCount = records.filter(r => r.hasDialogueTranslation).length;
const transScriptCount = records.filter(r => r.hasTranscriptTranslation).length;

console.log(`✅ 索引已生成: ${OUTPUT_FILE}`);
console.log(`   共 ${records.length} 课`);
console.log(`   人工校正: ${proofCount} 课 (ID: ${records.filter(r => r.isProofread).map(r => r.id).join(', ')})`);
console.log(`   课文翻译: ${transCount} 课`);
console.log(`   文字稿翻译: ${transScriptCount} 课`);

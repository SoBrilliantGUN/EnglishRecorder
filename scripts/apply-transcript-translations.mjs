/**
 * 将翻译写入 transcript JSON 文件
 * 用法: node scripts/apply-transcript-translations.mjs <batch-file>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSCRIPTS_DIR = path.join(__dirname, '..', 'app', 'public', 'transcripts');

const batchFile = process.argv[2];
if (!batchFile) {
  console.error('Usage: node apply-transcript-translations.mjs <batch-file>');
  process.exit(1);
}

const batchPath = path.join(__dirname, batchFile);
const translations = JSON.parse(fs.readFileSync(batchPath, 'utf-8'));

let totalCount = 0;
let filesUpdated = 0;

for (const [idStr, zhList] of Object.entries(translations)) {
  const lessonId = parseInt(idStr);
  const filename = `englishpod_${String(lessonId).padStart(4, '0')}.json`;
  const filePath = path.join(TRANSCRIPTS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`  [${lessonId}] File not found: ${filename}`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(data.transcript)) {
    console.log(`  [${lessonId}] Not structured, skipping`);
    continue;
  }

  if (!Array.isArray(zhList)) {
    console.log(`  [${lessonId}] zhList is not an array, skipping`);
    continue;
  }

  let count = 0;
  zhList.forEach((zh, i) => {
    if (data.transcript[i]) {
      data.transcript[i].zh = zh;
      count++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  [${lessonId}] ${count} translations written`);
  totalCount += count;
  filesUpdated++;
}

console.log(`\nDone: ${totalCount} translations across ${filesUpdated} files`);

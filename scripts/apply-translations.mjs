/**
 * 通用翻译写入脚本
 * 用法：将翻译数据放在 batch-translations.json 中，然后运行此脚本
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataPath = path.join(__dirname, '..', 'app', 'src', 'data', 'podcasts-fixed.json');
const batchFile = process.argv[2] || 'batch-translations.json';
const batchPath = path.join(__dirname, batchFile);

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const translations = JSON.parse(fs.readFileSync(batchPath, 'utf-8'));

let count = 0;
for (const [idStr, zhList] of Object.entries(translations)) {
  const id = Number(idStr);
  const podcast = data.find(p => p.id === id);
  if (!podcast || !podcast.content) continue;
  if (!Array.isArray(zhList)) continue;
  zhList.forEach((zh, i) => {
    if (podcast.content[i]) {
      podcast.content[i].zh = zh;
      count++;
    }
  });
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`[${batchFile}] Applied ${count} translations for ${Object.keys(translations).length} podcasts`);

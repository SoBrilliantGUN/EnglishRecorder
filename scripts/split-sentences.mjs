/**
 * 将 transcript 按句子边界拆分（非换行），一句一段
 * 用法: node scripts/split-sentences.mjs <id>
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

const targetId = parseInt(process.argv[2]);
if (!targetId) { console.error('Usage: node split-sentences.mjs <id>'); process.exit(1); }

const filename = `englishpod_${String(targetId).padStart(4, '0')}.json`;
const filePath = path.join(DIR, filename);

// Read original text (restore from git if needed)
const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const text = typeof raw.transcript === 'string' ? raw.transcript : raw.transcript.map(s => s.en).join('\n');

const sentences = splitSentences(text);
const data = { transcript: sentences.map(en => ({ en, zh: '' })) };
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`[${targetId}] ${sentences.length} sentences`);

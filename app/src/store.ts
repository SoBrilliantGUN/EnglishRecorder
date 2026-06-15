// 数据层：封装所有 localStorage 操作

export interface Record {
  id: string;
  date: string;
  time: string;
  lesson: number;
  count: number;
  timestamp: number;
}

export interface ReviewInfo {
  lesson: number;
  round: number;
  date: string;
}

interface ImportData {
  ep_records?: Record[];
  ep_coef?: number;
  ep_first?: { [key: string]: string };
  ep_resets?: { [key: string]: string };
}

const KEYS = {
  records: 'ep_records',
  coef: 'ep_coef',
  first: 'ep_first',
  resets: 'ep_resets',
} as const;

export function getRecords(): Record[] {
  return JSON.parse(localStorage.getItem(KEYS.records) || '[]');
}

export function saveRecords(records: Record[]): void {
  localStorage.setItem(KEYS.records, JSON.stringify(records));
}

export function addRecord(lesson: number, count: number, date: string): void {
  const records = getRecords();
  records.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    time: new Date().toTimeString().slice(0, 8),
    lesson,
    count,
    timestamp: Date.now(),
  });
  saveRecords(records);
}

export function deleteRecordsByDateAndLesson(date: string, lesson: number): void {
  const records = getRecords().filter(
    r => !(r.date === date && r.lesson === lesson)
  );
  saveRecords(records);
  const remaining = records.filter(r => r.lesson === lesson);
  if (remaining.length === 0) {
    clearFirstDate(lesson);
    clearReset(lesson);
  }
}

export function getFirstDates(): { [key: string]: string } {
  return JSON.parse(localStorage.getItem(KEYS.first) || '{}');
}

export function setFirstDate(lesson: number, date: string): void {
  const first = getFirstDates();
  first[lesson] = date;
  localStorage.setItem(KEYS.first, JSON.stringify(first));
}

export function clearFirstDate(lesson: number): void {
  const first = getFirstDates();
  delete first[lesson];
  localStorage.setItem(KEYS.first, JSON.stringify(first));
}

export function getResets(): { [key: string]: string } {
  return JSON.parse(localStorage.getItem(KEYS.resets) || '{}');
}

export function setReset(lesson: number, date: string): void {
  const resets = getResets();
  resets[lesson] = date;
  localStorage.setItem(KEYS.resets, JSON.stringify(resets));
}

export function clearReset(lesson: number): void {
  const resets = getResets();
  delete resets[lesson];
  localStorage.setItem(KEYS.resets, JSON.stringify(resets));
}

export function getCoef(): number {
  return parseFloat(localStorage.getItem(KEYS.coef) || '1.0');
}

export function setCoef(value: number): number {
  const clamped = Math.min(3.0, Math.max(0.5, parseFloat(value.toFixed(1))));
  localStorage.setItem(KEYS.coef, String(clamped));
  return clamped;
}

export function exportData(): void {
  const data = {
    ep_records: getRecords(),
    ep_coef: getCoef(),
    ep_first: getFirstDates(),
    ep_resets: getResets(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `englishpod-backup-${todayStr()}.json`;
  a.click();
}

export function importData(jsonObj: ImportData): void {
  localStorage.setItem(KEYS.records, JSON.stringify(jsonObj.ep_records || []));
  localStorage.setItem(KEYS.coef, String(jsonObj.ep_coef || 1.0));
  localStorage.setItem(KEYS.first, JSON.stringify(jsonObj.ep_first || {}));
  localStorage.setItem(KEYS.resets, JSON.stringify(jsonObj.ep_resets || {}));
}

// 工具函数
import dayjs from 'dayjs';

export function todayStr(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function formatDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function addDays(date: Date, n: number): Date {
  return dayjs(date).add(n, 'day').toDate();
}

export function getWeekStart(date: Date): Date {
  const d = dayjs(date);
  const day = d.day();
  const diff = day === 0 ? -6 : 1 - day;
  return d.add(diff, 'day').toDate();
}

export function getWeekEnd(date: Date): Date {
  return dayjs(getWeekStart(date)).add(6, 'day').toDate();
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  return dayjs(a).format('YYYY-MM-DD') === dayjs(b).format('YYYY-MM-DD');
}

export function isFuture(dateStr: string): boolean {
  return dateStr > todayStr();
}

export function friendlyDate(dateStr: string): string {
  const today = todayStr();
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const dayAfter = dayjs().add(2, 'day').format('YYYY-MM-DD');
  if (dateStr === today) return '今天';
  if (dateStr === tomorrow) return '明天';
  if (dateStr === dayAfter) return '后天';
  return dateStr;
}

export function getNextReview(lesson: number): ReviewInfo | null {
  const resets = getResets();
  const coef = getCoef();
  const intervals = [1, 2, 4, 7, 15, 30, 60];

  const lessonRecords = getRecords().filter(r => r.lesson === lesson);
  if (lessonRecords.length === 0) return null;

  const startDateStr: string = resets[lesson] || lessonRecords
    .map(r => r.date)
    .sort()[0];

  const uniqueDates = [...new Set(
    lessonRecords.map(r => r.date).filter(d => d >= startDateStr)
  )].sort();

  const completedRounds = uniqueDates.length - 1;
  const nextRound = completedRounds;
  if (nextRound >= intervals.length) return null;

  const today = todayStr();
  const lastDate = uniqueDates[uniqueDates.length - 1];
  const theoreticalDate = formatDate(addDays(new Date(startDateStr), Math.round(intervals[nextRound] * coef)));

  let nextDate: string;
  if (theoreticalDate > today) {
    nextDate = theoreticalDate;
  } else if (lastDate === today) {
    nextDate = formatDate(addDays(new Date(today), 1));
  } else {
    nextDate = today;
  }

  return { lesson, round: nextRound + 1, date: nextDate };
}

export function showToast(msg: string): void {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  el.style.animation = 'none';
  void el.offsetHeight; // reflow
  el.style.animation = 'toastShow 2.3s forwards';
}

// 统计摘要
export interface Stats {
  checkins: number;
  total: number;
  lessons: number;
}

export function getStats(records: Record[]): Stats {
  return {
    checkins: records.length,
    total: records.reduce((s, r) => s + r.count, 0),
    lessons: new Set(records.map(r => r.lesson)).size,
  };
}

// 按课程聚合，返回有序 [lesson, count] 数组
export function groupByLesson(records: Record[]): [string, number][] {
  const map: { [key: number]: number } = {};
  records.forEach(r => {
    map[r.lesson] = (map[r.lesson] || 0) + r.count;
  });
  return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0])) as [string, number][];
}

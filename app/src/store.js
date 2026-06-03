// 数据层：封装所有 localStorage 操作

const KEYS = {
  records: 'ep_records',
  coef: 'ep_coef',
  first: 'ep_first',
  resets: 'ep_resets',
  initialized: 'ep_initialized',
};

export function getRecords() {
  return JSON.parse(localStorage.getItem(KEYS.records) || '[]');
}

export function saveRecords(records) {
  localStorage.setItem(KEYS.records, JSON.stringify(records));
}

export function addRecord(lesson, count, date) {
  const records = getRecords();
  records.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    time: new Date().toTimeString().slice(0, 8),
    lesson: parseInt(lesson),
    count: parseInt(count),
    timestamp: Date.now(),
  });
  saveRecords(records);
}

export function deleteRecordsByDateAndLesson(date, lesson) {
  const records = getRecords().filter(
    r => !(r.date === date && r.lesson === parseInt(lesson))
  );
  saveRecords(records);
  // 若该课程所有记录都删完了，清除首次学习日期和重置状态
  const remaining = records.filter(r => r.lesson === parseInt(lesson));
  if (remaining.length === 0) {
    clearFirstDate(lesson);
    clearReset(lesson);
  }
}

export function getFirstDates() {
  return JSON.parse(localStorage.getItem(KEYS.first) || '{}');
}

export function setFirstDate(lesson, date) {
  const first = getFirstDates();
  first[parseInt(lesson)] = date;
  localStorage.setItem(KEYS.first, JSON.stringify(first));
}

export function clearFirstDate(lesson) {
  const first = getFirstDates();
  delete first[parseInt(lesson)];
  localStorage.setItem(KEYS.first, JSON.stringify(first));
}

export function getResets() {
  return JSON.parse(localStorage.getItem(KEYS.resets) || '{}');
}

export function setReset(lesson, date) {
  const resets = getResets();
  resets[parseInt(lesson)] = date;
  localStorage.setItem(KEYS.resets, JSON.stringify(resets));
}

export function clearReset(lesson) {
  const resets = getResets();
  delete resets[parseInt(lesson)];
  localStorage.setItem(KEYS.resets, JSON.stringify(resets));
}

export function getCoef() {
  return parseFloat(localStorage.getItem(KEYS.coef) || '1.0');
}

export function setCoef(value) {
  const clamped = Math.min(3.0, Math.max(0.5, parseFloat(value.toFixed(1))));
  localStorage.setItem(KEYS.coef, String(clamped));
  return clamped;
}

export function exportData() {
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

export function importData(jsonObj) {
  localStorage.setItem(KEYS.records, JSON.stringify(jsonObj.ep_records || []));
  localStorage.setItem(KEYS.coef, String(jsonObj.ep_coef || 1.0));
  localStorage.setItem(KEYS.first, JSON.stringify(jsonObj.ep_first || {}));
  localStorage.setItem(KEYS.resets, JSON.stringify(jsonObj.ep_resets || {}));
}

export function initData() {
  if (localStorage.getItem(KEYS.initialized)) return;
  const today = todayStr();
  addRecord(1, 1, today);
  addRecord(2, 2, today);
  setFirstDate(1, today);
  setFirstDate(2, today);
  localStorage.setItem(KEYS.initialized, 'true');
}

// 工具函数
export function todayStr() {
  const d = new Date();
  return formatDate(d);
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getWeekEnd(date) {
  const start = getWeekStart(date);
  return addDays(start, 6);
}

export function isSameDay(a, b) {
  return formatDate(new Date(a)) === formatDate(new Date(b));
}

export function isFuture(dateStr) {
  return dateStr > todayStr();
}

export function friendlyDate(dateStr) {
  const today = todayStr();
  const tomorrow = formatDate(addDays(new Date(), 1));
  const dayAfter = formatDate(addDays(new Date(), 2));
  if (dateStr === today) return '今天';
  if (dateStr === tomorrow) return '明天';
  if (dateStr === dayAfter) return '后天';
  return dateStr;
}

export function getNextReview(lesson) {
  const resets = getResets();
  const coef = getCoef();
  const intervals = [1, 2, 4, 7, 15, 30, 60];

  const lessonRecords = getRecords().filter(r => r.lesson === parseInt(lesson));
  if (lessonRecords.length === 0) return null;

  // 有 reset 时以 reset 日期为起点，否则从所有记录中取最早日期
  const startDateStr = resets[lesson] || lessonRecords
    .map(r => r.date)
    .sort()[0];

  // 去重统计有记录的不同日期，reset 之后的才算
  const uniqueDates = [...new Set(
    lessonRecords.map(r => r.date).filter(d => d >= startDateStr)
  )].sort();

  // 已完成轮次 = 不同日期数 - 1（首学不算复习）
  const completedRounds = uniqueDates.length - 1;
  const nextRound = completedRounds; // 0-based index into intervals
  if (nextRound >= intervals.length) return null;

  const today = todayStr();
  const lastDate = uniqueDates[uniqueDates.length - 1];
  const theoreticalDate = formatDate(addDays(new Date(startDateStr), Math.round(intervals[nextRound] * coef)));

  let nextDate;
  if (theoreticalDate > today) {
    nextDate = theoreticalDate;
  } else if (lastDate === today) {
    nextDate = formatDate(addDays(new Date(today), 1));
  } else {
    nextDate = today;
  }

  return { lesson: parseInt(lesson), round: nextRound + 1, date: nextDate };
}

export function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  // 用 CSS transition 自动消失，通过 CSS animation 代替 setTimeout
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'toastShow 2.3s forwards';
}

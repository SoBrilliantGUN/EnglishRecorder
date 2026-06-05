import { useState, useRef } from 'react';
import {
  getRecords, deleteRecordsByDateAndLesson, exportData, importData,
  todayStr, formatDate, getWeekStart, getWeekEnd,
  showToast, Record
} from '../../store';
import ShareModal from '../ShareModal';
import styles from './index.module.scss';

type Tab = 'day' | 'week' | 'month';

interface Stats {
  checkins: number;
  total: number;
  lessons: number;
}

function getStats(records: Record[]): Stats {
  const checkins = records.length;
  const total = records.reduce((s, r) => s + r.count, 0);
  const lessons = new Set(records.map(r => r.lesson)).size;
  return { checkins, total, lessons };
}

function groupByLesson(records: Record[]): [string, number][] {
  const map: { [key: number]: number } = {};
  records.forEach(r => {
    if (!map[r.lesson]) map[r.lesson] = 0;
    map[r.lesson] += r.count;
  });
  return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0])) as [string, number][];
}

function groupDayByLesson(records: Record[]): [string, number][] {
  const map: { [key: number]: number } = {};
  records.forEach(r => {
    if (!map[r.lesson]) map[r.lesson] = 0;
    map[r.lesson] += r.count;
  });
  return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0])) as [string, number][];
}

function getLabel(tab: Tab, date: Date): string {
  if (tab === 'day') return formatDate(date);
  if (tab === 'week') {
    const s = getWeekStart(date), e = getWeekEnd(date);
    return `${formatDate(s)} ~ ${formatDate(e)}`;
  }
  return `${date.getFullYear()}\u5e74${date.getMonth() + 1}\u6708`;
}

function filterRecords(tab: Tab, date: Date): Record[] {
  const all = getRecords();
  if (tab === 'day') {
    const ds = formatDate(date);
    return all.filter(r => r.date === ds);
  }
  if (tab === 'week') {
    const s = formatDate(getWeekStart(date));
    const e = formatDate(getWeekEnd(date));
    return all.filter(r => r.date >= s && r.date <= e);
  }
  const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return all.filter(r => r.date.startsWith(ym));
}

function canGoNext(tab: Tab, date: Date): boolean {
  const today = new Date(todayStr());
  if (tab === 'day') return formatDate(date) < todayStr();
  if (tab === 'week') return formatDate(getWeekStart(date)) < formatDate(getWeekStart(today));
  return date.getFullYear() < today.getFullYear() || date.getMonth() < today.getMonth();
}

interface RecordsViewProps {
  onSwitchView: (view: string) => void;
  onRefresh: () => void;
}

export default function RecordsView({ onSwitchView, onRefresh }: RecordsViewProps) {
  const [tab, setTab] = useState<Tab>('day');
  const [date, setDate] = useState(new Date());
  const [shareModal, setShareModal] = useState(false);
  const [, setTick] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => { setTick(t => t + 1); onRefresh(); };

  const records = filterRecords(tab, date);
  const stats = getStats(records);

  const prev = () => {
    const d = new Date(date);
    if (tab === 'day') d.setDate(d.getDate() - 1);
    else if (tab === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setDate(d);
  };

  const next = () => {
    if (!canGoNext(tab, date)) return;
    const d = new Date(date);
    if (tab === 'day') d.setDate(d.getDate() + 1);
    else if (tab === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setDate(d);
  };

  const handleDelete = (lesson: number) => {
    deleteRecordsByDateAndLesson(formatDate(date), lesson);
    showToast('\u5df2\u5220\u9664');
    refresh();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          importData(JSON.parse(result));
          showToast('\u5bfc\u5165\u6210\u529f');
          refresh();
        }
      } catch { showToast('\u6587\u4ef6\u683c\u5f0f\u9519\u8bef'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const dayGroups = tab === 'day' ? groupDayByLesson(records) : groupByLesson(records);

  return (
    <div className={`card ${styles.container}`}>
      {/* \u9876\u90e8\u6309\u94ae */}
      <div className={styles.toolbar}>
        <button className="btn-secondary" onClick={() => onSwitchView('calendar')}>\u8fd4\u56de\u6253\u5361</button>
        <button className="btn-secondary" onClick={() => setShareModal(true)}>\u5206\u4eab</button>
        <button className="btn-secondary" onClick={exportData}>\u5bfc\u51fa</button>
        <button className="btn-secondary" onClick={() => fileRef.current?.click()}>\u5bfc\u5165</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      </div>

      {/* Tab */}
      <div className={styles.tabs}>
        {(['day', 'week', 'month'] as Tab[]).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => { setTab(t); setDate(new Date()); }}
          >
            {t === 'day' ? '\u6309\u65e5' : t === 'week' ? '\u6309\u5468' : '\u6309\u6708'}
          </button>
        ))}
      </div>

      {/* \u65f6\u95f4\u5bfc\u822a */}
      <div className={styles.nav}>
        <button className="btn-secondary" style={{ padding: '5px 12px' }} onClick={prev}>&#8249;</button>
        <span className={styles.navLabel}>{getLabel(tab, date)}</span>
        <button className="btn-secondary" style={{ padding: '5px 12px' }} onClick={next} disabled={!canGoNext(tab, date)}>&#8250;</button>
      </div>

      {/* \u8bb0\u5f55\u5217\u8868 */}
      <div className={styles.list}>
        {dayGroups.length === 0
          ? <p className={styles.empty}>\u6682\u65e0\u8bb0\u5f55</p>
          : tab === 'day'
            ? dayGroups.map(([lesson, total]) => (
              <div key={lesson} className={styles.recordItem}>
                <span>\u7b2c {String(lesson).padStart(2, '0')} \u8bfe &nbsp; \u5171 {total} \u6b21</span>
                <button className={styles.deleteBtn} onClick={() => handleDelete(parseInt(lesson))}>\u5220\u9664</button>
              </div>
            ))
            : <div className={styles.gridView}>
              {dayGroups.map(([lesson, total]) => (
                <div key={lesson} className={styles.gridItem}>
                  <span>\u7b2c {String(lesson).padStart(2, '0')} \u8bfe &nbsp; \u5171 {total} \u6b21</span>
                </div>
              ))}
            </div>
        }
      </div>

      {/* \u6c47\u603b */}
      <p className={styles.summary}>
        \u6253\u5361\u6b21\u6570\uff1a{stats.checkins} \u6b21 &nbsp;|&nbsp; \u603b\u5b66\u4e60\u904d\u6570\uff1a{stats.total} \u904d &nbsp;|&nbsp; \u6d89\u53ca\u8bfe\u7a0b\u6570\uff1a{stats.lessons} \u95e8
      </p>

      {/* \u5206\u4eab\u5f39\u7a97 */}
      {shareModal && (
        <ShareModal
          label={getLabel(tab, date)}
          stats={stats}
          groups={dayGroups}
          onClose={() => setShareModal(false)}
        />
      )}
    </div>
  );
}

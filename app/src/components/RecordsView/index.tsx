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
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
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
    showToast('已删除');
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
          showToast('导入成功');
          refresh();
        }
      } catch { showToast('文件格式错误'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const dayGroups = tab === 'day' ? groupDayByLesson(records) : groupByLesson(records);

  return (
    <div className={`card ${styles.container}`}>
      {/* 顶部按钮 */}
      <div className={styles.toolbar}>
        <button className="btn-secondary" onClick={() => onSwitchView('calendar')}>返回打卡</button>
        <button className="btn-secondary" onClick={() => setShareModal(true)}>分享</button>
        <button className="btn-secondary" onClick={exportData}>导出</button>
        <button className="btn-secondary" onClick={() => fileRef.current?.click()}>导入</button>
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
            {t === 'day' ? '按日' : t === 'week' ? '按周' : '按月'}
          </button>
        ))}
      </div>

      {/* 时间导航 */}
      <div className={styles.nav}>
        <button className="btn-secondary" style={{ padding: '5px 12px' }} onClick={prev}>&#8249;</button>
        <span className={styles.navLabel}>{getLabel(tab, date)}</span>
        <button className="btn-secondary" style={{ padding: '5px 12px' }} onClick={next} disabled={!canGoNext(tab, date)}>&#8250;</button>
      </div>

      {/* 记录列表 */}
      <div className={styles.list}>
        {dayGroups.length === 0
          ? <p className={styles.empty}>暂无记录</p>
          : tab === 'day'
            ? dayGroups.map(([lesson, total]) => (
              <div key={lesson} className={styles.recordItem}>
                <span>第 {String(lesson).padStart(2, '0')} 课 &nbsp; 共 {total} 次</span>
                <button className={styles.deleteBtn} onClick={() => handleDelete(parseInt(lesson))}>删除</button>
              </div>
            ))
            : <div className={styles.gridView}>
              {dayGroups.map(([lesson, total]) => (
                <div key={lesson} className={styles.gridItem}>
                  <span>第 {String(lesson).padStart(2, '0')} 课 &nbsp; 共 {total} 次</span>
                </div>
              ))}
            </div>
        }
      </div>

      {/* 汇总 */}
      <p className={styles.summary}>
        打卡次数：{stats.checkins} 次 &nbsp;|&nbsp; 总学习遍数：{stats.total} 遍 &nbsp;|&nbsp; 涉及课程数：{stats.lessons} 门
      </p>

      {/* 分享弹窗 */}
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

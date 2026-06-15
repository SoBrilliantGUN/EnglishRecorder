import { useState, useRef, useMemo, Suspense, lazy } from 'react';
import {
  getRecords, deleteRecordsByDateAndLesson, exportData, importData,
  todayStr, formatDate, getWeekStart, getWeekEnd,
  showToast, Record, getStats, groupByLesson
} from '../../store';
import Modal from '../Modal';
import styles from './index.module.scss';

// ShareModal 内含 html2canvas（~410 kB），按需加载
const ShareModal = lazy(() => import('../ShareModal'));

type Tab = 'day' | 'week' | 'month';

const PAGE_SIZE = 6;

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
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [, setTick] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => { setTick(t => t + 1); onRefresh(); };

  const records = filterRecords(tab, date);
  const stats = getStats(records);
  const dayGroups = useMemo(() => groupByLesson(records), [records]);

  // 日视图无需分页；周/月视图按 PAGE_SIZE 分页
  const needsPagination = tab !== 'day' && dayGroups.length > PAGE_SIZE;
  const totalPages = needsPagination ? Math.ceil(dayGroups.length / PAGE_SIZE) : 1;
  const safePage = Math.min(page, totalPages) || 1;
  const pagedGroups = needsPagination
    ? dayGroups.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : dayGroups;

  // 切换 tab 或日期时重置页码
  const changeTab = (t: Tab) => { setTab(t); setDate(new Date()); setPage(1); };
  const changeDate = (d: Date) => { setDate(d); setPage(1); };

  const prev = () => {
    const d = new Date(date);
    if (tab === 'day') d.setDate(d.getDate() - 1);
    else if (tab === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    changeDate(d);
  };

  const next = () => {
    if (!canGoNext(tab, date)) return;
    const d = new Date(date);
    if (tab === 'day') d.setDate(d.getDate() + 1);
    else if (tab === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    changeDate(d);
  };

  const handleDelete = (lesson: number) => {
    setDeleteModal(lesson);
  };

  const confirmDelete = () => {
    if (deleteModal === null) return;
    deleteRecordsByDateAndLesson(formatDate(date), deleteModal);
    showToast('已删除');
    setDeleteModal(null);
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

  return (
    <div className={`card ${styles.container}`}>
      {/* 标题行：返回打卡固定在右上角 */}
      <div className={styles.header}>
        <h2 className={styles.title}>打卡记录</h2>
        <button className="btn-secondary" onClick={() => onSwitchView('calendar')}>返回打卡</button>
      </div>

      {/* 操作栏：分享/导出/导入 */}
      <div className={styles.toolbar}>
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
            onClick={() => changeTab(t)}
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
            ? pagedGroups.map(([lesson, total]) => (
              <div key={lesson} className={styles.recordItem}>
                <span>第 {String(lesson).padStart(2, '0')} 课 &nbsp; 共 {total} 次</span>
                <button className={styles.deleteBtn} onClick={() => handleDelete(parseInt(lesson))}>删除</button>
              </div>
            ))
            : <div className={styles.gridView}>
              {pagedGroups.map(([lesson, total]) => (
                <div key={lesson} className={styles.gridItem}>
                  <span>第 {String(lesson).padStart(2, '0')} 课 &nbsp; 共 {total} 次</span>
                </div>
              ))}
            </div>
        }
      </div>

      {/* 分页 */}
      {needsPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            aria-label="上一页"
          >‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`${styles.pageBtn} ${safePage === p ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(p)}
            >{p}</button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            aria-label="下一页"
          >›</button>
        </div>
      )}

      {/* 汇总 */}
      <p className={styles.summary}>
        打卡次数：{stats.checkins} 次 &nbsp;|&nbsp; 总学习遍数：{stats.total} 遍 &nbsp;|&nbsp; 涉及课程数：{stats.lessons} 门
      </p>

      {/* 分享弹窗 */}
      {shareModal && (
        <Suspense fallback={null}>
          <ShareModal
            label={getLabel(tab, date)}
            stats={stats}
            groups={dayGroups}
            onClose={() => setShareModal(false)}
          />
        </Suspense>
      )}
      {/* 删除确认弹窗 */}
      {deleteModal !== null && (
        <Modal onClose={() => setDeleteModal(null)}>
          <h3 className="modal-title">确认删除第 {String(deleteModal).padStart(2, '0')} 课的打卡记录吗？</h3>
          <p className="modal-text">
            将删除 <strong>{formatDate(date)}</strong> 当天该课程的所有打卡记录。<br />
            <span className="modal-hint">此操作不可恢复。</span>
          </p>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setDeleteModal(null)}>取消</button>
            <button className="btn-primary" onClick={confirmDelete}>确认删除</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

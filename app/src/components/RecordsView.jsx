import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import {
  getRecords, deleteRecordsByDateAndLesson, exportData, importData,
  todayStr, formatDate, getWeekStart, getWeekEnd,
  showToast
} from '../store';

function getStats(records) {
  const checkins = records.length;
  const total = records.reduce((s, r) => s + r.count, 0);
  const lessons = new Set(records.map(r => r.lesson)).size;
  return { checkins, total, lessons };
}

function groupByLesson(records) {
  const map = {};
  records.forEach(r => {
    if (!map[r.lesson]) map[r.lesson] = 0;
    map[r.lesson] += r.count;
  });
  return Object.entries(map).sort((a, b) => a[0] - b[0]);
}

function groupDayByLesson(records) {
  const map = {};
  records.forEach(r => {
    if (!map[r.lesson]) map[r.lesson] = 0;
    map[r.lesson] += r.count;
  });
  return Object.entries(map).sort((a, b) => a[0] - b[0]);
}

function getLabel(tab, date) {
  if (tab === 'day') return formatDate(date);
  if (tab === 'week') {
    const s = getWeekStart(date), e = getWeekEnd(date);
    return `${formatDate(s)} ~ ${formatDate(e)}`;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function filterRecords(tab, date) {
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

function canGoNext(tab, date) {
  const today = new Date(todayStr());
  if (tab === 'day') return formatDate(date) < todayStr();
  if (tab === 'week') return formatDate(getWeekStart(date)) < formatDate(getWeekStart(today));
  return date.getFullYear() < today.getFullYear() || date.getMonth() < today.getMonth();
}

export default function RecordsView({ onSwitchView, onRefresh }) {
  const [tab, setTab] = useState('day');
  const [date, setDate] = useState(new Date());
  const [shareModal, setShareModal] = useState(false);
  const [, setTick] = useState(0);
  const fileRef = useRef();
  const shareRef = useRef();

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

  const handleDelete = (lesson) => {
    deleteRecordsByDateAndLesson(formatDate(date), lesson);
    showToast('已删除');
    refresh();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importData(JSON.parse(ev.target.result));
        showToast('导入成功');
        refresh();
      } catch { showToast('文件格式错误'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadImg = () => {
    html2canvas(shareRef.current, { backgroundColor: '#ffffff', scale: 2 }).then(canvas => {
      const a = document.createElement('a');
      a.download = `englishpod-${todayStr()}.png`;
      a.href = canvas.toDataURL();
      a.click();
    });
  };

  const dayGroups = tab === 'day' ? groupDayByLesson(records) : groupByLesson(records);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* 顶部按钮 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn-secondary" onClick={() => onSwitchView('calendar')}>返回打卡</button>
        <button className="btn-secondary" onClick={() => setShareModal(true)}>分享</button>
        <button className="btn-secondary" onClick={exportData}>导出</button>
        <button className="btn-secondary" onClick={() => fileRef.current.click()}>导入</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {['day', 'week', 'month'].map(t => (
          <button key={t} onClick={() => { setTab(t); setDate(new Date()); }} style={{
            padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: tab === t ? 'var(--primary)' : '#f0f0f0',
            color: tab === t ? 'white' : 'var(--text)', fontSize: 13, transition: 'all 0.2s'
          }}>
            {t === 'day' ? '按日' : t === 'week' ? '按周' : '按月'}
          </button>
        ))}
      </div>

      {/* 时间导航 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="btn-secondary" style={{ padding: '5px 12px' }} onClick={prev}>&#8249;</button>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{getLabel(tab, date)}</span>
        <button className="btn-secondary" style={{ padding: '5px 12px' }} onClick={next} disabled={!canGoNext(tab, date)}>&#8250;</button>
      </div>

      {/* 记录列表 */}
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 80 }}>
        {dayGroups.length === 0
          ? <p style={{ color: 'var(--text-light)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>暂无记录</p>
          : dayGroups.map(([lesson, total]) => (
            <div key={lesson} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14
            }}>
              <span>第 {lesson} 课 &nbsp; 共 {total} 次</span>
              {tab === 'day' && (
                <button onClick={() => handleDelete(parseInt(lesson))} style={{
                  background: 'none', color: '#e74c3c', fontSize: 13, border: '1px solid #e74c3c',
                  borderRadius: 5, padding: '3px 10px'
                }}>删除</button>
              )}
            </div>
          ))
        }
      </div>

      {/* 汇总 */}
      <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 12 }}>
        打卡次数：{stats.checkins} 次 &nbsp;|&nbsp; 总学习遍数：{stats.total} 遍 &nbsp;|&nbsp; 涉及课程数：{stats.lessons} 门
      </p>

      {/* 分享弹窗 */}
      {shareModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShareModal(false)}>
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>分享学习记录</h3>
            <div ref={shareRef} id="share-preview" style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>{getLabel(tab, date)} 学习记录</p>
              {dayGroups.length === 0
                ? <p style={{ color: 'var(--text-light)', fontSize: 13 }}>暂无记录</p>
                : dayGroups.map(([lesson, total]) => (
                  <div key={lesson} style={{ padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f0f0f0' }}>
                    第 {lesson} 课 &nbsp; 共 {total} 次
                  </div>
                ))
              }
              <p style={{ fontSize: 11, color: '#999', marginTop: 12 }}>
                打卡次数：{stats.checkins} 次 | 总遍数：{stats.total} 遍 | 课程数：{stats.lessons} 门
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShareModal(false)}>关闭</button>
              <button className="btn-primary" onClick={handleDownloadImg}>下载图片</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

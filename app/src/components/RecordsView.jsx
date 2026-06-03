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

// 主题 A：暗黑科技
function CardDark({ label, stats, groups }) {
  return (
    <div style={{
      background: '#0a0a0a', borderRadius: 16, padding: 28,
      fontFamily: 'monospace', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 10, color: '#00ff88', border: '1px solid #00ff88', display: 'inline-block', padding: '3px 10px', borderRadius: 100, letterSpacing: 1, marginBottom: 20 }}>
        ENGLISHPOD · STUDY LOG
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.3 }}>{label}</div>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        {[['打卡', stats.checkins, '次'], ['学习', stats.total, '次'], ['课程', stats.lessons, '节']].map(([l, v, u]) => (
          <div key={l} style={{ flex: 1, borderLeft: l !== '打卡' ? '1px solid #1e1e1e' : 'none', paddingLeft: l !== '打卡' ? 16 : 0 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88' }}>{v}<span style={{ fontSize: 11, color: '#444', marginLeft: 2 }}>{u}</span></div>
            <div style={{ fontSize: 11, color: '#444' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 14 }}>
        {groups.length === 0
          ? <div style={{ color: '#333', fontSize: 13 }}>暂无记录</div>
          : groups.map(([lesson, total], i) => (
            <div key={lesson} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < groups.length - 1 ? '1px solid #111' : 'none', fontSize: 13, color: '#666' }}>
              <span>第 <strong style={{ color: '#ccc' }}>{lesson}</strong> 课</span>
              <span style={{ color: '#00ff88' }}>{total} 次</span>
            </div>
          ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'right', fontSize: 9, color: '#222', letterSpacing: 2 }}>ENGLISHPOD TRACKER</div>
    </div>
  );
}

// 主题 B：清新活泼
function CardWarm({ label, stats, groups }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #fff9f0 0%, #ffecd6 100%)',
      borderRadius: 24, padding: 32, fontFamily: 'sans-serif',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(255,140,60,0.15)',
    }}>
      <div style={{ position: 'absolute', width: 180, height: 180, background: '#ffb347', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.4, top: -60, right: -40 }} />
      <div style={{ position: 'absolute', width: 120, height: 120, background: '#ff6b6b', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.3, bottom: 40, left: -30 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, color: '#c4844a', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>EnglishPod 学习打卡</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#1a0a00', lineHeight: 1.2, marginBottom: 24 }}>
          {label}<br /><span style={{ color: '#e8622a', fontSize: 20 }}>学习记录</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[['打卡', stats.checkins, '次'], ['学习', stats.total, '次'], ['课程', stats.lessons, '节']].map(([l, v, u]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#e8622a' }}>{v}<span style={{ fontSize: 11, color: '#c4844a' }}>{u}</span></div>
              <div style={{ fontSize: 10, color: '#a0754a', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        {groups.length > 0 && groups.map(([lesson, total]) => (
          <div key={lesson} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: 10, fontSize: 13, color: '#6b3a1f', background: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
            <span>第 {lesson} 课</span>
            <span style={{ background: '#e8622a', color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>× {total}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, fontSize: 10, color: '#d4a07a', textAlign: 'right' }}>EnglishPod Tracker ✦</div>
      </div>
    </div>
  );
}

// 主题 C：杂志Editorial
function CardEditorial({ label, stats, groups }) {
  return (
    <div style={{ background: '#1c1917', borderRadius: 4, overflow: 'hidden', fontFamily: 'serif' }}>
      <div style={{ background: '#f5f0e8', padding: '24px 24px 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 24, top: 24, width: 3, height: 56, background: '#c8a96e' }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: '#a09880', marginBottom: 8, fontFamily: 'sans-serif' }}>学习记录</div>
        <div style={{ fontSize: 32, color: '#1c1917', lineHeight: 1.2 }}>{label}</div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #2e2a26' }}>
          {[['打卡', stats.checkins, '次'], ['学习', stats.total, '遍'], ['课程', stats.lessons, '门']].map(([l, v, u], i) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid #2e2a26' : 'none' }}>
              <div style={{ fontSize: 30, color: '#c8a96e' }}>{v}<span style={{ fontSize: 10, color: '#5a5348' }}>{u}</span></div>
              <div style={{ fontSize: 10, color: '#5a5348', letterSpacing: 1, fontFamily: 'sans-serif' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#5a5348', marginBottom: 10, fontFamily: 'sans-serif' }}>课程明细</div>
        {groups.length === 0
          ? <div style={{ color: '#5a5348', fontSize: 13 }}>暂无记录</div>
          : groups.map(([lesson, total], i) => (
            <div key={lesson} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < groups.length - 1 ? '1px solid #2e2a26' : 'none', color: '#a09880', fontSize: 13 }}>
              <span>第 <span style={{ fontSize: 18, color: '#f5f0e8' }}>{lesson}</span> 课</span>
              <span style={{ color: '#c8a96e', fontWeight: 700, fontFamily: 'sans-serif', fontSize: 11, letterSpacing: 1 }}>× {total} 次</span>
            </div>
          ))}
      </div>
      <div style={{ background: '#c8a96e', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: 3, color: '#1c1917', fontWeight: 700, fontFamily: 'sans-serif' }}>
        <span>ENGLISHPOD TRACKER</span>
        <span>{todayStr()}</span>
      </div>
    </div>
  );
}

const THEMES = [
  { id: 'dark', label: '暗黑科技', Component: CardDark },
  { id: 'warm', label: '清新活泼', Component: CardWarm },
  { id: 'editorial', label: '杂志风', Component: CardEditorial },
];

export default function RecordsView({ onSwitchView, onRefresh }) {
  const [tab, setTab] = useState('day');
  const [date, setDate] = useState(new Date());
  const [shareModal, setShareModal] = useState(false);
  const [shareTheme, setShareTheme] = useState('dark');
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
    const bg = shareTheme === 'dark' ? '#0a0a0a' : shareTheme === 'warm' ? '#fff9f0' : '#1c1917';
    html2canvas(shareRef.current, { backgroundColor: bg, scale: 2 }).then(canvas => {
      const a = document.createElement('a');
      a.download = `englishpod-${todayStr()}.png`;
      a.href = canvas.toDataURL();
      a.click();
    });
  };

  const dayGroups = tab === 'day' ? groupDayByLesson(records) : groupByLesson(records);
  const activeTheme = THEMES.find(t => t.id === shareTheme);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 420, overflow: 'hidden' }}>
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
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>分享学习记录</h3>

            {/* 主题选择 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setShareTheme(t.id)} style={{
                  flex: 1, padding: '6px 0', borderRadius: 8, border: '2px solid',
                  borderColor: shareTheme === t.id ? 'var(--primary)' : 'var(--border)',
                  background: shareTheme === t.id ? 'rgba(7,193,96,0.08)' : '#fff',
                  color: shareTheme === t.id ? 'var(--primary)' : 'var(--text)',
                  fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                }}>{t.label}</button>
              ))}
            </div>

            {/* 卡片预览 */}
            <div ref={shareRef}>
              <activeTheme.Component label={getLabel(tab, date)} stats={stats} groups={dayGroups} />
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

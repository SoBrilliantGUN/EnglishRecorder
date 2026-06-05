import { useState } from 'react';
import {
  getFirstDates, getNextReview, setReset, todayStr, friendlyDate, showToast,
  getCoef, setCoef, addDays, formatDate, getRecords, getResets,
} from '../store';

const COLLAPSED_COUNT = 3;
const INTERVALS = [1, 2, 4, 7, 15, 30, 60];

// eslint-disable-next-line no-unused-vars
export default function ReviewReminder({ onRefresh, tick }) {
  const [expanded, setExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coef, setCoefState] = useState(getCoef());
  const [resetModal, setResetModal] = useState(null); // 存储待重置的课程编号

  const reminders = [];
  const firstDates = getFirstDates();
  const lessons = Object.keys(firstDates).map(Number).sort((a, b) => a - b);

  // 判断某课程是否过期的辅助函数
  const isOverdue = (lesson) => {
    const resets = getResets();
    const currentCoef = getCoef();
    const intervals = [1, 2, 4, 7, 15, 30, 60];
    const lessonRecords = getRecords().filter(r => r.lesson === parseInt(lesson));
    if (lessonRecords.length === 0) return false;

    const startDateStr = resets[lesson] || lessonRecords.map(r => r.date).sort()[0];
    const uniqueDates = [...new Set(
      lessonRecords.map(r => r.date).filter(d => d >= startDateStr)
    )].sort();

    const completedRounds = uniqueDates.length - 1;
    const nextRound = completedRounds;
    if (nextRound >= intervals.length) return false;

    const theoreticalDate = formatDate(addDays(new Date(startDateStr), Math.round(intervals[nextRound] * currentCoef)));
    return theoreticalDate < todayStr();
  };

  lessons.forEach(lesson => {
    const next = getNextReview(lesson);
    if (!next) return;
    const today = todayStr();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const dayAfterStr = `${dayAfter.getFullYear()}-${String(dayAfter.getMonth() + 1).padStart(2, '0')}-${String(dayAfter.getDate()).padStart(2, '0')}`;

    if (next.date === today || next.date === tomorrowStr || next.date === dayAfterStr) {
      reminders.push({ ...next, isOverdue: isOverdue(lesson) });
    }
  });

  const handleReset = (lesson) => {
    setResetModal(lesson);
  };

  const confirmReset = () => {
    setReset(resetModal, todayStr());
    showToast(`第 ${String(resetModal).padStart(2, '0')} 课已重置`);
    setResetModal(null);
    onRefresh();
  };

  const adjustCoef = (delta) => {
    const newVal = setCoef(coef + delta);
    setCoefState(newVal);
    onRefresh();
  };

  const resetCoef = () => {
    const newVal = setCoef(1.0);
    setCoefState(newVal);
    onRefresh();
  };

  const today = new Date(todayStr());
  const previews = INTERVALS.map((interval, i) => {
    const days = Math.round(interval * coef);
    return { round: i + 1, days, date: formatDate(addDays(today, days)) };
  });

  const visible = expanded ? reminders : reminders.slice(0, COLLAPSED_COUNT);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      {/* 标题行 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16 }}>复习提醒</h3>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          title="复习设置"
          style={{
            background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer',
            color: settingsOpen ? 'var(--primary)' : 'var(--text-light)',
            fontSize: 16, lineHeight: 1, transition: 'color 0.2s',
          }}
        >
          ⚙
        </button>
      </div>

      {/* 提醒列表 */}
      {reminders.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-light)' }}>近3天无需复习</p>
      ) : (
        <>
          {visible.map(r => {
            const baseStyle = {
              padding: '10px',
              borderRadius: 8,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 13,
              transition: 'all 0.3s ease',
            };

            const overdueStyle = r.isOverdue ? {
              background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF4E6 100%)',
              borderLeft: '3px solid #F59E0B',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              animation: 'gentleGlow 2.5s ease-in-out infinite',
            } : {
              background: '#f9f9f9',
            };

            const dateStyle = r.isOverdue ? {
              fontSize: 12,
              color: '#B45309',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 500,
            } : {
              fontSize: 12,
              color: 'var(--text-light)',
            };

            const btnColor = r.isOverdue ? '#D97706' : 'var(--primary)';

            return (
              <div key={`${r.lesson}-${r.round}`} style={{ ...baseStyle, ...overdueStyle }}>
                <div>
                  <span style={{ fontWeight: 600 }}>第 {String(r.lesson).padStart(2, '0')} 课</span> &nbsp;
                  <span style={{ color: 'var(--text-light)' }}>第 {r.round} 次复习</span><br />
                  <span style={dateStyle}>{friendlyDate(r.date)}</span>
                </div>
                <button onClick={() => handleReset(r.lesson)} style={{
                  background: 'none',
                  color: btnColor,
                  border: `1px solid ${btnColor}`,
                  borderRadius: 5,
                  padding: '4px 10px',
                  fontSize: 12
                }}>重置</button>
              </div>
            );
          })}
          {reminders.length > COLLAPSED_COUNT && (
            <button onClick={() => setExpanded(e => !e)} style={{
              background: 'none', border: 'none', color: 'var(--primary)',
              fontSize: 13, cursor: 'pointer', padding: '4px 0'
            }}>
              {expanded ? '收起' : `展开另外 ${reminders.length - COLLAPSED_COUNT} 条`}
            </button>
          )}
        </>
      )}

      {/* 设置面板 */}
      {settingsOpen && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-light)', flex: 1 }}>间隔系数</span>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => adjustCoef(-0.1)} disabled={coef <= 0.5}>-0.1</button>
            <span style={{ fontSize: 15, fontWeight: 600, minWidth: 36, textAlign: 'center' }}>{coef.toFixed(1)}</span>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => adjustCoef(0.1)} disabled={coef >= 3.0}>+0.1</button>
            <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={resetCoef}>重置</button>
          </div>
          <div>
            {previews.map(p => (
              <div key={p.round} style={{ fontSize: 12, color: 'var(--text-light)', padding: '2px 0' }}>
                第 {p.round} 次：{p.date}（+{p.days} 天）
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重置确认弹窗 */}
      {resetModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setResetModal(null)}>
          <div className="modal-content">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>确认重置第 {String(resetModal).padStart(2, '0')} 课的复习进度吗？</h3>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 20 }}>
              重置后，<strong>今天</strong>将作为该课程的新起点，<br />
              后续复习日期将从今天重新计算。<br />
              <span style={{ color: 'var(--text-light)', fontSize: 13 }}>历史打卡记录不会丢失。</span>
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setResetModal(null)}>取消</button>
              <button className="btn-primary" onClick={confirmReset}>确认重置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

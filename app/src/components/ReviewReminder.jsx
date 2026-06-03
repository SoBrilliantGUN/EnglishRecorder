import { useState } from 'react';
import {
  getFirstDates, getNextReview, setReset, todayStr, friendlyDate, showToast
} from '../store';

const COLLAPSED_COUNT = 3;

// eslint-disable-next-line no-unused-vars
export default function ReviewReminder({ onRefresh, tick }) {
  const [expanded, setExpanded] = useState(false);

  const reminders = [];
  const firstDates = getFirstDates();
  const lessons = Object.keys(firstDates).map(Number).sort((a, b) => a - b);

  lessons.forEach(lesson => {
    const next = getNextReview(lesson);
    if (!next) return;
    const today = todayStr();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const dayAfterStr = `${dayAfter.getFullYear()}-${String(dayAfter.getMonth() + 1).padStart(2, '0')}-${String(dayAfter.getDate()).padStart(2, '0')}`;

    if (next.date === today || next.date === tomorrowStr || next.date === dayAfterStr) {
      reminders.push(next);
    }
  });

  const handleReset = (lesson) => {
    setReset(lesson, todayStr());
    showToast(`第 ${lesson} 课已重置`);
    onRefresh();
  };

  const visible = expanded ? reminders : reminders.slice(0, COLLAPSED_COUNT);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>复习提醒</h3>
      {reminders.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-light)' }}>近3天无需复习</p>
      ) : (
        <>
          {visible.map(r => (
            <div key={`${r.lesson}-${r.round}`} style={{
              padding: '10px', background: '#f9f9f9', borderRadius: 8, marginBottom: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13
            }}>
              <div>
                <span style={{ fontWeight: 600 }}>第 {r.lesson} 课</span> &nbsp;
                <span style={{ color: 'var(--text-light)' }}>第 {r.round} 次复习</span><br />
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{friendlyDate(r.date)}</span>
              </div>
              <button onClick={() => handleReset(r.lesson)} style={{
                background: 'none', color: 'var(--primary)', border: '1px solid var(--primary)',
                borderRadius: 5, padding: '4px 10px', fontSize: 12
              }}>重置</button>
            </div>
          ))}
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
    </div>
  );
}

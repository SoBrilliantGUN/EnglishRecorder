import { useState } from 'react';
import { getRecords, todayStr, isFuture } from '../store';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

// tick 作为 prop 传入以触发重渲染
export default function Calendar({ onSwitchView, tick, selected, onSelectDate }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // tick 变化时组件重渲染，直接读 localStorage 最新数据
  void tick;
  const records = getRecords();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = buildCalendarDays(year, month);

  const hasDot = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return records.some(r => r.date === dateStr);
  };

  const handleDayClick = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (isFuture(dateStr)) return;
    onSelectDate(dateStr);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= today) setViewDate(next);
  };
  const isNextDisabled = new Date(year, month + 1, 1) > today;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 454, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>打卡日历</h2>
        <button className="btn-secondary" onClick={() => onSwitchView('records')}>查看记录</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={prevMonth}>&#8249;</button>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{year}年{month + 1}月</span>
        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={nextMonth} disabled={isNextDisabled}>&#8250;</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, paddingBottom: 50, overflowY: 'auto', flex: 1 }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', padding: '4px 0' }}>{w}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const future = isFuture(dateStr);
          const isSelected = selected === dateStr;
          const dot = hasDot(d);
          return (
            <div key={dateStr} onClick={() => !future && handleDayClick(d)} style={{
              textAlign: 'center', padding: '8px 4px', borderRadius: 8, cursor: future ? 'default' : 'pointer',
              background: isSelected ? 'var(--primary)' : 'transparent',
              color: future ? '#ccc' : isSelected ? 'white' : 'var(--text)',
              transition: 'all 0.2s', fontSize: 14,
            }}>
              {d}
              {dot && <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--primary)', margin: '2px auto 0' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

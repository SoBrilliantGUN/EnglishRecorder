import { useState } from 'react';
import { getCoef, setCoef, todayStr, addDays, formatDate } from '../store';

const INTERVALS = [1, 2, 4, 7, 15, 30, 60];

export default function ReviewSettings({ onRefresh }) {
  const [open, setOpen] = useState(false);
  const [coef, setCoefState] = useState(getCoef());

  const adjust = (delta) => {
    const newVal = setCoef(coef + delta);
    setCoefState(newVal);
    onRefresh();
  };

  const reset = () => {
    const newVal = setCoef(1.0);
    setCoefState(newVal);
    onRefresh();
  };

  const today = new Date(todayStr());
  const previews = INTERVALS.map((interval, i) => {
    const days = Math.round(interval * coef);
    return { round: i + 1, days, date: formatDate(addDays(today, days)) };
  });

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
        <h3 style={{ fontSize: 15 }}>复习设置</h3>
        <span style={{ color: 'var(--text-light)', fontSize: 13 }}>{open ? '收起' : '展开'}</span>
      </div>

      {open && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <button className="btn-secondary" style={{ padding: '4px 12px' }} onClick={() => adjust(-0.1)} disabled={coef <= 0.5}>-0.1</button>
            <span style={{ fontSize: 15, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{coef.toFixed(1)}</span>
            <button className="btn-secondary" style={{ padding: '4px 12px' }} onClick={() => adjust(0.1)} disabled={coef >= 3.0}>+0.1</button>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={reset}>恢复默认</button>
          </div>
          <div>
            {previews.map(p => (
              <div key={p.round} style={{ fontSize: 12, color: 'var(--text-light)', padding: '3px 0' }}>
                第 {p.round} 次复习：{p.date}（+{p.days} 天）
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

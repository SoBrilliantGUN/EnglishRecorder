import { useState } from 'react';
import { getCoef, setCoef, todayStr, addDays, formatDate } from '../../store';
import styles from './index.module.scss';

const INTERVALS = [1, 2, 4, 7, 15, 30, 60];

interface ReviewSettingsProps {
  onRefresh: () => void;
}

export default function ReviewSettings({ onRefresh }: ReviewSettingsProps) {
  const [open, setOpen] = useState(false);
  const [coef, setCoefState] = useState(getCoef());

  const adjust = (delta: number) => {
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
    <div className={`card ${styles.container}`}>
      <div className={styles.header} onClick={() => setOpen(o => !o)}>
        <h3 className={styles.title}>复习设置</h3>
        <span className={styles.toggle}>{open ? '收起' : '展开'}</span>
      </div>

      {open && (
        <div className={styles.content}>
          <div className={styles.coefRow}>
            <button className="btn-secondary" style={{ padding: '4px 12px' }} onClick={() => adjust(-0.1)} disabled={coef <= 0.5}>-0.1</button>
            <span className={styles.coefValue}>{coef.toFixed(1)}</span>
            <button className="btn-secondary" style={{ padding: '4px 12px' }} onClick={() => adjust(0.1)} disabled={coef >= 3.0}>+0.1</button>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={reset}>恢复默认</button>
          </div>
          <div>
            {previews.map(p => (
              <div key={p.round} className={styles.previewItem}>
                第 {p.round} 次复习：{p.date}（+{p.days} 天）
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

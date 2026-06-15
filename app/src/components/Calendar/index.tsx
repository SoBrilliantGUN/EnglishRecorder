import { useState, useEffect, useRef } from 'react';
import { getRecords, isFuture } from '../../store';
import styles from './index.module.scss';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

interface CalendarProps {
  onSwitchView: (view: string) => void;
  tick: number;
  selected: string;
  onSelectDate: (date: string) => void;
}

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

// tick 作为 prop 传入以触发重渲染
export default function Calendar({ onSwitchView, tick, selected, onSelectDate }: CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // tick 变化时组件重渲染，直接读 localStorage 最新数据
  void tick;
  const records = getRecords();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = buildCalendarDays(year, month);

  // 点击外部关闭选择器
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  const hasDot = (d: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return records.some(r => r.date === dateStr);
  };

  const handleDayClick = (d: number) => {
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

  const goToMonth = (m: number) => {
    const target = new Date(year, m, 1);
    if (target > today) return; // 不能跳到未来
    setViewDate(target);
    setPickerOpen(false);
  };

  return (
    <div className={`card ${styles.container}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>打卡日历</h2>
        <button className="btn-secondary" onClick={() => onSwitchView('records')}>查看记录</button>
      </div>

      <div className={styles.nav}>
        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={prevMonth} aria-label="上个月">&#8249;</button>
        <div className={styles.pickerWrap} ref={pickerRef}>
          <button
            className={styles.navLabelBtn}
            onClick={() => setPickerOpen(o => !o)}
            aria-label="选择年月"
          >
            {year}年{month + 1}月
          </button>
          {pickerOpen && (
            <div className={styles.picker} role="dialog" aria-label="选择年月">
              <div className={styles.pickerYear}>
                <button
                  className={styles.pickerYearBtn}
                  onClick={() => setViewDate(new Date(year - 1, month, 1))}
                  aria-label="上一年"
                >&#8249;</button>
                <span className={styles.pickerYearLabel}>{year}</span>
                <button
                  className={styles.pickerYearBtn}
                  onClick={() => setViewDate(new Date(year + 1, month, 1))}
                  disabled={new Date(year + 1, month, 1) > today}
                  aria-label="下一年"
                >&#8250;</button>
              </div>
              <div className={styles.pickerMonths}>
                {MONTHS.map((mLabel, i) => {
                  const isFutureMonth = new Date(year, i, 1) > today;
                  const isCurrent = i === month;
                  return (
                    <button
                      key={i}
                      className={`${styles.pickerMonth} ${isCurrent ? styles.pickerMonthActive : ''}`}
                      onClick={() => goToMonth(i)}
                      disabled={isFutureMonth}
                    >
                      {mLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={nextMonth} disabled={isNextDisabled} aria-label="下个月">&#8250;</button>
      </div>

      <div className={styles.grid}>
        {WEEKDAYS.map(w => (
          <div key={w} className={styles.weekday}>{w}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const future = isFuture(dateStr);
          const isSelected = selected === dateStr;
          const dot = hasDot(d);
          const dayClass = [
            styles.day,
            future && styles.dayFuture,
            isSelected && styles.daySelected,
          ].filter(Boolean).join(' ');

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleDayClick(d);
            }
          };

          return (
            <div
              key={dateStr}
              className={dayClass}
              role="button"
              tabIndex={future ? -1 : 0}
              aria-label={`${year}年${month + 1}月${d}日${dot ? '，已打卡' : ''}`}
              aria-disabled={future}
              aria-selected={isSelected}
              onClick={() => !future && handleDayClick(d)}
              onKeyDown={!future ? handleKeyDown : undefined}
            >
              {d}
              {dot && <div className={`${styles.dot} ${isSelected ? styles.dotSelected : ''}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

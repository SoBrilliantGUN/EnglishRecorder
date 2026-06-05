import { useState } from 'react';
import {
  getFirstDates, getNextReview, setReset, todayStr, friendlyDate, showToast,
  getCoef, setCoef, addDays, formatDate, getRecords, getResets,
} from '../../store';
import styles from './index.module.scss';

const COLLAPSED_COUNT = 3;
const INTERVALS = [1, 2, 4, 7, 15, 30, 60];

interface ReviewReminderProps {
  onRefresh: () => void;
  tick: number;
}

interface ReminderItem {
  lesson: number;
  round: number;
  date: string;
  isOverdue: boolean;
}

export default function ReviewReminder({ onRefresh, tick }: ReviewReminderProps) {
  const [expanded, setExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coef, setCoefState] = useState(getCoef());
  const [resetModal, setResetModal] = useState<number | null>(null);

  void tick;

  const reminders: ReminderItem[] = [];
  const firstDates = getFirstDates();
  const lessons = Object.keys(firstDates).map(Number).sort((a, b) => a - b);

  const isOverdue = (lesson: number): boolean => {
    const resets = getResets();
    const currentCoef = getCoef();
    const intervals = [1, 2, 4, 7, 15, 30, 60];
    const lessonRecords = getRecords().filter(r => r.lesson === lesson);
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
    const tomorrowStr = formatDate(tomorrow);
    const dayAfterStr = formatDate(dayAfter);

    if (next.date === today || next.date === tomorrowStr || next.date === dayAfterStr) {
      reminders.push({ ...next, isOverdue: isOverdue(lesson) });
    }
  });

  const handleReset = (lesson: number) => {
    setResetModal(lesson);
  };

  const confirmReset = () => {
    if (resetModal === null) return;
    setReset(resetModal, todayStr());
    showToast(`\u7b2c ${String(resetModal).padStart(2, '0')} \u8bfe\u5df2\u91cd\u7f6e`);
    setResetModal(null);
    onRefresh();
  };

  const adjustCoef = (delta: number) => {
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
    <div className={`card ${styles.container}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>\u590d\u4e60\u63d0\u9192</h3>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          title="\u590d\u4e60\u8bbe\u7f6e"
          className={`${styles.settingsBtn} ${settingsOpen ? styles.settingsBtnActive : ''}`}
        >
          \u2699
        </button>
      </div>

      {reminders.length === 0 ? (
        <p className={styles.empty}>\u8fd13\u5929\u65e0\u9700\u590d\u4e60</p>
      ) : (
        <>
          {visible.map(r => {
            const itemClass = [
              styles.reminderItem,
              r.isOverdue && styles.reminderOverdue,
            ].filter(Boolean).join(' ');

            const btnColor = r.isOverdue ? 'var(--color-warning-dark)' : 'var(--color-primary)';

            return (
              <div key={`${r.lesson}-${r.round}`} className={itemClass}>
                <div>
                  <span className={styles.lessonName}>\u7b2c {String(r.lesson).padStart(2, '0')} \u8bfe</span> &nbsp;
                  <span className={styles.roundText}>\u7b2c {r.round} \u6b21\u590d\u4e60</span><br />
                  <span className={r.isOverdue ? styles.dateOverdue : styles.dateNormal}>{friendlyDate(r.date)}</span>
                </div>
                <button
                  className={styles.resetBtn}
                  style={{ color: btnColor, border: `1px solid ${btnColor}` }}
                  onClick={() => handleReset(r.lesson)}
                >\u91cd\u7f6e</button>
              </div>
            );
          })}
          {reminders.length > COLLAPSED_COUNT && (
            <button className={styles.expandBtn} onClick={() => setExpanded(e => !e)}>
              {expanded ? '\u6536\u8d77' : `\u5c55\u5f00\u53e6\u5916 ${reminders.length - COLLAPSED_COUNT} \u6761`}
            </button>
          )}
        </>
      )}

      {settingsOpen && (
        <div className={styles.settingsPanel}>
          <div className={styles.coefRow}>
            <span className={styles.coefLabel}>\u95f4\u9694\u7cfb\u6570</span>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => adjustCoef(-0.1)} disabled={coef <= 0.5}>-0.1</button>
            <span className={styles.coefValue}>{coef.toFixed(1)}</span>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => adjustCoef(0.1)} disabled={coef >= 3.0}>+0.1</button>
            <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={resetCoef}>\u91cd\u7f6e</button>
          </div>
          <div>
            {previews.map(p => (
              <div key={p.round} className={styles.previewItem}>
                \u7b2c {p.round} \u6b21\uff1a{p.date}\uff08+{p.days} \u5929\uff09
              </div>
            ))}
          </div>
        </div>
      )}

      {resetModal !== null && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setResetModal(null)}>
          <div className="modal-content">
            <h3 className={styles.modalTitle}>\u786e\u8ba4\u91cd\u7f6e\u7b2c {String(resetModal).padStart(2, '0')} \u8bfe\u7684\u590d\u4e60\u8fdb\u5ea6\u5417\uff1f</h3>
            <p className={styles.modalText}>
              \u91cd\u7f6e\u540e\uff0c<strong>\u4eca\u5929</strong>\u5c06\u4f5c\u4e3a\u8be5\u8bfe\u7a0b\u7684\u65b0\u8d77\u70b9\uff0c<br />
              \u540e\u7eed\u590d\u4e60\u65e5\u671f\u5c06\u4ece\u4eca\u5929\u91cd\u65b0\u8ba1\u7b97\u3002<br />
              <span className={styles.modalHint}>\u5386\u53f2\u6253\u5361\u8bb0\u5f55\u4e0d\u4f1a\u4e22\u5931\u3002</span>
            </p>
            <div className={styles.modalFooter}>
              <button className="btn-secondary" onClick={() => setResetModal(null)}>\u53d6\u6d88</button>
              <button className="btn-primary" onClick={confirmReset}>\u786e\u8ba4\u91cd\u7f6e</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

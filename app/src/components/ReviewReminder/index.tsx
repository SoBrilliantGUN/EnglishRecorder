import { useState } from 'react';
import {
  getFirstDates, getNextReview, setReset, todayStr, friendlyDate, showToast,
  getCoef, addDays, formatDate, getRecords, getResets,
} from '../../store';
import { useCoef } from '../../hooks/useCoef';
import Modal from '../Modal';
import { SettingsIcon } from '../icons';
import styles from './index.module.scss';

const COLLAPSED_COUNT = 3;

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
  const [resetModal, setResetModal] = useState<number | null>(null);
  const { coef, adjust, reset: resetCoef, previews } = useCoef(onRefresh);

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

  const confirmReset = () => {
    if (resetModal === null) return;
    setReset(resetModal, todayStr());
    showToast(`第 ${String(resetModal).padStart(2, '0')} 课已重置`);
    setResetModal(null);
    onRefresh();
  };

  const visible = expanded ? reminders : reminders.slice(0, COLLAPSED_COUNT);

  return (
    <div className={`card ${styles.container}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>复习提醒</h3>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          title="复习设置"
          aria-label="复习设置"
          className={`${styles.settingsBtn} ${settingsOpen ? styles.settingsBtnActive : ''}`}
        >
          <SettingsIcon size={16} />
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className={styles.empty}>
          {Object.keys(firstDates).length === 0 ? (
            <>
              <p style={{ marginBottom: 6 }}>还没有复习计划</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                开始打卡后，艾宾浩斯遗忘曲线会自动为你计算复习日期
              </p>
            </>
          ) : (
            <p>近3天无需复习</p>
          )}
        </div>
      ) : (
        <>
          <div className={expanded ? styles.listScroll : undefined}>
            {visible.map(r => {
            const itemClass = [
              styles.reminderItem,
              r.isOverdue && styles.reminderOverdue,
            ].filter(Boolean).join(' ');

            const btnColor = r.isOverdue ? 'var(--color-warning-dark)' : 'var(--color-primary)';

            return (
              <div key={`${r.lesson}-${r.round}`} className={itemClass}>
                <div>
                  <span className={styles.lessonName}>第 {String(r.lesson).padStart(2, '0')} 课</span> &nbsp;
                  <span className={styles.roundText}>第 {r.round} 次复习</span><br />
                  <span className={r.isOverdue ? styles.dateOverdue : styles.dateNormal}>{friendlyDate(r.date)}</span>
                </div>
                <button
                  className={styles.resetBtn}
                  style={{ color: btnColor, border: `1px solid ${btnColor}` }}
                  onClick={() => setResetModal(r.lesson)}
                >重置</button>
              </div>
            );
          })}
          </div>
          {reminders.length > COLLAPSED_COUNT && (
            <button className={styles.expandBtn} onClick={() => setExpanded(e => !e)}>
              {expanded ? '收起' : `展开另外 ${reminders.length - COLLAPSED_COUNT} 条`}
            </button>
          )}
        </>
      )}

      {settingsOpen && (
        <div className={styles.settingsPanel}>
          <div className={styles.coefRow}>
            <span className={styles.coefLabel}>间隔系数</span>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => adjust(-0.1)} disabled={coef <= 0.5}>-0.1</button>
            <span className={styles.coefValue}>{coef.toFixed(1)}</span>
            <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => adjust(0.1)} disabled={coef >= 3.0}>+0.1</button>
            <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={resetCoef}>重置</button>
          </div>
          <div>
            {previews.map(p => (
              <div key={p.round} className={styles.previewItem}>
                第 {p.round} 次：{p.date}（+{p.days} 天）
              </div>
            ))}
          </div>
        </div>
      )}

      {resetModal !== null && (
        <Modal onClose={() => setResetModal(null)}>
          <h3 className="modal-title">确认重置第 {String(resetModal).padStart(2, '0')} 课的复习进度吗？</h3>
          <p className="modal-text">
            重置后，<strong>今天</strong>将作为该课程的新起点，<br />
            后续复习日期将从今天重新计算。<br />
            <span className="modal-hint">历史打卡记录不会丢失。</span>
          </p>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setResetModal(null)}>取消</button>
            <button className="btn-primary" onClick={confirmReset}>确认重置</button>
          </div>
        </Modal>
      )}
    </div>
  );
}


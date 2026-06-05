import { useState } from 'react';
import {
  getRecords, addRecord, getFirstDates, setFirstDate,
  todayStr, showToast
} from '../../store';
import styles from './index.module.scss';

interface DailyCardProps {
  selected: string;
  onRefresh: () => void;
  tick: number;
}

export default function DailyCard({ selected, onRefresh, tick }: DailyCardProps) {
  const [modal, setModal] = useState(false);
  const [lesson, setLesson] = useState('');
  const [count, setCount] = useState('1');

  // tick 变化触发重渲染，直接读最新数据
  void tick;
  const date = selected || todayStr();
  const records = getRecords().filter(r => r.date === date);

  // 按课程聚合
  const grouped = Object.entries(
    records.reduce<{ [key: number]: number }>((acc, r) => {
      acc[r.lesson] = (acc[r.lesson] || 0) + r.count;
      return acc;
    }, {})
  ).sort((a, b) => Number(a[0]) - Number(b[0]));

  const handleCheckin = () => {
    if (!lesson || parseInt(lesson) < 0) { showToast('请输入有效课程编号'); return; }
    if (!count || parseInt(count) < 1) { showToast('请输入有效学习次数'); return; }
    addRecord(parseInt(lesson), parseInt(count), date);
    const firstDates = getFirstDates();
    if (!firstDates[parseInt(lesson)]) setFirstDate(parseInt(lesson), date);
    setModal(false);
    setLesson('');
    setCount('1');
    showToast('打卡成功');
    onRefresh();
  };

  const openModal = () => {
    setLesson('');
    setCount('1');
    setModal(true);
  };

  return (
    <>
      <div className={`card ${styles.container}`}>
        {/* 标题行 */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>学习内容</h3>
            <p className={styles.subtitle}>
              {date === todayStr() ? `今天 · ${date}` : date}
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: 13 }}
            onClick={openModal}
          >
            打卡
          </button>
        </div>

        {/* 课程列表 */}
        {grouped.length === 0 ? (
          <p className={styles.empty}>暂无学习记录</p>
        ) : (
          grouped.map(([ls, total]) => (
            <div key={ls} className={styles.lessonItem}>
              <span>第 <strong>{String(ls).padStart(2, '0')}</strong> 课</span>
              <span className={styles.badge}>× {total} 次</span>
            </div>
          ))
        )}
      </div>

      {/* 打卡弹窗 */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-content">
            <h3 className={styles.modalTitle}>{date} 打卡</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>课程编号</label>
              <input
                type="number" min={0} max={999}
                value={lesson} onChange={e => setLesson(e.target.value)}
                placeholder="请输入课程编号"
              />
            </div>
            <div className={styles.formGroupLast}>
              <label className={styles.label}>学习次数</label>
              <input
                type="number" min={1}
                value={count} onChange={e => setCount(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className="btn-secondary" onClick={() => setModal(false)}>取消</button>
              <button className="btn-primary" onClick={handleCheckin}>确认打卡</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

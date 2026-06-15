import { useState } from 'react';
import { addRecord, getFirstDates, setFirstDate, showToast, todayStr } from '../../store';
import { MAX_LESSON } from '../../types/podcast';
import Modal from '../Modal';
import styles from './index.module.scss';

interface CheckinModalProps {
  date?: string;
  defaultLesson?: number;
  lockLesson?: boolean;
  onClose: () => void;
  onSuccess?: (lesson: number, count: number) => void;
}

export default function CheckinModal({
  date,
  defaultLesson,
  lockLesson = false,
  onClose,
  onSuccess,
}: CheckinModalProps) {
  const checkinDate = date ?? todayStr();
  const [lesson, setLesson] = useState(defaultLesson !== undefined ? String(defaultLesson) : '');
  const [count, setCount] = useState('1');

  const handleSubmit = () => {
    const lessonNum = parseInt(lesson);
    if (!lesson || lessonNum < 1 || lessonNum > MAX_LESSON) {
      showToast(`请输入有效课程编号（1-${MAX_LESSON}）`);
      return;
    }
    if (!count || parseInt(count) < 1) {
      showToast('请输入有效学习次数');
      return;
    }
    addRecord(lessonNum, parseInt(count), checkinDate);
    const firstDates = getFirstDates();
    if (!firstDates[lessonNum]) setFirstDate(lessonNum, checkinDate);
    showToast('打卡成功');
    onClose();
    onSuccess?.(lessonNum, parseInt(count));
  };

  return (
    <Modal onClose={onClose} label={`${checkinDate} 打卡`}>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <h3 className="modal-title">{checkinDate} 打卡</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>课程编号</label>
          <input
            type="number" min={1} max={MAX_LESSON}
            value={lesson}
            onChange={e => setLesson(e.target.value)}
            placeholder="请输入课程编号"
            disabled={lockLesson}
            autoFocus={!lockLesson}
          />
        </div>
        <div className={styles.formGroupLast}>
          <label className={styles.label}>学习次数</label>
          <input
            type="number" min={1}
            value={count}
            onChange={e => setCount(e.target.value)}
            autoFocus={lockLesson}
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>取消</button>
          <button type="submit" className="btn-primary">确认打卡</button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import { getRecords, todayStr, getStats, groupByLesson } from '../../store';
import ShareModal from '../ShareModal';
import CheckinModal from '../CheckinModal';
import styles from './index.module.scss';

interface DailyCardProps {
  selected: string;
  onRefresh: () => void;
  tick: number;
}

export default function DailyCard({ selected, onRefresh, tick }: DailyCardProps) {
  const [showCheckin, setShowCheckin] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  // tick 变化触发重渲染，直接读最新数据
  void tick;
  const date = selected || todayStr();
  const records = getRecords().filter(r => r.date === date);
  const grouped = groupByLesson(records);

  const openCheckin = () => setShowCheckin(true);

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
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: 13 }}
              onClick={() => setShareModal(true)}
              disabled={grouped.length === 0}
              title="分享"
            >
              分享
            </button>
            <button
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: 13 }}
              onClick={openCheckin}
            >
              打卡
            </button>
          </div>
        </div>

        {/* 课程列表 */}
        {grouped.length === 0 ? (
          <p className={styles.empty}>暂无学习记录</p>
        ) : (
          <div className={styles.listScroll}>
            {grouped.map(([ls, total]) => (
            <div key={ls} className={styles.lessonItem}>
              <span>第 <strong>{String(ls).padStart(2, '0')}</strong> 课</span>
              <span className={styles.badge}>× {total} 次</span>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* 打卡弹窗 */}
      {showCheckin && (
        <CheckinModal
          date={date}
          onClose={() => setShowCheckin(false)}
          onSuccess={() => onRefresh()}
        />
      )}

      {/* 分享弹窗 */}
      {shareModal && (
        <ShareModal
          label={date}
          stats={getStats(records)}
          groups={grouped}
          onClose={() => setShareModal(false)}
        />
      )}
    </>
  );
}

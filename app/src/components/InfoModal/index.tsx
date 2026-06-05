import styles from './index.module.scss';

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 420 }}>
        <div className={styles.infoHeader}>
          <span className={styles.infoTitle}>使用说明</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <ol className={styles.list}>
          <li>点击日历日期，右侧卡片显示该日学习内容</li>
          <li>点击右侧卡片的"打卡"按钮录入学习记录</li>
          <li>点击"查看记录"查看学习统计</li>
          <li>支持按日/周/月查看数据</li>
          <li>右侧显示近3天需复习的课程</li>
          <li>点击复习提醒右上角 ⚙ 可调整复习间隔系数（0.5~3.0）</li>
          <li>支持导出/导入数据备份</li>
          <li>可分享学习记录为图片</li>
        </ol>
      </div>
    </div>
  );
}

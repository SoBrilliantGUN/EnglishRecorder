import styles from './index.module.scss';

interface SettingsModalProps {
  onClose: () => void;
  showReview: boolean;
  onToggleReview: (val: boolean) => void;
}

export default function SettingsModal({ onClose, showReview, onToggleReview }: SettingsModalProps) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 400 }}>
        <div className={styles.settingsHeader}>
          <span className={styles.settingsTitle}>设置</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.settingItem}>
          <span className={styles.settingLabel}>显示复习提醒</span>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              className={styles.toggleInput}
              checked={showReview}
              onChange={e => onToggleReview(e.target.checked)}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </div>
    </div>
  );
}

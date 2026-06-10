import Modal from '../Modal';
import { CloseIcon } from '../icons';
import styles from './index.module.scss';

interface SettingsModalProps {
  onClose: () => void;
  showReview: boolean;
  onToggleReview: (val: boolean) => void;
  showTranslation: boolean;
  onToggleTranslation: (val: boolean) => void;
}

export default function SettingsModal({ onClose, showReview, onToggleReview, showTranslation, onToggleTranslation }: SettingsModalProps) {
  return (
    <Modal onClose={onClose} maxWidth={400}>
      <div className={styles.settingsHeader}>
        <span className={styles.settingsTitle}>设置</span>
        <button className="modal-close-btn" onClick={onClose}><CloseIcon size={16} /></button>
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

      <div className={styles.settingItem}>
        <span className={styles.settingLabel}>显示中文翻译</span>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={showTranslation}
            onChange={e => onToggleTranslation(e.target.checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
      </div>
    </Modal>
  );
}

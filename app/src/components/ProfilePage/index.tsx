import { useState, useRef, useCallback } from 'react';
import { saveUser, clearUser, maskPhone, type UserProfile } from '../../store';
import { showToast } from '../../store';
import Modal from '../Modal';
import { CloseIcon } from '../icons';
import styles from './index.module.scss';

interface ProfilePageProps {
  user: UserProfile;
  onClose: () => void;
  onUpdate: (user: UserProfile | null) => void; // null 表示退出登录
}

export default function ProfilePage({ user, onClose, onUpdate }: ProfilePageProps) {
  const [nickname, setNickname] = useState(user.nickname);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 保存
  const handleSave = useCallback(() => {
    setSaving(true);
    const updated: UserProfile = {
      ...user,
      nickname: nickname.trim(),
      avatar,
    };
    saveUser(updated);
    setSaving(false);
    showToast('保存成功');
    onUpdate(updated);
  }, [user, nickname, avatar, onUpdate]);

  // 退出登录
  const handleLogout = useCallback(() => {
    clearUser();
    showToast('已退出登录');
    onUpdate(null);
    onClose();
  }, [onUpdate, onClose]);

  // 头像上传
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 限制文件大小 2MB
    if (file.size > 2 * 1024 * 1024) {
      showToast('图片大小不能超过 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 清空 input 以便重复选择同一文件
    e.target.value = '';
  };

  const hasChanges = nickname.trim() !== user.nickname || avatar !== user.avatar;

  return (
    <Modal onClose={onClose} maxWidth={380} label="个人中心">
      {/* 标题行 */}
      <div className={styles.header}>
        <span className={styles.title}>个人中心</span>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon size={16} />
        </button>
      </div>

      {/* 头像区 */}
      <div className={styles.avatarSection}>
        <button className={styles.avatarWrapper} onClick={handleAvatarClick} title="点击更换头像">
          {avatar ? (
            <img src={avatar} alt="头像" className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarPlaceholder}>
              {nickname.trim() ? nickname.trim().charAt(0) : '?'}
            </span>
          )}
          <span className={styles.avatarOverlay}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
        </button>
        <p className={styles.avatarHint}>点击更换头像</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
      </div>

      {/* 表单 */}
      <div className={styles.form}>
        {/* 昵称 */}
        <div className={styles.field}>
          <label className={styles.label}>昵称</label>
          <input
            type="text"
            className={styles.input}
            placeholder="给自己取个名字吧"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={12}
          />
        </div>

        {/* 手机号（只读） */}
        <div className={styles.field}>
          <label className={styles.label}>手机号</label>
          <div className={styles.phoneDisplay}>
            <span className={styles.phoneText}>{maskPhone(user.phone)}</span>
            <span className={styles.phoneBadge}>已绑定</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <button
        className={styles.saveBtn}
        disabled={!hasChanges || saving}
        onClick={handleSave}
      >
        {saving ? '保存中…' : '保 存'}
      </button>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        退出登录
      </button>
    </Modal>
  );
}

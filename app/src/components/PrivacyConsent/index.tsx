import { useState } from 'react';
import PrivacyPolicy from '../PrivacyPolicy';
import UserAgreement from '../UserAgreement';
import styles from './index.module.scss';

interface PrivacyConsentProps {
  onAgree: () => void;
  onDeny: () => void;
}

type SubView = 'consent' | 'privacy' | 'agreement' | 'denied';

export default function PrivacyConsent({ onAgree, onDeny }: PrivacyConsentProps) {
  const [subView, setSubView] = useState<SubView>('consent');

  const handleDeny = () => {
    setSubView('denied');
    onDeny();
  };

  if (subView === 'privacy') {
    return <PrivacyPolicy onBack={() => setSubView('consent')} />;
  }

  if (subView === 'agreement') {
    return <UserAgreement onBack={() => setSubView('consent')} />;
  }

  if (subView === 'denied') {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🎧</span>
            <h2 className={styles.brandName}>EnglishPod</h2>
            <p className={styles.brandSub}>学习打卡</p>
          </div>
          <div className={styles.body}>
            <h3 className={styles.heading}>无法继续使用</h3>
            <p className={styles.text}>
              您需要同意《隐私政策》和《用户协议》才能使用本服务。请退出应用后重新打开，届时您可以重新选择。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 主界面：隐私同意弹窗
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* 品牌 */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🎧</span>
          <h2 className={styles.brandName}>EnglishPod</h2>
          <p className={styles.brandSub}>学习打卡</p>
        </div>

        {/* 说明 */}
        <div className={styles.body}>
          <h3 className={styles.heading}>欢迎使用 EnglishPod</h3>
          <p className={styles.text}>
            我们非常重视您的个人信息安全。在您使用本服务前，请仔细阅读并同意以下协议：
          </p>

          <div className={styles.links}>
            <button className={styles.linkItem} onClick={() => setSubView('privacy')}>
              《隐私政策》
            </button>
            <button className={styles.linkItem} onClick={() => setSubView('agreement')}>
              《用户协议》
            </button>
          </div>

          <p className={styles.summary}>
            我们将通过短信认证服务收集您的<strong>手机号码</strong>用于账号注册，
            并通过阿里云短信认证 SDK 收集<strong>设备名称、设备型号、系统版本</strong>
            用于保障服务的稳定运行。详细说明请查看上述协议。
          </p>
        </div>

        {/* 按钮 */}
        <div className={styles.actions}>
          <button className={styles.agreeBtn} onClick={onAgree}>
            同意并继续
          </button>
          <button className={styles.denyBtn} onClick={handleDeny}>
            不同意
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useCallback, useEffect } from 'react';
import { saveUser, type UserProfile } from '../../store';
import PrivacyPolicy from '../PrivacyPolicy';
import UserAgreement from '../UserAgreement';
import styles from './index.module.scss';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

const COUNTRY_CODE = '+86';
const CODE_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

type SubView = 'login' | 'privacy' | 'agreement';

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [subView, setSubView] = useState<SubView>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 倒计时逻辑
  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 发送验证码
  const handleSendCode = useCallback(() => {
    const trimmed = phone.replace(/\s/g, '');
    if (trimmed.length < 11) {
      setError('请输入正确的手机号');
      return;
    }
    setError('');
    setCodeSent(true);
    startCountdown();
    // 模拟发送验证码（无后端）
    codeInputRef.current?.focus();
  }, [phone, startCountdown]);

  // 登录
  const handleLogin = useCallback(() => {
    if (code.length !== CODE_LENGTH) {
      setError('请输入6位验证码');
      return;
    }
    setError('');
    setLoading(true);

    // 模拟验证（无后端，接受任意6位验证码）
    setTimeout(() => {
      const profile: UserProfile = {
        phone: phone.replace(/\s/g, ''),
        nickname: '',
        avatar: '',
      };
      saveUser(profile);
      setLoading(false);
      onLogin(profile);
    }, 600);
  }, [code, phone, onLogin]);

  // 格式化手机号显示
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    // 每 3-4-4 位加空格：138 0000 0000
    let formatted = '';
    for (let i = 0; i < raw.length && i < 11; i++) {
      if (i === 3 || i === 7) formatted += ' ';
      formatted += raw[i];
    }
    setPhone(formatted);
    setError('');
  };

  // 验证码只允许数字
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(raw);
    setError('');
  };

  const canLogin = phone.replace(/\s/g, '').length >= 11 && code.length === CODE_LENGTH && !loading;

  if (subView === 'privacy') {
    return <PrivacyPolicy onBack={() => setSubView('login')} />;
  }

  if (subView === 'agreement') {
    return <UserAgreement onBack={() => setSubView('login')} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* 标题区 */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🎧</span>
          <h2 className={styles.brandName}>EnglishPod</h2>
          <p className={styles.brandSub}>学习打卡</p>
        </div>

        {/* 表单区 */}
        <div className={styles.form}>
          <p className={styles.formTitle}>手机验证码登录</p>

          {/* 错误提示 */}
          {error && <p className={styles.error}>{error}</p>}

          {/* 手机号 */}
          <div className={styles.phoneRow}>
            <span className={styles.countryCode}>{COUNTRY_CODE}</span>
            <span className={styles.countryDivider} />
            <input
              type="tel"
              className={styles.phoneInput}
              placeholder="输入手机号"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={13}
              autoFocus
            />
          </div>

          {/* 验证码 */}
          <div className={styles.codeRow}>
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              className={styles.codeInput}
              placeholder="验证码"
              value={code}
              onChange={handleCodeChange}
              maxLength={CODE_LENGTH}
              autoComplete="one-time-code"
            />
            <button
              className={styles.sendBtn}
              onClick={handleSendCode}
              disabled={countdown > 0 || phone.replace(/\s/g, '').length < 11}
            >
              {countdown > 0 ? `${countdown}s 后重发` : codeSent ? '重新获取' : '获取验证码'}
            </button>
          </div>

          {/* 登录按钮 */}
          <button
            className={styles.loginBtn}
            disabled={!canLogin}
            onClick={handleLogin}
          >
            {loading ? '登录中…' : '登 录'}
          </button>
        </div>

        {/* 底部协议 */}
        <p className={styles.agreement}>
          登录即表示同意
          <button className={styles.agreementLink} onClick={() => setSubView('agreement')}>《用户协议》</button>
          和
          <button className={styles.agreementLink} onClick={() => setSubView('privacy')}>《隐私政策》</button>
        </p>
      </div>
    </div>
  );
}

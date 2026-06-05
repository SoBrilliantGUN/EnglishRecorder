import { useState, useEffect } from 'react';
import { initData, todayStr } from './store';
import { useTheme } from './hooks/useTheme';
import Calendar from './components/Calendar';
import RecordsView from './components/RecordsView';
import DailyCard from './components/DailyCard';
import ReviewReminder from './components/ReviewReminder';
import InfoModal from './components/InfoModal';
import SettingsModal from './components/SettingsModal';
import styles from './App.module.scss';

const SHOW_REVIEW_KEY = 'ep_show_review';

export default function App() {
  const [view, setView] = useState('calendar');
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState(todayStr());
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReview, setShowReview] = useState(() => localStorage.getItem(SHOW_REVIEW_KEY) !== 'false');
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => { initData(); }, []);

  const refresh = () => setTick(t => t + 1);

  const handleToggleReview = (val: boolean) => {
    setShowReview(val);
    localStorage.setItem(SHOW_REVIEW_KEY, String(val));
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>EnglishPod 学习打卡</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={toggleTheme} title="切换主题">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className={styles.iconBtn} onClick={() => setShowInfo(true)} title="使用说明">
            ℹ️
          </button>
          <button className={styles.iconBtn} onClick={() => setShowSettings(true)} title="设置">
            ⚙️
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* 左侧主区域 */}
        <div style={{ flex: '7 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {view === 'calendar'
            ? <Calendar onSwitchView={setView} tick={tick} selected={selected} onSelectDate={setSelected} />
            : <RecordsView onSwitchView={setView} onRefresh={refresh} />
          }
        </div>

        {/* 右侧侧边栏 */}
        <div style={{ flex: '3 1 240px', minWidth: 0, alignSelf: 'flex-start' }}>
          <DailyCard selected={selected} onRefresh={refresh} tick={tick} />
          {showReview && <ReviewReminder onRefresh={refresh} tick={tick} />}
        </div>
      </div>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          showReview={showReview}
          onToggleReview={handleToggleReview}
        />
      )}

      <div id="toast" />
    </>
  );
}

import { useState, useEffect } from 'react';
import { initData, todayStr } from './store';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import Calendar from './components/Calendar';
import RecordsView from './components/RecordsView';
import DailyCard from './components/DailyCard';
import ReviewReminder from './components/ReviewReminder';
import InfoModal from './components/InfoModal';
import SettingsModal from './components/SettingsModal';
import PodcastList from './components/PodcastList';
import PodcastDetail from './components/PodcastDetail';
import { MoonIcon, SunIcon, InfoIcon, SettingsIcon } from './components/icons';
import styles from './App.module.scss';

const SHOW_REVIEW_KEY = 'ep_show_review';

export default function App() {
  const [view, setView] = useState('calendar');
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState(todayStr());
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReview, setShowReview] = useLocalStorage<boolean>(SHOW_REVIEW_KEY, true);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [podcastPage, setPodcastPage] = useState(1);
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => { initData(); }, []);

  const refresh = () => setTick(t => t + 1);

  const handleSelectLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
  };

  const handleBackToPodcastList = () => {
    setSelectedLessonId(null);
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>EnglishPod 学习打卡</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={toggleTheme} title="切换主题">
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
          <button className={styles.iconBtn} onClick={() => setShowInfo(true)} title="使用说明">
            <InfoIcon size={18} />
          </button>
          <button className={styles.iconBtn} onClick={() => setShowSettings(true)} title="设置">
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {selectedLessonId ? (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 20px 40px' }}>
          <PodcastDetail
            lessonId={selectedLessonId}
            onBack={handleBackToPodcastList}
            onNavigate={setSelectedLessonId}
            onRefresh={refresh}
          />
        </div>
      ) : (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 20px 40px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {/* 左侧主区域 */}
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {view === 'calendar' && (
              <Calendar onSwitchView={setView} tick={tick} selected={selected} onSelectDate={setSelected} />
            )}
            {view === 'records' && (
              <RecordsView onSwitchView={setView} onRefresh={refresh} />
            )}
            <PodcastList onSelectLesson={handleSelectLesson} currentPage={podcastPage} onPageChange={setPodcastPage} />
          </div>

          {/* 右侧侧边栏 */}
          <div style={{ flex: '0 0 350px', minWidth: 0, alignSelf: 'flex-start' }}>
            <DailyCard selected={selected} onRefresh={refresh} tick={tick} />
            {showReview && <ReviewReminder onRefresh={refresh} tick={tick} />}
          </div>
        </div>
      )}

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          showReview={showReview}
          onToggleReview={setShowReview}
        />
      )}

      <div id="toast" />
    </>
  );
}

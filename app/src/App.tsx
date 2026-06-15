import { useState, Suspense, lazy } from 'react';
import { todayStr } from './store';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import Calendar from './components/Calendar';
import RecordsView from './components/RecordsView';
import DailyCard from './components/DailyCard';
import ReviewReminder from './components/ReviewReminder';
import PodcastList from './components/PodcastList';
import { MoonIcon, SunIcon, InfoIcon, SettingsIcon } from './components/icons';
import styles from './App.module.scss';

// 懒加载弹窗和详情页——这些组件按需渲染，避免阻塞首屏
// ShareModal 内含 html2canvas（~410 kB 未压缩），是最关键的拆分目标
const InfoModal = lazy(() => import('./components/InfoModal'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const PodcastDetail = lazy(() => import('./components/PodcastDetail'));

// 通用 Suspense fallback：弹窗和详情页在加载瞬间显示空白即可，
// 因为懒加载的 chunk 极小（<1kB 不含依赖），加载几乎瞬间完成
const LazyFallback = () => null;

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
          <button className={styles.iconBtn} onClick={toggleTheme} title="切换主题" aria-label={theme === 'light' ? '切换到暗黑模式' : '切换到浅色模式'}>
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
          <button className={styles.iconBtn} onClick={() => setShowInfo(true)} title="使用说明" aria-label="使用说明">
            <InfoIcon size={18} />
          </button>
          <button className={styles.iconBtn} onClick={() => setShowSettings(true)} title="设置" aria-label="设置">
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {selectedLessonId ? (
        <Suspense fallback={<LazyFallback />}>
          <div className={styles.layoutFull}>
            <PodcastDetail
              lessonId={selectedLessonId}
              onBack={handleBackToPodcastList}
              onNavigate={setSelectedLessonId}
              onRefresh={refresh}
            />
          </div>
        </Suspense>
      ) : (
        <div className={styles.layout}>
          {/* 左侧主区域 */}
          <div className={styles.main}>
            {view === 'calendar' && (
              <Calendar onSwitchView={setView} tick={tick} selected={selected} onSelectDate={setSelected} />
            )}
            {view === 'records' && (
              <RecordsView onSwitchView={setView} onRefresh={refresh} />
            )}
            <PodcastList onSelectLesson={handleSelectLesson} currentPage={podcastPage} onPageChange={setPodcastPage} />
          </div>

          {/* 右侧侧边栏 */}
          <div className={styles.sidebar}>
            <DailyCard selected={selected} onRefresh={refresh} tick={tick} />
            {showReview && <ReviewReminder onRefresh={refresh} tick={tick} />}
          </div>
        </div>
      )}

      {showInfo && (
        <Suspense fallback={<LazyFallback />}>
          <InfoModal onClose={() => setShowInfo(false)} />
        </Suspense>
      )}
      {showSettings && (
        <Suspense fallback={<LazyFallback />}>
          <SettingsModal
            onClose={() => setShowSettings(false)}
            showReview={showReview}
            onToggleReview={setShowReview}
          />
        </Suspense>
      )}

      <div id="toast" />
    </>
  );
}

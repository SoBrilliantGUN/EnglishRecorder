import { useState, useEffect } from 'react';
import { initData } from './store';
import Calendar from './components/Calendar';
import RecordsView from './components/RecordsView';
import ReviewReminder from './components/ReviewReminder';
import ReviewSettings from './components/ReviewSettings';
import Instructions from './components/Instructions';
import './index.css';

export default function App() {
  const [view, setView] = useState('calendar');
  const [tick, setTick] = useState(0);

  useEffect(() => { initData(); }, []);

  const refresh = () => setTick(t => t + 1);

  return (
    <>
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '14px 24px', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, color: 'var(--primary)' }}>EnglishPod 学习打卡</h1>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* 左侧主区域 */}
        <div style={{ flex: '7 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {view === 'calendar'
            ? <Calendar onSwitchView={setView} onRefresh={refresh} tick={tick} />
            : <RecordsView onSwitchView={setView} onRefresh={refresh} tick={tick} />
          }
        </div>

        {/* 右侧侧边栏 */}
        <div style={{ flex: '3 1 240px', minWidth: 0 }}>
          <ReviewReminder onRefresh={refresh} tick={tick} />
          <ReviewSettings onRefresh={refresh} />
          <Instructions />
        </div>
      </div>

      <div id="toast" />
    </>
  );
}

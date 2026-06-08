import { SingleCardProps } from '../../types';
import styles from './index.module.scss';

// 单课·清新活泼：难度色顶条，大字标题居中，气泡 badge 展示次数
export default function SingleCardWarm({
  date, lessonId, lessonCode, title, level, levelColor, thisCount, totalCount,
}: SingleCardProps) {
  return (
    <div className={styles.card} style={{
      background: 'linear-gradient(160deg, #fff9f0 0%, #ffecd6 100%)',
      borderRadius: 24, fontFamily: 'sans-serif', minWidth: 300,
      boxShadow: '0 20px 60px rgba(255,140,60,0.15)',
    }}>
      {/* 难度色顶条 */}
      <div style={{
        height: 6, background: levelColor, borderRadius: '24px 24px 0 0',
      }} />

      <div style={{ padding: '24px 28px 28px' }}>
        {/* 标签 + 难度 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 10, color: '#c4844a', letterSpacing: 2, fontWeight: 700 }}>
            EnglishPod 单课打卡
          </span>
          <span style={{ fontSize: 10, background: levelColor, color: '#fff', padding: '3px 10px', borderRadius: 100, fontWeight: 600 }}>
            {level}
          </span>
        </div>

        {/* 课程标题（主视觉焦点） */}
        <div style={{ fontSize: 26, fontWeight: 900, color: '#1a0a00', lineHeight: 1.3, marginBottom: 8 }}>
          {title}
        </div>

        {/* 课程代码 */}
        <div style={{ fontSize: 12, color: '#b07040', fontFamily: 'monospace', marginBottom: 4 }}>
          {lessonCode} &nbsp;·&nbsp; EP{String(lessonId).padStart(3, '0')}
        </div>

        {/* 日期 */}
        <div style={{ fontSize: 12, color: '#c4844a', marginBottom: 24 }}>
          {date}
        </div>

        {/* 光晕装饰 */}
        <div style={{ position: 'absolute', width: 140, height: 140, background: '#ffb347', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.25, top: 20, right: -30, pointerEvents: 'none' }} />

        {/* 次数气泡 */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#e8622a', lineHeight: 1 }}>
              {thisCount}<span style={{ fontSize: 12, color: '#c4844a', marginLeft: 2 }}>次</span>
            </div>
            <div style={{ fontSize: 10, color: '#a0754a', marginTop: 6 }}>本次学习</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#e8622a', lineHeight: 1 }}>
              {totalCount}<span style={{ fontSize: 12, color: '#c4844a', marginLeft: 2 }}>次</span>
            </div>
            <div style={{ fontSize: 10, color: '#a0754a', marginTop: 6 }}>累计学习</div>
          </div>
        </div>

        {/* 底部水印 */}
        <div style={{ marginTop: 18, textAlign: 'right', fontSize: 10, color: '#d4a07a' }}>
          EnglishPod Tracker ✦
        </div>
      </div>
    </div>
  );
}

import { SingleCardProps } from '../../types';
import styles from './index.module.scss';

// 单课·暗黑科技：课程编号做超大水印，标题叠在上层，绿色线性数据条
export default function SingleCardDark({
  date, lessonId, lessonCode, title, level, levelColor, thisCount, totalCount,
}: SingleCardProps) {
  const numStr = String(lessonId).padStart(3, '0');

  return (
    <div className={styles.card} style={{
      background: '#0a0a0a', borderRadius: 16, padding: 28,
      fontFamily: 'monospace', minWidth: 300,
    }}>
      {/* 顶部光晕 */}
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 240, height: 240,
        background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 超大水印数字 */}
      <div style={{
        position: 'absolute', bottom: -10, right: -4,
        fontSize: 140, fontWeight: 900, color: 'rgba(0,255,136,0.05)',
        lineHeight: 1, pointerEvents: 'none', letterSpacing: -4,
        fontFamily: 'monospace', userSelect: 'none',
      }}>
        {numStr}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 标签行：EP 标识 + 难度 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 10, color: '#00ff88', border: '1px solid rgba(0,255,136,0.4)', padding: '3px 10px', borderRadius: 100, letterSpacing: 1 }}>
            ENGLISHPOD
          </span>
          <span style={{ fontSize: 10, background: levelColor, color: '#fff', padding: '3px 10px', borderRadius: 100, fontFamily: 'sans-serif', fontWeight: 600 }}>
            {level}
          </span>
        </div>

        {/* 课程代码 */}
        <div style={{ fontSize: 11, color: '#555', letterSpacing: 2, marginBottom: 6 }}>
          {lessonCode}
        </div>

        {/* 课程标题 */}
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: 10 }}>
          {title}
        </div>

        {/* 日期 */}
        <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 24 }}>
          {date}
        </div>

        {/* 分隔线 */}
        <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: 16 }} />

        {/* 数据行 */}
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88', lineHeight: 1 }}>
              {thisCount}<span style={{ fontSize: 11, color: '#444', marginLeft: 2 }}>次</span>
            </div>
            <div style={{ fontSize: 10, color: '#444', marginTop: 4 }}>本次学习</div>
          </div>
          <div style={{ width: 1, background: '#1e1e1e', margin: '0 20px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88', lineHeight: 1 }}>
              {totalCount}<span style={{ fontSize: 11, color: '#444', marginLeft: 2 }}>次</span>
            </div>
            <div style={{ fontSize: 10, color: '#444', marginTop: 4 }}>累计学习</div>
          </div>
        </div>

        {/* 底部水印 */}
        <div style={{ marginTop: 20, textAlign: 'right', fontSize: 9, color: '#1e1e1e', letterSpacing: 2 }}>
          ENGLISHPOD TRACKER
        </div>
      </div>
    </div>
  );
}

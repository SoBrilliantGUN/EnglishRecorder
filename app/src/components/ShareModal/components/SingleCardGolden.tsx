import { SingleCardProps } from '../types';

// 单课·落日余晖
// 构图：上段（flex:1）金色光晕 + 课程信息 → 下段（240px）深色毛玻璃数据区
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function SingleCardGolden({
  date, lessonId, lessonCode, title, level, levelColor: _levelColor, thisCount, totalCount,
}: SingleCardProps) {
  const numStr = String(lessonId).padStart(3, '0');

  return (
    <div style={{
      width: 360, height: 640,
      background: '#1a0e06',
      borderRadius: 20,
      border: '1px solid rgba(232,152,62,0.10)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* 金色光晕 — 注意：html2canvas 不支持 CSS 渐变，使用纯色代替 */}
      <div style={{
        position: 'absolute',
        top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 360, borderRadius: '50%',
        background: 'rgba(240,160,60,0.04)',
        pointerEvents: 'none',
      }} />
      {/* 右下辅助暖光 */}
      <div style={{
        position: 'absolute',
        bottom: 160, right: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: 'rgba(200,120,40,0.02)',
        pointerEvents: 'none',
      }} />

      {/* 课号大水印 */}
      <div style={{
        position: 'absolute',
        top: 60, right: -10,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 160,
        fontWeight: 800,
        color: 'rgba(200,140,80,0.025)',
        lineHeight: 1,
        letterSpacing: -6,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {numStr}
      </div>

      {/* 上段：课程信息区 */}
      <div style={{
        flex: 1,
        position: 'relative',
        zIndex: 1,
        padding: '30px 28px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 品牌 + 难度 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#e8983e',
            }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(220,180,140,0.55)', letterSpacing: 3 }}>
              ENGLISHPOD
            </span>
          </div>
          <div style={{
            fontSize: 9, padding: '3px 12px',
            borderRadius: 100,
            border: '1px solid rgba(232,152,62,0.25)',
            color: 'rgba(232,152,62,0.75)',
            fontWeight: 700,
            letterSpacing: 1,
          }}>
            {level}
          </div>
        </div>

        {/* 课程代码 */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: 'rgba(200,160,110,0.4)',
          letterSpacing: 3,
          marginBottom: 14,
        }}>
          {lessonCode}
        </div>

        {/* 课程标题 */}
        <div style={{
          fontSize: 30,
          fontWeight: 700,
          color: '#f0e0c8',
          lineHeight: 1.3,
          marginBottom: 12,
          fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif",
        }}>
          {title}
        </div>

        {/* 暖调装饰线 */}
        <div style={{
          width: 40, height: 2,
          background: 'rgba(232,152,62,0.25)',
          borderRadius: 1,
        }} />

        {/* 日期 */}
        <div style={{
          fontSize: 11,
          color: 'rgba(200,160,110,0.35)',
          letterSpacing: 3,
          marginTop: 'auto',
        }}>
          {date}
        </div>
      </div>

      {/* 下段：深色毛玻璃数据区（固定 240px） */}
      <div style={{
        height: 240,
        flexShrink: 0,
        background: 'rgba(18,10,4,0.75)',
        borderTop: '1px solid rgba(232,152,62,0.10)',
        position: 'relative',
        zIndex: 1,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 两列数字 */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* 本次 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 9, color: 'rgba(200,160,120,0.35)',
              letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase',
            }}>
              本次学习
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: '#e8983e', lineHeight: 1, fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif" }}>
              {thisCount}
              <span style={{ fontSize: 14, color: 'rgba(200,160,110,0.35)', marginLeft: 3 }}>次</span>
            </div>
          </div>

          {/* 分隔线 */}
          <div style={{
            width: 1,
            margin: '8% 28px',
            background: 'rgba(232,152,62,0.08)',
          }} />

          {/* 累计 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 9, color: 'rgba(200,160,120,0.35)',
              letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase',
            }}>
              累计学习
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: '#e8983e', lineHeight: 1, fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif" }}>
              {totalCount}
              <span style={{ fontSize: 14, color: 'rgba(200,160,110,0.35)', marginLeft: 3 }}>次</span>
            </div>
          </div>
        </div>

        {/* 底部 footer */}
        <div style={{
          borderTop: '1px solid rgba(232,152,62,0.07)',
          paddingTop: 14,
          marginTop: 14,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: 8, color: 'rgba(200,160,110,0.15)', letterSpacing: 4 }}>
            ENGLISHPOD TRACKER
          </span>
        </div>
      </div>
    </div>
  );
}

import { SingleCardProps } from '../types';

// 单课·冰川夜
// 构图：上段（flex:1）极光星空背景 + 课程信息 → 下段（240px）磨砂玻璃数据区
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function SingleCardDark({
  date, lessonId, lessonCode, title, level, levelColor: _levelColor, thisCount, totalCount,
}: SingleCardProps) {
  const numStr = String(lessonId).padStart(3, '0');

  return (
    <div style={{
      width: 360, height: 640,
      background: '#010d18',
      borderRadius: 20,
      border: '1px solid rgba(0,180,160,0.1)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* 极光背景层 */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 400,
        background: [
          'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(0,200,180,0.14) 0%, transparent 70%)',
          'radial-gradient(ellipse 60% 80% at 10% 50%, rgba(0,80,200,0.12) 0%, transparent 60%)',
          'radial-gradient(ellipse 50% 60% at 90% 30%, rgba(0,160,220,0.10) 0%, transparent 60%)',
        ].join(', '),
        pointerEvents: 'none',
      }} />

      {/* 星点 */}
      {[
        [40,60,0.5],[90,30,0.35],[150,80,0.55],[220,45,0.3],
        [300,90,0.45],[60,140,0.25],[180,160,0.35],[320,130,0.4],
        [130,200,0.2],[260,180,0.3],[80,280,0.2],[340,220,0.25],
      ].map(([x, y, o], i) => (
        <div key={i} style={{
          position: 'absolute',
          left: x, top: y,
          width: 2, height: 2,
          borderRadius: '50%',
          background: `rgba(255,255,255,${o})`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* 课号大水印 */}
      <div style={{
        position: 'absolute',
        top: 60, right: -10,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 160,
        fontWeight: 800,
        color: 'rgba(0,200,180,0.04)',
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
              background: '#00c8b4',
              boxShadow: '0 0 10px #00c8b4',
            }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,200,180,0.7)', letterSpacing: 3 }}>
              ENGLISHPOD
            </span>
          </div>
          <div style={{
            fontSize: 9, padding: '3px 12px',
            borderRadius: 100,
            border: '1px solid rgba(0,180,200,0.3)',
            color: 'rgba(0,180,200,0.7)',
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
          color: 'rgba(0,200,180,0.35)',
          letterSpacing: 3,
          marginBottom: 14,
        }}>
          {lessonCode}
        </div>

        {/* 课程标题 */}
        <div style={{
          fontSize: 30,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1.3,
          marginBottom: 12,
        }}>
          {title}
        </div>

        {/* 日期 */}
        <div style={{
          fontSize: 11,
          color: 'rgba(0,200,180,0.3)',
          letterSpacing: 3,
          marginTop: 'auto',
        }}>
          {date}
        </div>
      </div>

      {/* 下段：磨砂玻璃数据区（固定 240px） */}
      <div style={{
        height: 240,
        flexShrink: 0,
        background: 'rgba(0,20,30,0.65)',
        borderTop: '1px solid rgba(0,200,180,0.12)',
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
              fontSize: 9, color: 'rgba(0,200,180,0.3)',
              letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase',
            }}>
              本次学习
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: '#00c8b4', lineHeight: 1, textShadow: '0 0 24px rgba(0,200,180,0.5)' }}>
              {thisCount}
              <span style={{ fontSize: 14, color: 'rgba(0,200,180,0.35)', marginLeft: 3 }}>次</span>
            </div>
          </div>

          {/* 分隔线 */}
          <div style={{
            width: 1,
            margin: '8% 28px',
            background: 'rgba(0,200,180,0.1)',
          }} />

          {/* 累计 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 9, color: 'rgba(0,200,180,0.3)',
              letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase',
            }}>
              累计学习
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: '#00c8b4', lineHeight: 1, textShadow: '0 0 24px rgba(0,200,180,0.5)' }}>
              {totalCount}
              <span style={{ fontSize: 14, color: 'rgba(0,200,180,0.35)', marginLeft: 3 }}>次</span>
            </div>
          </div>
        </div>

        {/* 底部 footer */}
        <div style={{
          borderTop: '1px solid rgba(0,200,180,0.08)',
          paddingTop: 14,
          marginTop: 14,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: 8, color: 'rgba(0,200,180,0.15)', letterSpacing: 4 }}>
            ENGLISHPOD TRACKER
          </span>
        </div>
      </div>
    </div>
  );
}

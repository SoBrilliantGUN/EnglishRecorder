import { SingleCardProps } from '../types';

// 单课·奶油纸本·信笺
// 构图：左侧深绿竖条 + 右侧信笺内容区（横线纸纹），上半课程信息，下半大数字统计
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function SingleCardCream({
  date, lessonId: _lessonId, lessonCode, title, level, thisCount, totalCount,
}: SingleCardProps) {
  return (
    <div style={{
      width: 360, height: 640,
      background: '#f5f0e8',
      borderRadius: 4,
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 左侧深绿竖条 */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 48,
        background: '#2d4a3e', zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          whiteSpace: 'nowrap',
          fontSize: 7, letterSpacing: 5, color: 'rgba(255,255,255,0.25)', fontWeight: 700,
        }}>
          ENGLISHPOD
        </div>
      </div>

      {/* 右侧主内容 */}
      <div style={{ flex: 1, marginLeft: 48, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* 横线纸纹 */}
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: 58 + i * 20,
            height: 1,
            background: 'rgba(180,140,80,0.12)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* 课程信息区 */}
        <div style={{ padding: '28px 24px 20px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 8, color: '#b09878', letterSpacing: 4, marginBottom: 16 }}>
            {date} · 单课打卡
          </div>
          <div style={{ fontSize: 10, color: '#8aaa94', letterSpacing: 3, marginBottom: 10 }}>
            {lessonCode}
          </div>
          <div style={{
            fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif",
            fontSize: 34, color: '#2d4a3e', lineHeight: 1.25, marginBottom: 12,
          }}>
            {title}
          </div>
          <div style={{
            display: 'inline-block',
            background: '#e8f2ec', borderRadius: 3,
            padding: '3px 10px',
            fontSize: 9, color: '#2d4a3e', fontWeight: 700, letterSpacing: 1,
          }}>
            {level}
          </div>
        </div>

        {/* 分割线 */}
        <div style={{
          margin: '0 24px',
          height: 2,
          background: 'linear-gradient(90deg, #2d4a3e, rgba(45,74,62,0.1))',
          position: 'relative', zIndex: 1,
        }} />

        {/* 数据区 */}
        <div style={{
          flex: 1, padding: '24px 24px 28px',
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {/* 本次 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, color: '#b09878', letterSpacing: 3, marginBottom: 8 }}>本次学习</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 80, color: '#2d4a3e', lineHeight: 0.9, fontStyle: 'italic',
              }}>
                {thisCount}
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#5a8a6e' }}>次</div>
                <div style={{ fontSize: 8, color: '#c8b898', letterSpacing: 2, marginTop: 4 }}>SESSION</div>
              </div>
            </div>
          </div>

          {/* 累计 */}
          <div>
            <div style={{ fontSize: 9, color: '#b09878', letterSpacing: 3, marginBottom: 8 }}>累计学习</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 56, color: '#5a8a6e', lineHeight: 0.9, fontStyle: 'italic',
              }}>
                {totalCount}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8aaa94' }}>次</div>
                <div style={{ fontSize: 8, color: '#c8b898', letterSpacing: 2, marginTop: 4 }}>TOTAL</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: 8, color: '#d8cdb8', letterSpacing: 3, textAlign: 'right' }}>
            EnglishPod ✦
          </div>
        </div>
      </div>
    </div>
  );
}

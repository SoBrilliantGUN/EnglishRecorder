import { SingleCardProps } from '../types';

// 单课·东京编辑部
// 构图：上段（248px）朱红色 hero 大标题 → 下段（flex:1）米色内容区含 stats
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function SingleCardWarm({
  date, lessonId, lessonCode, title, level, levelColor: _levelColor, thisCount, totalCount,
}: SingleCardProps) {
  return (
    <div style={{
      width: 360, height: 640,
      background: '#fff',
      borderRadius: 14,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* 上段：朱红 hero（固定 248px） */}
      <div style={{
        height: 248,
        flexShrink: 0,
        background: '#c1311e',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px 28px',
      }}>
        {/* 大圆装饰 */}
        <div style={{
          position: 'absolute',
          bottom: -60, right: -60,
          width: 220, height: 220,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.08)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: -40, left: -40,
          width: 160, height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        {/* 右上角圆形印章 */}
        <div style={{
          position: 'absolute',
          top: 20, right: 20,
          width: 50, height: 50,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,220,100,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <span style={{
            fontSize: 8,
            fontWeight: 700,
            color: 'rgba(255,220,100,0.6)',
            textAlign: 'center',
            lineHeight: 1.3,
            letterSpacing: 0,
          }}>
            打卡
          </span>
        </div>

        {/* 品牌标 */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          fontSize: 8,
          letterSpacing: 5,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          EnglishPod · 单课打卡
        </div>

        {/* 课程标题（主视觉） */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 32,
          fontWeight: 900,
          fontStyle: 'italic',
          color: '#fff',
          lineHeight: 1.2,
        }}>
          {title}
        </div>

        {/* 课程代码 */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          fontSize: 10,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 3,
          marginTop: 10,
        }}>
          {lessonCode} &nbsp;·&nbsp; EP{String(lessonId).padStart(3, '0')}
        </div>
      </div>

      {/* 下段：米色内容区（flex:1） */}
      <div style={{
        flex: 1,
        background: '#faf5ee',
        display: 'flex',
        flexDirection: 'column',
        padding: '26px 28px 24px',
      }}>
        {/* 难度 + 日期 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            padding: '3px 10px',
            borderRadius: 2,
            background: 'rgba(193,49,30,0.1)',
            color: '#c1311e',
          }}>
            {level}
          </span>
          <span style={{ fontSize: 10, color: '#a07850' }}>{date}</span>
        </div>

        {/* 分割线：朱红→金 */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, #c1311e 0%, #d4a030 60%, transparent 100%)',
          marginBottom: 22,
        }} />

        {/* 统计数字区 */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* 本次 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 64,
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#c1311e',
              lineHeight: 1,
            }}>
              {thisCount}
              <span style={{ fontSize: 16, color: '#a07850', fontStyle: 'normal', marginLeft: 4 }}>次</span>
            </div>
            <div style={{ fontSize: 10, color: '#b08060', marginTop: 8 }}>本次学习</div>
          </div>

          {/* 分隔 */}
          <div style={{
            width: 1,
            margin: '10% 24px',
            background: 'rgba(193,49,30,0.12)',
          }} />

          {/* 累计 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 64,
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#c1311e',
              lineHeight: 1,
            }}>
              {totalCount}
              <span style={{ fontSize: 16, color: '#a07850', fontStyle: 'normal', marginLeft: 4 }}>次</span>
            </div>
            <div style={{ fontSize: 10, color: '#b08060', marginTop: 8 }}>累计学习</div>
          </div>
        </div>

        {/* 底部水印 */}
        <div style={{
          borderTop: '1px solid rgba(193,49,30,0.08)',
          paddingTop: 14,
          fontSize: 9,
          color: '#c8a87a',
          textAlign: 'right',
          letterSpacing: 2,
        }}>
          EnglishPod Tracker ✦
        </div>
      </div>
    </div>
  );
}

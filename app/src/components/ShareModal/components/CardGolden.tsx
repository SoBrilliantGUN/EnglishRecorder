import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

// 多课·落日余晖（2-5 课）
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardGolden({ label, stats, groups }: MultiCardProps) {
  return (
    <div style={{
      width: 360,
      height: 640,
      background: 'linear-gradient(175deg, #1a0e06 0%, #241810 30%, #1f140c 60%, #1a0e06 100%)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'Outfit, PingFang SC, sans-serif',
      position: 'relative',
      border: '1px solid rgba(232,152,62,0.12)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部金色光晕 */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 200, borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 35%, rgba(240,160,60,0.10) 0%, rgba(220,130,40,0.03) 35%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* 底部暖调光 */}
      <div style={{
        position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
        width: 260, height: 100,
        background: 'radial-gradient(ellipse, rgba(180,100,30,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      {/* 细微光线纹理 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 240,
        background: 'repeating-linear-gradient(85deg, transparent, transparent 40px, rgba(240,160,60,0.012) 40px, rgba(240,160,60,0.012) 41px)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '26px 26px 22px',
        position: 'relative', zIndex: 1,
        borderBottom: '1px solid rgba(232,152,62,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#e8983e',
            }} />
            <span style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(220,180,140,0.55)', fontWeight: 700 }}>ENGLISHPOD</span>
          </div>
          <div style={{ fontSize: 8, color: 'rgba(200,160,120,0.35)', letterSpacing: 2 }}>学习打卡</div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#f0e0c8', lineHeight: 1.2, letterSpacing: -0.5 }}>{label}</div>
        <div style={{
          display: 'inline-block', marginTop: 8,
          color: '#e8983e',
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
          fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif",
        }}>
          学习记录
        </div>
      </div>

      {/* Stats 三格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', position: 'relative', zIndex: 1 }}>
        {([['打卡', stats.checkins], ['学习', stats.total], ['课程', stats.lessons]] as const).map(([l, v], i) => (
          <div key={l} style={{
            padding: '18px 20px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(232,152,62,0.08)' : 'none',
          }}>
            <div style={{
              fontSize: 36, fontWeight: 900,
              color: '#e8983e',
              lineHeight: 1,
            }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(200,160,120,0.4)', marginTop: 6, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* 暖调分割线 */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(232,152,62,0.18), rgba(200,130,50,0.06), transparent)' }} />

      {/* 课程列表 */}
      <div style={{ flex: 1, padding: '18px 26px 0', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontSize: 8, color: 'rgba(200,160,120,0.35)', letterSpacing: 4, marginBottom: 14 }}>COURSES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {groups.length === 0
            ? <div style={{ color: 'rgba(200,160,120,0.2)', fontSize: 13 }}>暂无记录</div>
            : groups.map(([lesson, count], i) => (
              <div key={lesson} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: i === 0 ? 'rgba(232,152,62,0.05)' : 'rgba(232,152,62,0.03)',
                border: `1px solid ${i === 0 ? 'rgba(232,152,62,0.14)' : 'rgba(232,152,62,0.09)'}`,
                borderRadius: 8, padding: '10px 14px', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 9, color: i === 0 ? '#e8983e' : 'rgba(220,150,90,0.7)', letterSpacing: 2, flexShrink: 0, fontWeight: 600 }}>
                    EP·{String(lesson).padStart(3, '0')}
                  </span>
                  <span style={{
                    fontSize: 12, color: i === 0 ? '#d8c8b0' : '#c8b8a0',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {getTitleById(lesson)}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? '#e8983e' : 'rgba(220,150,90,0.7)', flexShrink: 0 }}>
                  {count}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 26px 20px', textAlign: 'right', fontSize: 7, color: 'rgba(200,160,110,0.18)', letterSpacing: 4, position: 'relative', zIndex: 1, flexShrink: 0 }}>
        ENGLISHPOD TRACKER
      </div>
    </div>
  );
}

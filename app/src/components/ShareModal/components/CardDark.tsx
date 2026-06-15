import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

// 多课·暗黑科技·赛博霓虹
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardDark({ label, stats, groups }: MultiCardProps) {
  return (
    <div style={{
      background: '#08080f',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      position: 'relative',
      border: '1px solid rgba(120,80,255,0.15)',
    }}>
      {/* 紫色光晕背景 */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120,80,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '26px 26px 22px',
        position: 'relative', zIndex: 1,
        borderBottom: '1px solid rgba(120,80,255,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(120,80,255,0.5)', fontWeight: 700 }}>ENGLISHPOD</div>
          <div style={{ fontSize: 8, color: 'rgba(0,200,255,0.4)', letterSpacing: 2 }}>学习打卡</div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.2, letterSpacing: -0.5 }}>{label}</div>
        <div style={{
          display: 'inline-block', marginTop: 8,
          background: 'linear-gradient(90deg, #7850ff, #00c8ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
        }}>
          学习记录
        </div>
      </div>

      {/* Stats 三格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', position: 'relative', zIndex: 1 }}>
        {([['打卡', stats.checkins], ['学习', stats.total], ['课程', stats.lessons]] as const).map(([l, v], i) => (
          <div key={l} style={{
            padding: '18px 20px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(120,80,255,0.08)' : 'none',
          }}>
            <div style={{
              fontSize: 36, fontWeight: 900,
              color: '#7850ff',
              textShadow: '0 0 16px rgba(120,80,255,0.6)',
              lineHeight: 1,
            }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(120,80,255,0.4)', marginTop: 6, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* 渐变分割线 */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(120,80,255,0.3), rgba(0,200,255,0.2), transparent)' }} />

      {/* 课程列表 */}
      <div style={{ padding: '18px 26px 26px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 8, color: 'rgba(120,80,255,0.35)', letterSpacing: 4, marginBottom: 14 }}>COURSES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {groups.length === 0
            ? <div style={{ color: 'rgba(120,80,255,0.2)', fontSize: 13 }}>暂无记录</div>
            : groups.map(([lesson, count], i) => (
              <div key={lesson} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: i === 0 ? 'rgba(120,80,255,0.07)' : 'rgba(120,80,255,0.04)',
                border: `1px solid ${i === 0 ? 'rgba(120,80,255,0.15)' : 'rgba(120,80,255,0.08)'}`,
                borderRadius: 8, padding: '10px 14px', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 9, color: 'rgba(0,200,255,0.5)', letterSpacing: 2, flexShrink: 0 }}>
                    EP·{String(lesson).padStart(3, '0')}
                  </span>
                  <span style={{
                    fontSize: 12, color: '#666',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {getTitleById(lesson)}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', textShadow: '0 0 10px rgba(120,80,255,0.8)', flexShrink: 0 }}>
                  {count}
                </div>
              </div>
            ))
          }
        </div>
        <div style={{ marginTop: 16, textAlign: 'right', fontSize: 7, color: 'rgba(120,80,255,0.15)', letterSpacing: 4 }}>
          ENGLISHPOD TRACKER
        </div>
      </div>
    </div>
  );
}

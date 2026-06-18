import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

// 多课·清新活泼·薄荷苏打
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardWarm({ label, stats, groups }: MultiCardProps) {
  return (
    <div style={{
      width: 360,
      height: 640,
      background: '#f0faf6',
      borderRadius: 20,
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      boxShadow: '0 8px 32px rgba(0,160,100,0.1)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部渐变 header */}
      <div style={{
        background: 'linear-gradient(135deg, #00c87a 0%, #00a896 100%)',
        padding: '28px 28px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: 60,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: 100, padding: '4px 12px',
            }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 3 }}>ENGLISHPOD</span>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>学习打卡</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{label}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 8, letterSpacing: 1 }}>学习打卡记录</div>
        </div>
      </div>

      {/* Stats 三格 */}
      <div style={{ padding: '18px 28px', display: 'flex', gap: 10, borderBottom: '1px solid #d8f0e6' }}>
        {([['打卡', stats.checkins, '次'], ['学习', stats.total, '次'], ['课程', stats.lessons, '节']] as const).map(([l, v, u]) => (
          <div key={l} style={{
            flex: 1, background: '#fff', borderRadius: 14, padding: '12px 8px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(0,160,100,0.08)',
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#00a87a', lineHeight: 1 }}>
              {v}<span style={{ fontSize: 11, color: '#70b898' }}>{u}</span>
            </div>
            <div style={{ fontSize: 9, color: '#70b898', marginTop: 4, letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* 课程列表 */}
      <div style={{ flex: 1, padding: '16px 28px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontSize: 8, color: '#90c8b0', letterSpacing: 4, marginBottom: 12 }}>COURSE DETAILS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {groups.length === 0
            ? <div style={{ color: '#90c8b0', fontSize: 13 }}>暂无记录</div>
            : groups.map(([lesson, count]) => (
              <div key={lesson} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fff', borderRadius: 12, padding: '10px 14px',
                boxShadow: '0 1px 6px rgba(0,160,100,0.06)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c87a', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: '#90b8a0', flexShrink: 0 }}>{String(lesson).padStart(3, '0')}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: '#2a5040',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{getTitleById(lesson)}</span>
                </div>
                <div style={{
                  background: '#e8f8f0', borderRadius: 8, padding: '3px 10px',
                  fontSize: 12, fontWeight: 700, color: '#00a87a',
                }}>× {count}</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 28px 18px', textAlign: 'right', fontSize: 8, color: '#b0d8c4', letterSpacing: 3, flexShrink: 0 }}>
        EnglishPod Tracker ✦
      </div>
    </div>
  );
}

import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

const TOP_N = 4;

// 多课·暗黑科技·TopN（课程数 > 5 时使用）
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardDarkTopN({ label, stats, groups }: MultiCardProps) {
  const sorted = [...groups].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const restCount = rest.reduce((s, [, c]) => s + c, 0);

  return (
    <div style={{
      width: 360,
      height: 640,
      background: '#08080f',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'Outfit, PingFang SC, sans-serif',
      position: 'relative',
      border: '1px solid rgba(120,80,255,0.15)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 光晕背景 */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,80,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: '26px 26px 22px', position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(120,80,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(120,80,255,0.5)', fontWeight: 700 }}>ENGLISHPOD</div>
          <div style={{ fontSize: 8, color: 'rgba(0,200,255,0.4)', letterSpacing: 2 }}>学习打卡</div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.2, letterSpacing: -0.5 }}>{label}</div>
        <div style={{ display: 'inline-block', marginTop: 8, background: 'linear-gradient(90deg, #7850ff, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
          学习记录
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', position: 'relative', zIndex: 1 }}>
        {([['打卡', stats.checkins], ['学习', stats.total], ['课程', stats.lessons]] as const).map(([l, v], i) => (
          <div key={l} style={{ padding: '16px 20px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(120,80,255,0.08)' : 'none' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#7850ff', textShadow: '0 0 16px rgba(120,80,255,0.6)', lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(120,80,255,0.4)', marginTop: 5, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(120,80,255,0.3), rgba(0,200,255,0.2), transparent)' }} />

      {/* Top N 列表 */}
      <div style={{ flex: 1, padding: '18px 26px 0', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontSize: 8, color: 'rgba(120,80,255,0.35)', letterSpacing: 4, marginBottom: 14 }}>TOP COURSES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {top.map(([lesson, count], i) => (
            <div key={lesson} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: i === 0 ? 'rgba(120,80,255,0.1)' : 'rgba(120,80,255,0.04)',
              border: `1px solid ${i === 0 ? 'rgba(120,80,255,0.2)' : 'rgba(120,80,255,0.08)'}`,
              borderRadius: 8, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: i === 0 ? '#7850ff' : 'rgba(120,80,255,0.4)', width: 18, flexShrink: 0, textShadow: i === 0 ? '0 0 8px rgba(120,80,255,0.6)' : 'none' }}>#{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: 'rgba(0,200,255,0.4)', letterSpacing: 1, marginBottom: 2 }}>EP·{String(lesson).padStart(3, '0')}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? '#e0e0e0' : '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTitleById(lesson)}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? '#fff' : '#888', textShadow: i === 0 ? '0 0 12px rgba(120,80,255,0.8)' : 'none', flexShrink: 0 }}>{count}</div>
            </div>
          ))}
        </div>

        {/* 归并行 */}
        {rest.length > 0 && (
          <div style={{ marginTop: 8, padding: '10px 14px', border: '1px dashed rgba(120,80,255,0.15)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(120,80,255,0.3)', letterSpacing: 1 }}>还学了 {rest.length} 课</span>
            <span style={{ fontSize: 11, color: 'rgba(120,80,255,0.25)' }}>共 {restCount} 次</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 26px 20px', textAlign: 'right', fontSize: 7, color: 'rgba(120,80,255,0.15)', letterSpacing: 4, position: 'relative', zIndex: 1, flexShrink: 0 }}>ENGLISHPOD TRACKER</div>
    </div>
  );
}

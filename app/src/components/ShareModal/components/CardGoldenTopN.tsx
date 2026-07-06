import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

const TOP_N = 4;

// 多课·落日余晖·TopN（课程数 > 5 时使用）
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardGoldenTopN({ label, stats, groups }: MultiCardProps) {
  const sorted = [...groups].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const restCount = rest.reduce((s, [, c]) => s + c, 0);

  return (
    <div style={{
      width: 360,
      height: 640,
      background: '#1a0e06',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'Outfit, PingFang SC, sans-serif',
      position: 'relative',
      border: '1px solid rgba(232,152,62,0.12)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部金色光晕 — 注意：html2canvas 不支持 CSS 渐变，使用纯色代替 */}
      <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 280, height: 200, borderRadius: '50%', background: 'rgba(240,160,60,0.03)', pointerEvents: 'none' }} />
      {/* 底部暖调光 */}
      <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 260, height: 100, borderRadius: '50%', background: 'rgba(180,100,30,0.02)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: '26px 26px 22px', position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(232,152,62,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8983e' }} />
            <span style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(220,180,140,0.55)', fontWeight: 700 }}>ENGLISHPOD</span>
          </div>
          <div style={{ fontSize: 8, color: 'rgba(200,160,120,0.35)', letterSpacing: 2 }}>学习打卡</div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#f0e0c8', lineHeight: 1.2, letterSpacing: -0.5 }}>{label}</div>
        <div style={{ display: 'inline-block', marginTop: 8, color: '#e8983e', fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif" }}>
          学习记录
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', position: 'relative', zIndex: 1 }}>
        {([['打卡', stats.checkins], ['学习', stats.total], ['课程', stats.lessons]] as const).map(([l, v], i) => (
          <div key={l} style={{ padding: '16px 20px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(232,152,62,0.08)' : 'none' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#e8983e', lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(200,160,120,0.4)', marginTop: 5, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: 'rgba(232,152,62,0.08)' }} />

      {/* Top N 列表 */}
      <div style={{ flex: 1, padding: '18px 26px 0', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontSize: 8, color: 'rgba(200,160,120,0.35)', letterSpacing: 4, marginBottom: 14 }}>TOP COURSES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {top.map(([lesson, count], i) => (
            <div key={lesson} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: i === 0 ? 'rgba(232,152,62,0.07)' : 'rgba(232,152,62,0.03)',
              border: `1px solid ${i === 0 ? 'rgba(232,152,62,0.22)' : 'rgba(232,152,62,0.10)'}`,
              borderRadius: 8, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: i === 0 ? '#e8983e' : 'rgba(220,150,90,0.5)', width: 18, flexShrink: 0 }}>#{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: i === 0 ? '#e8983e' : 'rgba(220,150,90,0.55)', letterSpacing: 1, marginBottom: 2, fontWeight: 600 }}>EP·{String(lesson).padStart(3, '0')}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? '#f0e0c8' : '#c8b8a0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTitleById(lesson)}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? '#e8983e' : 'rgba(220,150,90,0.65)', flexShrink: 0 }}>{count}</div>
            </div>
          ))}
        </div>

        {/* 归并行 */}
        {rest.length > 0 && (
          <div style={{ marginTop: 8, padding: '10px 14px', border: '1px dashed rgba(232,152,62,0.10)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(200,160,120,0.35)', letterSpacing: 1 }}>还学了 {rest.length} 课</span>
            <span style={{ fontSize: 11, color: 'rgba(200,160,120,0.3)' }}>共 {restCount} 次</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 26px 20px', textAlign: 'right', fontSize: 7, color: 'rgba(200,160,110,0.18)', letterSpacing: 4, position: 'relative', zIndex: 1, flexShrink: 0 }}>ENGLISHPOD TRACKER</div>
    </div>
  );
}

import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

const TOP_N = 4;

// 多课·清新活泼·TopN（课程数 > 5 时使用）
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardWarmTopN({ label, stats, groups }: MultiCardProps) {
  const sorted = [...groups].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const restCount = rest.reduce((s, [, c]) => s + c, 0);

  const rankColor = ['#00c87a', '#60c8a0', '#a0d8b8', '#c0e8d0'];

  return (
    <div style={{ width: 360, height: 640, background: '#f0faf6', borderRadius: 20, overflow: 'hidden', fontFamily: "'Outfit', 'PingFang SC', sans-serif", boxShadow: '0 8px 32px rgba(0,160,100,0.1)', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部 */}
      <div style={{ background: '#00c87a', padding: '26px 28px 22px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 100, padding: '4px 12px' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 3 }}>ENGLISHPOD</span>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>学习打卡</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{label}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>学习打卡记录</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '14px 28px', display: 'flex', gap: 10, borderBottom: '1px solid #d8f0e6' }}>
        {([['打卡', stats.checkins, '次'], ['学习', stats.total, '次'], ['课程', stats.lessons, '门']] as const).map(([l, v, u]) => (
          <div key={l} style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '10px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,160,100,0.06)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#00a87a', lineHeight: 1 }}>{v}<span style={{ fontSize: 10, color: '#70b898' }}>{u}</span></div>
            <div style={{ fontSize: 9, color: '#70b898', marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Top N */}
      <div style={{ flex: 1, padding: '14px 28px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontSize: 8, color: '#90c8b0', letterSpacing: 4, marginBottom: 12 }}>TOP COURSES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {top.map(([lesson, count], i) => (
            <div key={lesson} style={{ display: 'flex', alignItems: 'center', gap: 10, background: i === 0 ? 'rgba(0,200,122,0.08)' : '#fff', borderRadius: 12, padding: '10px 14px', boxShadow: i === 0 ? '0 2px 10px rgba(0,168,122,0.12)' : '0 1px 6px rgba(0,160,100,0.05)', borderLeft: `3px solid ${rankColor[i]}` }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: rankColor[i], width: 18, flexShrink: 0 }}>#{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: '#90b8a0', marginBottom: 2 }}>EP·{String(lesson).padStart(3, '0')}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? '#1a3a2a' : '#2a5040', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTitleById(lesson)}</div>
              </div>
              <div style={{ background: i === 0 ? '#e8f8f0' : '#f0f8f4', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 800, color: rankColor[i], flexShrink: 0 }}>×{count}</div>
            </div>
          ))}
        </div>

        {/* 归并行 */}
        {rest.length > 0 && (
          <div style={{ marginTop: 7, background: '#e8f8f0', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#70b898' }}>还学了 {rest.length} 课</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#00a87a' }}>共 {restCount} 次</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 28px 18px', textAlign: 'right', fontSize: 8, color: '#b0d8c4', letterSpacing: 3, flexShrink: 0 }}>EnglishPod Tracker ✦</div>
    </div>
  );
}

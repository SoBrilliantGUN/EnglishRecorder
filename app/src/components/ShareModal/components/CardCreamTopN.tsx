import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

const TOP_N = 4;

// 多课·奶油纸本·TopN（课程数 > 5 时使用）
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardCreamTopN({ label, stats, groups }: MultiCardProps) {
  const sorted = [...groups].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const restCount = rest.reduce((s, [, c]) => s + c, 0);

  const rankBarColor = ['#2d4a3e', '#5a8a6e', '#8aaa94', '#aac0b0'];

  return (
    <div style={{ width: 360, height: 640, background: '#faf6ef', borderRadius: 20, overflow: 'hidden', fontFamily: "'Outfit', 'PingFang SC', sans-serif", boxShadow: '0 8px 40px rgba(180,130,60,0.12)', display: 'flex', flexDirection: 'column' }}>
      {/* 深绿顶部 */}
      <div style={{ background: 'linear-gradient(160deg, #2d4a3e 0%, #1e3328 100%)', padding: '26px 30px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>ENGLISHPOD</div>
              <div style={{ fontSize: 10, color: 'rgba(100,200,140,0.6)', letterSpacing: 2, fontWeight: 600 }}>学习记录</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stats.checkins}</div>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginTop: 2 }}>DAYS</div>
            </div>
          </div>
          <div style={{ fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif", fontSize: 28, color: '#fff', lineHeight: 1.2 }}>{label}</div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(100,200,140,0.5)' }} />
            <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#faf6ef', borderBottom: '1px solid #ede7da' }}>
        {([['打卡', stats.checkins], ['学习', stats.total], ['课程', stats.lessons]] as const).map(([l, v], i) => (
          <div key={l} style={{ textAlign: 'center', padding: '12px 0', borderRight: i < 2 ? '1px solid #ede7da' : 'none' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#2d4a3e', lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9, color: '#b09878', marginTop: 4, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Top N */}
      <div style={{ flex: 1, padding: '16px 28px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontSize: 8, color: '#c8b898', letterSpacing: 4, marginBottom: 12 }}>Top Lessons</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {top.map(([lesson, count], i) => (
            <div key={lesson} style={{ display: 'flex', alignItems: 'center', background: '#f4ede2', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: 4, alignSelf: 'stretch', background: rankBarColor[i], flexShrink: 0 }} />
              <div style={{ padding: '9px 14px', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: rankBarColor[i], flexShrink: 0, width: 22 }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: '#b09878', marginBottom: 1 }}>EP·{String(lesson).padStart(3, '0')}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#3a2e20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTitleById(lesson)}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: rankBarColor[i], flexShrink: 0 }}>
                  {count}<span style={{ fontSize: 10, color: '#b09878', marginLeft: 1 }}>次</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 归并行 */}
        {rest.length > 0 && (
          <div style={{ marginTop: 7, background: '#f4ede2', borderRadius: 10, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed #d8cdb8' }}>
            <span style={{ fontSize: 11, color: '#b09878' }}>还学了 {rest.length} 门其他课程</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8aaa94' }}>共 {restCount} 次</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 28px 18px', textAlign: 'right', fontSize: 8, color: '#d8cdb8', letterSpacing: 3, flexShrink: 0 }}>EnglishPod Tracker ✦</div>
    </div>
  );
}

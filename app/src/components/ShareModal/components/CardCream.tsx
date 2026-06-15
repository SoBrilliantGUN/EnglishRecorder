import podcastsData from '../../../data/podcasts-index';
import { MultiCardProps } from '../types';

const podcasts = podcastsData as { id: number; title: string }[];
const getTitleById = (id: string) => podcasts.find(p => p.id === Number(id))?.title ?? `第 ${id} 课`;

// 多课·奶油纸本
// 构图：深绿 hero 顶部 + 米白内容区，手账风竖条课程列表
// 注意：组件所有样式使用内联，禁止引入 CSS Modules，保证 html2canvas 导出正确
export default function CardCream({ label, stats, groups }: MultiCardProps) {
  // 竖条颜色梯度：次数最多的颜色最深
  const maxCount = groups.length > 0 ? Math.max(...groups.map(([, c]) => c)) : 1;
  const barColor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio >= 1) return '#2d4a3e';
    if (ratio >= 0.7) return '#5a8a6e';
    return '#8aaa94';
  };

  return (
    <div style={{
      background: '#faf6ef',
      borderRadius: 20,
      overflow: 'hidden',
      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
      boxShadow: '0 8px 40px rgba(180,130,60,0.12)',
    }}>
      {/* 深绿顶部 hero */}
      <div style={{
        background: 'linear-gradient(160deg, #2d4a3e 0%, #1e3328 100%)',
        padding: '28px 30px 26px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 圆圈装饰 */}
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: 180, height: 180, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        {/* 点阵底纹 */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* 顶部标签行 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>ENGLISHPOD</div>
              <div style={{ fontSize: 10, color: 'rgba(100,200,140,0.6)', letterSpacing: 2, fontWeight: 600 }}>学习记录</div>
            </div>
            {/* 打卡天数小方块 */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '6px 12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stats.checkins}</div>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginTop: 2 }}>DAYS</div>
            </div>
          </div>

          {/* 大标题 */}
          <div style={{
            fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif",
            fontSize: 32, color: '#fff', lineHeight: 1.2,
          }}>
            {label}
          </div>

          {/* 手账横线装饰 */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(100,200,140,0.5)' }} />
            <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      </div>

      {/* Stats 三格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#faf6ef', borderBottom: '1px solid #ede7da' }}>
        {([['打卡', stats.checkins], ['学习', stats.total], ['课程', stats.lessons]] as const).map(([l, v], i) => (
          <div key={l} style={{
            textAlign: 'center', padding: '14px 0',
            borderRight: i < 2 ? '1px solid #ede7da' : 'none',
          }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#2d4a3e', lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9, color: '#b09878', marginTop: 5, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* 课程列表：竖条手账风 */}
      <div style={{ padding: '18px 28px 24px' }}>
        <div style={{ fontSize: 8, letterSpacing: 4, color: '#c8b898', marginBottom: 12 }}>Lesson Log</div>

        {groups.length === 0
          ? <div style={{ color: '#c8b898', fontSize: 13 }}>暂无记录</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {groups.map(([lesson, count]) => (
                <div key={lesson} style={{
                  display: 'flex', alignItems: 'center',
                  background: '#f4ede2', borderRadius: 10, overflow: 'hidden',
                }}>
                  <div style={{ width: 4, height: 42, background: barColor(count), flexShrink: 0 }} />
                  <div style={{ padding: '8px 14px', flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 9, color: '#b09878', letterSpacing: 2, marginBottom: 2 }}>第 {String(lesson).padStart(2, '0')} 课</div>
                      <div style={{
                        fontSize: 13, fontWeight: 700, color: '#3a2e20',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{getTitleById(lesson)}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: barColor(count), flexShrink: 0 }}>
                      {count}<span style={{ fontSize: 10, color: '#b09878', marginLeft: 1 }}>次</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }

        <div style={{ marginTop: 16, textAlign: 'right', fontSize: 8, color: '#d8cdb8', letterSpacing: 3 }}>
          EnglishPod Tracker ✦
        </div>
      </div>
    </div>
  );
}

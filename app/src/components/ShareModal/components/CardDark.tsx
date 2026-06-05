import { CardProps } from '../types';

// 主题 A：暗黑科技
export default function CardDark({ label, stats, groups }: CardProps) {
  return (
    <div style={{
      background: '#0a0a0a', borderRadius: 16, padding: 28,
      fontFamily: 'monospace', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 10, color: '#00ff88', border: '1px solid #00ff88', display: 'inline-block', padding: '3px 10px', borderRadius: 100, letterSpacing: 1, marginBottom: 20 }}>
        ENGLISHPOD · STUDY LOG
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.3 }}>{label}</div>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        {([['打卡', stats.checkins, '次'], ['学习', stats.total, '次'], ['课程', stats.lessons, '节']] as const).map(([l, v, u]) => (
          <div key={l} style={{ flex: 1, borderLeft: l !== '打卡' ? '1px solid #1e1e1e' : 'none', paddingLeft: l !== '打卡' ? 16 : 0 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88' }}>{v}<span style={{ fontSize: 11, color: '#444', marginLeft: 2 }}>{u}</span></div>
            <div style={{ fontSize: 11, color: '#444' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 14 }}>
        {groups.length === 0
          ? <div style={{ color: '#333', fontSize: 13 }}>暂无记录</div>
          : groups.map(([lesson, total], i) => (
            <div key={lesson} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < groups.length - 1 ? '1px solid #111' : 'none', fontSize: 13, color: '#666' }}>
              <span>第 <strong style={{ color: '#ccc' }}>{String(lesson).padStart(2, '0')}</strong> 课</span>
              <span style={{ color: '#00ff88' }}>{total} 次</span>
            </div>
          ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'right', fontSize: 9, color: '#222', letterSpacing: 2 }}>ENGLISHPOD TRACKER</div>
    </div>
  );
}

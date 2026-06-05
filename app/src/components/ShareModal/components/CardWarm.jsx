// 主题 B：清新活泼
export default function CardWarm({ label, stats, groups }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #fff9f0 0%, #ffecd6 100%)',
      borderRadius: 24, padding: 32, fontFamily: 'sans-serif',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(255,140,60,0.15)',
    }}>
      <div style={{ position: 'absolute', width: 180, height: 180, background: '#ffb347', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.4, top: -60, right: -40 }} />
      <div style={{ position: 'absolute', width: 120, height: 120, background: '#ff6b6b', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.3, bottom: 40, left: -30 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, color: '#c4844a', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>EnglishPod 学习打卡</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#1a0a00', lineHeight: 1.2, marginBottom: 24 }}>
          {label}<br /><span style={{ color: '#e8622a', fontSize: 20 }}>学习记录</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[['打卡', stats.checkins, '次'], ['学习', stats.total, '次'], ['课程', stats.lessons, '节']].map(([l, v, u]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#e8622a' }}>{v}<span style={{ fontSize: 11, color: '#c4844a' }}>{u}</span></div>
              <div style={{ fontSize: 10, color: '#a0754a', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        {groups.length > 0 && groups.map(([lesson, total]) => (
          <div key={lesson} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: 10, fontSize: 13, color: '#6b3a1f', background: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
            <span>第 {lesson} 课</span>
            <span style={{ background: '#e8622a', color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>× {total}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, fontSize: 10, color: '#d4a07a', textAlign: 'right' }}>EnglishPod Tracker ✦</div>
      </div>
    </div>
  );
}

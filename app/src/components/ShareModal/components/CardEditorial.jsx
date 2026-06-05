import { todayStr } from '../../../store';

// 主题 C：杂志Editorial
export default function CardEditorial({ label, stats, groups }) {
  return (
    <div style={{ background: '#1c1917', borderRadius: 4, overflow: 'hidden', fontFamily: 'serif' }}>
      <div style={{ background: '#f5f0e8', padding: '24px 24px 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 24, top: 24, width: 3, height: 56, background: '#c8a96e' }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: '#a09880', marginBottom: 8, fontFamily: 'sans-serif' }}>学习记录</div>
        <div style={{ fontSize: 32, color: '#1c1917', lineHeight: 1.2 }}>{label}</div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #2e2a26' }}>
          {[['打卡', stats.checkins, '次'], ['学习', stats.total, '遍'], ['课程', stats.lessons, '门']].map(([l, v, u], i) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid #2e2a26' : 'none' }}>
              <div style={{ fontSize: 30, color: '#c8a96e' }}>{v}<span style={{ fontSize: 10, color: '#5a5348' }}>{u}</span></div>
              <div style={{ fontSize: 10, color: '#5a5348', letterSpacing: 1, fontFamily: 'sans-serif' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#5a5348', marginBottom: 10, fontFamily: 'sans-serif' }}>课程明细</div>
        {groups.length === 0
          ? <div style={{ color: '#5a5348', fontSize: 13 }}>暂无记录</div>
          : groups.map(([lesson, total], i) => (
            <div key={lesson} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < groups.length - 1 ? '1px solid #2e2a26' : 'none', color: '#a09880', fontSize: 13 }}>
              <span>第 <span style={{ fontSize: 18, color: '#f5f0e8' }}>{String(lesson).padStart(2, '0')}</span> 课</span>
              <span style={{ color: '#c8a96e', fontWeight: 700, fontFamily: 'sans-serif', fontSize: 11, letterSpacing: 1 }}>× {total} 次</span>
            </div>
          ))}
      </div>
      <div style={{ background: '#c8a96e', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: 3, color: '#1c1917', fontWeight: 700, fontFamily: 'sans-serif' }}>
        <span>ENGLISHPOD TRACKER</span>
        <span>{todayStr()}</span>
      </div>
    </div>
  );
}

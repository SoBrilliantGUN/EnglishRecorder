import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { todayStr } from '../../store';
import { THEMES } from './themes';

export default function ShareModal({ label, stats, groups, onClose }) {
  const [shareTheme, setShareTheme] = useState('dark');
  const shareRef = useRef();

  const handleDownloadImg = () => {
    const bg = shareTheme === 'dark' ? '#0a0a0a' : shareTheme === 'warm' ? '#fff9f0' : '#1c1917';
    html2canvas(shareRef.current, { backgroundColor: bg, scale: 2 }).then(canvas => {
      const a = document.createElement('a');
      a.download = `englishpod-${todayStr()}.png`;
      a.href = canvas.toDataURL();
      a.click();
    });
  };

  const activeTheme = THEMES.find(t => t.id === shareTheme);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 420 }}>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>分享学习记录</h3>

        {/* 主题选择 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setShareTheme(t.id)} style={{
              flex: 1, padding: '6px 0', borderRadius: 8, border: '2px solid',
              borderColor: shareTheme === t.id ? 'var(--primary)' : 'var(--border)',
              background: shareTheme === t.id ? 'rgba(7,193,96,0.08)' : '#fff',
              color: shareTheme === t.id ? 'var(--primary)' : 'var(--text)',
              fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* 卡片预览 */}
        <div ref={shareRef}>
          <activeTheme.Component label={label} stats={stats} groups={groups} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>关闭</button>
          <button className="btn-primary" onClick={handleDownloadImg}>下载图片</button>
        </div>
      </div>
    </div>
  );
}

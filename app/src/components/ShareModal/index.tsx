import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { todayStr } from '../../store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Modal from '../Modal';
import { THEMES } from './themes';
import { CardProps } from './types';

interface ShareModalProps extends CardProps {
  onClose: () => void;
}

const THEME_KEY = 'ep_share_theme';

export default function ShareModal({ label, stats, groups, onClose }: ShareModalProps) {
  const [shareTheme, setShareTheme] = useLocalStorage<string>(THEME_KEY, 'dark');
  const shareRef = useRef<HTMLDivElement>(null);

  const handleCopyImg = async () => {
    if (!shareRef.current) return;
    const bg = shareTheme === 'dark' ? '#0a0a0a' : shareTheme === 'warm' ? '#fff9f0' : '#1c1917';

    try {
      const canvas = await html2canvas(shareRef.current, { backgroundColor: bg, scale: 2 });

      // 尝试复制到剪贴板
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            alert('图片已复制到剪贴板');
          } catch (err) {
            console.warn('复制失败，降级为下载', err);
            fallbackDownload(canvas);
          }
        });
      } else {
        // 不支持 clipboard API，降级为下载
        fallbackDownload(canvas);
      }
    } catch (err) {
      console.error('生成图片失败', err);
    }
  };

  const fallbackDownload = (canvas: HTMLCanvasElement) => {
    const a = document.createElement('a');
    a.download = `englishpod-${todayStr()}.png`;
    a.href = canvas.toDataURL();
    a.click();
  };

  const activeTheme = THEMES.find(t => t.id === shareTheme);

  return (
    <Modal onClose={onClose} maxWidth={420}>
      <h3 style={{ marginBottom: 12, fontSize: 16 }}>分享学习记录</h3>

        {/* 主题选择 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setShareTheme(t.id)} style={{
              flex: 1, padding: '6px 0', borderRadius: 8, border: '2px solid',
              borderColor: shareTheme === t.id ? 'var(--color-primary)' : 'var(--color-border)',
              background: shareTheme === t.id ? 'rgba(7,193,96,0.08)' : 'var(--color-bg-card)',
              color: shareTheme === t.id ? 'var(--color-primary)' : 'var(--color-text)',
              fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* 卡片预览 */}
        <div ref={shareRef}>
          {activeTheme && <activeTheme.Component label={label} stats={stats} groups={groups} />}
        </div>

        <div className="modal-footer" style={{ marginTop: 16 }}>
          <button className="btn-secondary" onClick={onClose}>关闭</button>
          <button className="btn-primary" onClick={handleCopyImg}>复制图片</button>
        </div>
    </Modal>
  );
}

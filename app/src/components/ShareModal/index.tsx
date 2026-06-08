import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { todayStr, showToast } from '../../store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Modal from '../Modal';
import { MULTI_THEMES, SINGLE_THEMES } from './themes';
import { MultiCardProps, SingleCardProps } from './types';

type ShareModalProps =
  | ({ mode?: 'multi'; onClose: () => void } & MultiCardProps)
  | ({ mode: 'single'; onClose: () => void } & SingleCardProps);

const THEME_KEY = 'ep_share_theme';

export default function ShareModal(props: ShareModalProps) {
  const { onClose } = props;
  const [shareTheme, setShareTheme] = useLocalStorage<string>(THEME_KEY, 'dark');
  const shareRef = useRef<HTMLDivElement>(null);

  const isSingle = props.mode === 'single';
  const themes = isSingle ? SINGLE_THEMES : MULTI_THEMES;

  const bg = shareTheme === 'dark' ? '#0a0a0a' : '#fff9f0';

  const handleCopyImg = async () => {
    if (!shareRef.current) return;
    try {
      const canvas = await html2canvas(shareRef.current, { backgroundColor: bg, scale: 2 });
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            showToast('图片已复制到剪贴板');
          } catch (err) {
            console.warn('复制失败，降级为下载', err);
            fallbackDownload(canvas);
          }
        });
      } else {
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

  const renderCard = () => {
    if (isSingle) {
      const p = props as { mode: 'single'; onClose: () => void } & SingleCardProps;
      const theme = SINGLE_THEMES.find(t => t.id === shareTheme);
      if (!theme) return null;
      return (
        <theme.Component
          date={p.date}
          lessonId={p.lessonId}
          lessonCode={p.lessonCode}
          title={p.title}
          level={p.level}
          levelColor={p.levelColor}
          thisCount={p.thisCount}
          totalCount={p.totalCount}
        />
      );
    }
    const p = props as { mode?: 'multi'; onClose: () => void } & MultiCardProps;
    const theme = MULTI_THEMES.find(t => t.id === shareTheme);
    if (!theme) return null;
    return <theme.Component label={p.label} stats={p.stats} groups={p.groups} />;
  };

  return (
    <Modal onClose={onClose} maxWidth={420}>
      <h3 style={{ marginBottom: 12, fontSize: 16 }}>分享学习记录</h3>

      {/* 主题选择 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {themes.map(t => (
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
        {renderCard()}
      </div>

      <div className="modal-footer" style={{ marginTop: 16 }}>
        <button className="btn-secondary" onClick={onClose}>关闭</button>
        <button className="btn-primary" onClick={handleCopyImg}>复制图片</button>
      </div>
    </Modal>
  );
}

import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { todayStr, showToast } from '../../store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useScaleToFit } from '../../hooks/useScaleToFit';
import Modal from '../Modal';
import { MULTI_THEMES, SINGLE_THEMES, TOPN_THEMES } from './themes';
import { MultiCardProps, SingleCardProps } from './types';
import podcastsData from '../../data/podcasts-fixed.json';

const podcasts = podcastsData as { id: number; code: string; title: string; level: string; levelColor?: string }[];

type ShareModalProps =
  | ({ mode?: 'multi'; onClose: () => void } & MultiCardProps)
  | ({ mode: 'single'; onClose: () => void } & SingleCardProps);

const THEME_KEY = 'ep_share_theme';

// 根据课程数量判断展示模式
type DisplayMode = 'single' | 'multi' | 'topn';
function getDisplayMode(props: ShareModalProps): DisplayMode {
  if (props.mode === 'single') return 'single';
  const p = props as MultiCardProps;
  if (p.groups.length === 1) return 'single';
  if (p.groups.length <= 5) return 'multi';
  return 'topn';
}

export default function ShareModal(props: ShareModalProps) {
  const { onClose } = props;
  const [shareTheme, setShareTheme] = useLocalStorage<string>(THEME_KEY, 'dark');
  const shareRef = useRef<HTMLDivElement>(null);
  const { targetRef, contentStyle } = useScaleToFit(120);

  // 合并 ref：同时用于缩放测量和 html2canvas 截图
  const cardRef = useCallback((node: HTMLDivElement | null) => {
    shareRef.current = node;
    targetRef(node);
  }, [targetRef]);

  const displayMode = getDisplayMode(props);

  const themes =
    displayMode === 'single' ? SINGLE_THEMES :
    displayMode === 'topn'   ? TOPN_THEMES   :
                               MULTI_THEMES;

  // 截图背景色：按主题匹配
  const bgMap: Record<string, string> = {
    dark:  '#08080f',
    warm:  '#f0faf6',
    cream: '#faf6ef',
  };
  const bg = bgMap[shareTheme] ?? '#fff';

  const handleCopyImg = async () => {
    if (!shareRef.current) return;
    try {
      // onclone 在克隆的文档中清除缩放，原卡片不受影响，无抖动
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: bg,
        scale: 2,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('[data-share-card]') as HTMLElement | null;
          if (el) {
            el.style.transform = '';
            el.style.transformOrigin = '';
            el.style.marginBottom = '';
          }
        },
      });
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
    const theme = themes.find(t => t.id === shareTheme);
    if (!theme) return null;

    // 明确传了 mode: 'single'
    if (props.mode === 'single') {
      const p = props as { mode: 'single'; onClose: () => void } & SingleCardProps;
      const SingleComponent = theme.Component as React.ComponentType<SingleCardProps>;
      return (
        <SingleComponent
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

    const p = props as MultiCardProps;

    // 多课中只有 1 门课 → 自动转单课模式，从 podcasts 补全数据
    if (displayMode === 'single') {
      const [lessonId, count] = p.groups[0];
      const podcast = podcasts.find(pod => pod.id === Number(lessonId));
      const SingleComponent = theme.Component as React.ComponentType<SingleCardProps>;
      return (
        <SingleComponent
          date={p.label}
          lessonId={Number(lessonId)}
          lessonCode={podcast?.code ?? ''}
          title={podcast?.title ?? `第 ${lessonId} 课`}
          level={podcast?.level ?? ''}
          levelColor={podcast?.levelColor ?? '#07c160'}
          thisCount={count}
          totalCount={count}
        />
      );
    }

    // 普通多课 或 TopN
    const MultiComponent = theme.Component as React.ComponentType<MultiCardProps>;
    return <MultiComponent label={p.label} stats={p.stats} groups={p.groups} />;
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

      {/* 卡片预览：contentStyle 含缩放 + 负 margin 补偿布局 */}
      <div ref={cardRef} style={contentStyle} data-share-card>
        {renderCard()}
      </div>

      <div className="modal-footer" style={{ marginTop: 16 }}>
        <button className="btn-secondary" onClick={onClose}>关闭</button>
        <button className="btn-primary" onClick={handleCopyImg}>复制图片</button>
      </div>
    </Modal>
  );
}

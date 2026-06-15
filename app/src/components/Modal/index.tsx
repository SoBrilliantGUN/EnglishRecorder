import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  /** 覆盖 .modal-content 的最大宽度，默认 500px */
  maxWidth?: number;
  style?: CSSProperties;
  /** 无障碍标签，传入后作为 aria-label */
  label?: string;
}

/**
 * 基础弹窗容器：带半透明遮罩、点击外部关闭、Esc 关闭、焦点管理、入场动画。
 * 内容通过 children 传入，样式可通过 maxWidth / style 微调。
 */
export default function Modal({ onClose, children, maxWidth, style, label }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Esc 关闭
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // 弹窗打开时聚焦到内容区，关闭后归还焦点
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    contentRef.current?.focus();
    return () => {
      prevFocus?.focus();
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 焦点保持在弹窗内
  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const content = contentRef.current;
    if (!content) return;
    const focusable = content.querySelectorAll<HTMLElement>(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        ref={contentRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        style={maxWidth !== undefined ? { maxWidth, ...style, outline: 'none' } : { ...style, outline: 'none' }}
        onKeyDown={handleContentKeyDown}
      >
        {children}
      </div>
    </div>
  );
}

import type { ReactNode, CSSProperties } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  /** 覆盖 .modal-content 的最大宽度，默认 500px */
  maxWidth?: number;
  style?: CSSProperties;
}

/**
 * 基础弹窗容器：带半透明遮罩、点击外部关闭、入场动画。
 * 内容通过 children 传入，样式可通过 maxWidth / style 微调。
 */
export default function Modal({ onClose, children, maxWidth, style }: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-content"
        style={maxWidth !== undefined ? { maxWidth, ...style } : style}
      >
        {children}
      </div>
    </div>
  );
}

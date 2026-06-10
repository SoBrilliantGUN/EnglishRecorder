import { useState, useLayoutEffect, useCallback, useRef } from 'react';

/**
 * 测量元素自然尺寸与视口可用空间，返回缩放比（≤1）。
 * 用于在小屏上将弹窗内容等比缩小，避免出现滚动条。
 *
 * 关键：CSS transform 不影响 scrollHeight/scollWidth（它们反映的是布局尺寸），
 * 因此可以直接读取，无需清除 transform，不会产生视觉闪烁。
 *
 * @param overhead 额外扣除的垂直空间（标题栏、按钮、padding 等），默认 100
 */
export function useScaleToFit(overhead = 100) {
  const [scale, setScale] = useState(1);
  const elRef = useRef<HTMLDivElement | null>(null);

  const recalc = useCallback(() => {
    const el = elRef.current;
    if (!el) return;

    const naturalH = el.scrollHeight;
    const naturalW = el.scrollWidth;
    if (naturalH === 0 || naturalW === 0) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const availH = vh - rect.top - overhead;
    const parentW = el.parentElement?.clientWidth ?? rect.width;
    const availW = parentW > 0 ? parentW : rect.width;

    const s = Math.min(1, availW / naturalW, availH / naturalH);
    setScale(prev => (Math.abs(prev - s) < 0.002 ? prev : Math.max(0.5, s)));
  }, [overhead]);

  // ResizeObserver 和 resize 监听（挂载一次）
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);
    window.addEventListener('resize', recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [recalc]);

  // 每次渲染后、paint 前同步重算——确保切换主题/内容变化后首帧缩放就正确
  useLayoutEffect(() => {
    recalc();
  });

  const targetRef = useCallback((node: HTMLDivElement | null) => {
    elRef.current = node;
  }, []);

  // 从 DOM 读取自然高度（不受 transform 影响），用于计算负 margin
  const naturalH = elRef.current?.scrollHeight ?? 0;

  const contentStyle: React.CSSProperties =
    scale < 0.99 && naturalH > 0
      ? {
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: naturalH * (scale - 1),
        }
      : {};

  return { scale, targetRef, contentStyle };
}

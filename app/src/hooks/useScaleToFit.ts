import { useState, useLayoutEffect, useCallback, useRef } from 'react';

/**
 * 测量元素自然尺寸与视口可用空间，返回缩放比（≤1）。
 * 用于在小屏上将弹窗内容等比缩小，避免出现滚动条。
 *
 * @param overhead 额外扣除的垂直空间（标题栏、按钮、padding 等），默认 100
 * @returns scale: 缩放比（≥0.5）; targetRef: 绑定到目标元素的 ref callback;
 *          contentStyle: 应用到目标元素上的必要样式（transform + 负 margin）
 */
export function useScaleToFit(overhead = 100) {
  const [scale, setScale] = useState(1);
  const [naturalH, setNaturalH] = useState(0);
  const elRef = useRef<HTMLDivElement | null>(null);

  // 测量自然高度（不受 transform 影响）
  const measure = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    // 临时清除 transform 以获取真实 scrollHeight
    const prev = el.style.transform;
    const prevOrigin = el.style.transformOrigin;
    const prevMargin = el.style.marginBottom;
    el.style.transform = '';
    el.style.transformOrigin = '';
    el.style.marginBottom = '';
    setNaturalH(el.scrollHeight);
    el.style.transform = prev;
    el.style.transformOrigin = prevOrigin;
    el.style.marginBottom = prevMargin;
  }, []);

  const recalc = useCallback(() => {
    const el = elRef.current;
    if (!el || naturalH === 0) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const availH = vh - rect.top - overhead;
    // 可用宽度取当前弹窗内容宽
    const parentW = el.parentElement?.clientWidth ?? rect.width;
    const availW = parentW > 0 ? parentW : rect.width;

    const s = Math.min(1, availW / rect.width, availH / naturalH);
    // 不低于 0.5，否则文字太小不可读
    setScale(prev => (Math.abs(prev - s) < 0.002 ? prev : Math.max(0.5, s)));
  }, [overhead, naturalH]);

  // 挂载 + 尺寸变化时重新测量
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      measure();
      recalc();
    });
    ro.observe(el);
    measure();
    recalc();
    window.addEventListener('resize', recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [measure, recalc]);

  const targetRef = useCallback((node: HTMLDivElement | null) => {
    elRef.current = node;
  }, []);

  /**
   * 应用到目标元素上的样式：
   * - transform: scale(s)     → 视觉缩放
   * - transformOrigin: top center → 从顶部中心缩放，避免偏移
   * - marginBottom: 负值      → 补偿 transform 不减少 layout 高度的差额
   */
  const contentStyle: React.CSSProperties =
    scale < 0.99 && naturalH > 0
      ? {
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: naturalH * (scale - 1), // 负值，收回多余布局空间
        }
      : {};

  return { scale, targetRef, contentStyle };
}

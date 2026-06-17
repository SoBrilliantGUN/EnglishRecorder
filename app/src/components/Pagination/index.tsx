import { useMemo } from 'react';
import styles from './index.module.scss';

export interface PaginationProps {
  /** 当前页码（1-based） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;

  /**
   * 显示模式
   * - `simple`: 仅显示上/下一页按钮 + 页码指示器（默认，向后兼容）
   * - `full`: 完整页码按钮，页数过多时自动折叠省略号
   */
  variant?: 'simple' | 'full';

  /** 尺寸：sm=紧凑(28px) / md=标准(32px)，默认 md */
  size?: 'sm' | 'md';

  /** 上一页按钮文字，simple 模式默认「上一页」，full 模式默认 ‹ */
  prevLabel?: string;
  /** 下一页按钮文字，simple 模式默认「下一页」，full 模式默认 › */
  nextLabel?: string;

  /** simple 模式：是否显示 "page/totalPages" 指示器，默认 true */
  showIndicator?: boolean;

  /** full 模式：超过此页数时启用折叠省略号，默认 7 */
  maxVisible?: number;
  /** full 模式：当前页两侧各显示多少页按钮，默认 1 */
  siblingCount?: number;

  /** 当前每页条数（传入则显示条数选择器） */
  pageSize?: number;
  /** 每页条数可选项 */
  pageSizeOptions?: number[];
  /** 每页条数变化回调 */
  onPageSizeChange?: (size: number) => void;

  /** 仅一页时隐藏，默认 true */
  hideOnSinglePage?: boolean;
  /** 显示顶部分割线，默认 true */
  showDivider?: boolean;
}

/**
 * 统一分页组件
 *
 * 通过 variant 切换两种显示模式，通过 pageSize 控制条数选择器，
 * 覆盖项目中所有分页场景：
 * - 学习内容（DailyCard）→ variant="simple"
 * - 复习提醒（ReviewReminder）→ variant="simple"
 * - 打卡记录（RecordsView）→ variant="full"
 * - 课程库（PodcastList）→ variant="full" + pageSize
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  variant = 'simple',
  size = 'md',
  prevLabel,
  nextLabel,
  showIndicator,
  siblingCount = 1,
  maxVisible = 7,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  hideOnSinglePage = true,
  showDivider = true,
}: PaginationProps) {
  if (hideOnSinglePage && totalPages <= 1) return null;

  const isSimple = variant === 'simple';
  const effectivePrevLabel = prevLabel ?? (isSimple ? '上一页' : '‹');
  const effectiveNextLabel = nextLabel ?? (isSimple ? '下一页' : '›');
  const effectiveShowIndicator = showIndicator ?? isSimple;

  // 生成 full 模式的页码数组
  const pageNumbers = useMemo(() => {
    if (isSimple) return [];
    return getPageNumbers(page, totalPages, maxVisible, siblingCount);
  }, [isSimple, page, totalPages, maxVisible, siblingCount]);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  // 安全的 page（防止外部传入越界值）
  const safePage = Math.min(page, totalPages) || 1;

  return (
    <nav
      className={`${styles.container} ${!showDivider ? styles.noDivider : ''} ${styles[size]}`}
      aria-label="分页导航"
    >
      {/* 上一页 */}
      <button
        className={`${styles.btn} ${styles.btnArrow}`}
        disabled={isPrevDisabled}
        onClick={() => onPageChange(safePage - 1)}
        aria-label="上一页"
      >
        {effectivePrevLabel}
      </button>

      {/* simple 模式：页码指示器 */}
      {isSimple && effectiveShowIndicator && (
        <span className={styles.indicator}>
          {safePage}/{totalPages}
        </span>
      )}

      {/* full 模式：页码按钮 */}
      {!isSimple &&
        pageNumbers.map((p, i) =>
          p === 'ellipsis-start' || p === 'ellipsis-end' ? (
            <span key={p} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={`${p}-${i}`}
              className={`${styles.btn} ${styles.btnPage} ${safePage === p ? styles.btnActive : ''}`}
              onClick={() => onPageChange(p as number)}
              aria-label={`第 ${p} 页`}
              aria-current={safePage === p ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}

      {/* 下一页 */}
      <button
        className={`${styles.btn} ${styles.btnArrow}`}
        disabled={isNextDisabled}
        onClick={() => onPageChange(safePage + 1)}
        aria-label="下一页"
      >
        {effectiveNextLabel}
      </button>

      {/* 每页条数选择器 */}
      {pageSize !== undefined && onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 0 && (
        <select
          className={styles.pageSizeSelect}
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          aria-label="每页显示条数"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} 条/页
            </option>
          ))}
        </select>
      )}
    </nav>
  );
}

/**
 * 生成带省略号的页码数组
 *
 * 策略：
 * - 总页数 ≤ maxVisible：全部显示 [1, 2, 3, 4, 5, 6, 7]
 * - 总页数 > maxVisible：首尾固定 + 当前页邻域 + 省略号
 *
 * 例如 maxVisible=7, siblingCount=1, page=5, totalPages=20:
 *   → [1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 20]
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number,
  siblingCount: number,
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  // 总页数不超过阈值，全部显示
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 当前页左右各 siblingCount 个，加上首尾各 1 个 + 2 个省略号位
  // 确保可见按钮数不超过 maxVisible
  const visiblePages = maxVisible - 2; // 去掉首尾

  let start = Math.max(2, currentPage - siblingCount);
  let end = Math.min(totalPages - 1, currentPage + siblingCount);

  // 调整范围确保不超过 visiblePages
  while (end - start + 1 < visiblePages - 2 && (start > 2 || end < totalPages - 1)) {
    if (start > 2) start--;
    if (end < totalPages - 1) end++;
  }

  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];

  if (start > 2) {
    pages.push('ellipsis-start');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis-end');
  }

  pages.push(totalPages);

  return pages;
}

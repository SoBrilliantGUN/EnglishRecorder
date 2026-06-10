import { useState, useMemo } from 'react';
import podcastsData from '../../data/podcasts-fixed.json';
import type { Podcast } from '../../types/podcast';
import { LEVEL_COLORS } from '../../types/podcast';
import { SearchIcon } from '../icons';
import styles from './index.module.scss';

interface PodcastListProps {
  onSelectLesson: (lessonId: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function PodcastList({ onSelectLesson, currentPage, onPageChange }: PodcastListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState(20);

  const podcasts = podcastsData as Podcast[];

  // 过滤
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter(p => {
      const matchSearch = searchQuery
        ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchLevel = levelFilter === 'all' ? true : p.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [podcasts, searchQuery, levelFilter]);

  // 分页
  const totalPages = Math.ceil(filteredPodcasts.length / pageSize);
  // 防止切换 pageSize 后 currentPage 超出范围
  const safePage = Math.min(currentPage, totalPages) || 1;
  const startIndex = (safePage - 1) * pageSize;
  const currentLessons = filteredPodcasts.slice(startIndex, startIndex + pageSize);

  // 级别统计
  const levels = useMemo(() => {
    const counts: Record<string, number> = {};
    podcasts.forEach(p => {
      counts[p.level] = (counts[p.level] || 0) + 1;
    });
    return Object.keys(counts).map(level => ({ level, count: counts[level] }));
  }, [podcasts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onPageChange(1);
  };

  const handleLevelFilter = (level: string) => {
    setLevelFilter(level);
    onPageChange(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    onPageChange(1);
  };

  // 生成页码数组
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | 'ellipsis')[] = [1];
    if (safePage > 3) pages.push('ellipsis');

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (safePage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className={`card ${styles.container}`}>
      {/* 标题区 */}
      <div className={styles.header}>
        <h2>课程库</h2>
        <span className={styles.count}>{filteredPodcasts.length} 课</span>
      </div>

      {/* 搜索 */}
      <div className={styles.searchWrap}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="搜索标题或编号"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {/* 级别筛选 */}
      <div className={styles.levelFilters}>
        <button
          className={`${styles.levelBtn} ${levelFilter === 'all' ? styles.active : ''}`}
          onClick={() => handleLevelFilter('all')}
        >
          全部
        </button>
        {levels.map(({ level, count }) => (
          <button
            key={level}
            className={`${styles.levelBtn} ${levelFilter === level ? styles.active : ''}`}
            onClick={() => handleLevelFilter(level)}
            style={{ '--level-color': LEVEL_COLORS[level] } as React.CSSProperties}
          >
            <span className={styles.levelDot} />
            {level}
            <span className={styles.levelCount}>{count}</span>
          </button>
        ))}
      </div>

      {/* 课程网格 */}
      <div className={styles.grid}>
        {currentLessons.map(lesson => (
          <button
            key={lesson.id}
            className={styles.lessonCard}
            onClick={() => onSelectLesson(lesson.id)}
          >
            <span
              className={styles.levelTag}
              style={{ background: LEVEL_COLORS[lesson.level] }}
            />
            <span className={styles.lessonCode}>#{lesson.id}</span>
            <span className={styles.lessonTitle}>{lesson.title}</span>
          </button>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={safePage === 1}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="上一页"
          >
            ‹
          </button>

          {getPageNumbers().map((page, i) =>
            page === 'ellipsis' ? (
              <span key={`e-${i}`} className={styles.ellipsis}>…</span>
            ) : (
              <button
                key={page}
                className={`${styles.pageBtn} ${safePage === page ? styles.active : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className={styles.pageBtn}
            disabled={safePage === totalPages}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="下一页"
          >
            ›
          </button>

          {/* 每页条数选择 */}
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size} 条/页</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

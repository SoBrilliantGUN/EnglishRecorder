import { useState, useMemo } from 'react';
import podcastsData from '../../data/podcasts-index';
import type { PodcastMeta } from '../../types/podcast';
import { LEVEL_COLORS } from '../../types/podcast';
import { SearchIcon } from '../icons';
import Pagination from '../Pagination';
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

  const podcasts = podcastsData as PodcastMeta[];

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

      {/* 级别筛选 + 角标图例 */}
      <div className={styles.levelFilters}>
        <div className={styles.levelBtns}>
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
        <div className={styles.legend}>
          <span className={`${styles.legendTag} ${styles.legendProof}`} data-tooltip="人工校对">校</span>
          <span className={`${styles.legendTag} ${styles.legendTrans}`} data-tooltip="含中文翻译">译</span>
        </div>
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
            {lesson.isProofread && <span className={`${styles.cornerTab} ${styles.cornerProof}`} />}
            {!lesson.isProofread && lesson.hasDialogueTranslation && (
              <span className={`${styles.cornerTab} ${styles.cornerTrans}`} />
            )}
            <span className={styles.lessonCode}>#{lesson.id}</span>
            <span className={styles.lessonTitle}>{lesson.title}</span>
          </button>
        ))}
      </div>

      {/* 分页 */}
      <Pagination
        variant="full"
        page={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

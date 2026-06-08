import podcastsData from '../../data/podcasts.json';
import type { Podcast } from '../../types/podcast';
import { LEVEL_COLORS } from '../../types/podcast';
import styles from './index.module.scss';

interface PodcastDetailProps {
  lessonId: number;
  onBack: () => void;
  onNavigate: (id: number) => void;
}

export default function PodcastDetail({ lessonId, onBack, onNavigate }: PodcastDetailProps) {

  const podcasts = podcastsData as Podcast[];
  const lesson = podcasts.find(p => p.id === lessonId);

  const minId = podcasts[0]?.id ?? 1;
  const maxId = podcasts[podcasts.length - 1]?.id ?? 330;
  const hasPrev = lessonId > minId;
  const hasNext = lessonId < maxId;


  if (!lesson) {
    return (
      <div className={`card ${styles.container}`}>
        <p>课程未找到</p>
        <button className="btn-secondary" onClick={onBack}>返回</button>
      </div>
    );
  }

  return (
    <div className={`card ${styles.container}`}>
      {/* 顶部导航 */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          返回列表
        </button>
        <div className={styles.lessonMeta}>
          <span className={styles.code}>{lesson.code}</span>
          <span className={styles.levelTag} style={{ background: LEVEL_COLORS[lesson.level] }}>
            {lesson.level}
          </span>
        </div>
        <div className={styles.navBtns}>
          <button
            className={styles.navBtn}
            onClick={() => onNavigate(lessonId - 1)}
            disabled={!hasPrev}
            title="上一课"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            上一课
          </button>
          <button
            className={styles.navBtn}
            onClick={() => onNavigate(lessonId + 1)}
            disabled={!hasNext}
            title="下一课"
          >
            下一课
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* 标题 */}
      <h1 className={styles.title}>{lesson.title}</h1>

      {/* 对话内容 */}
      <div className={styles.content}>
        {lesson.content}
      </div>

    </div>
  );
}

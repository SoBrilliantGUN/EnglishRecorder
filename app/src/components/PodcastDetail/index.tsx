import { useState, useEffect } from 'react';
import podcastsData from '../../data/podcasts.json';
import type { Podcast } from '../../types/podcast';
import { LEVEL_COLORS } from '../../types/podcast';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import styles from './index.module.scss';

interface PodcastDetailProps {
  lessonId: number;
  onBack: () => void;
  onNavigate: (id: number) => void;
}

export default function PodcastDetail({ lessonId, onBack, onNavigate }: PodcastDetailProps) {
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState(false);

  const podcasts = podcastsData as Podcast[];
  const lesson = podcasts.find(p => p.id === lessonId);

  // 按需加载文字稿
  useEffect(() => {
    setTranscript('');
    setTranscriptError(false);
    setTranscriptLoading(true);
    const filename = `englishpod_${String(lessonId).padStart(4, '0')}.json`;
    fetch(`/transcripts/${filename}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json() as Promise<{ transcript: string }>;
      })
      .then(data => {
        setTranscript(data.transcript);
      })
      .catch(() => {
        setTranscriptError(true);
      })
      .finally(() => {
        setTranscriptLoading(false);
      });
  }, [lessonId]);

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
          <ChevronLeftIcon size={20} />
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
            <ChevronLeftIcon size={16} />
            上一课
          </button>
          <button
            className={styles.navBtn}
            onClick={() => onNavigate(lessonId + 1)}
            disabled={!hasNext}
            title="下一课"
          >
            下一课
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>

      {/* 标题 */}
      <h1 className={styles.title}>{lesson.title}</h1>

      {/* 对话内容 */}
      {lesson.content ? (
        <div className={styles.content}>
          {lesson.content}
        </div>
      ) : null}

      {/* 节目文字稿 */}
      <div className={styles.transcriptSection}>
        <h2 className={styles.transcriptTitle}>节目文字稿</h2>
        {transcriptLoading && (
          <p className={styles.transcriptStatus}>加载中...</p>
        )}
        {!transcriptLoading && transcriptError && (
          <p className={styles.transcriptStatus}>暂无文字稿</p>
        )}
        {!transcriptLoading && !transcriptError && transcript && (
          <div className={styles.transcript}>
            {transcript}
          </div>
        )}
      </div>

    </div>
  );
}

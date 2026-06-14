import { useState, useEffect } from 'react';
import podcastsData from '../../data/podcasts-fixed.json';
import type { Podcast, TransSegment } from '../../types/podcast';
import { LEVEL_COLORS } from '../../types/podcast';
import { getRecords, todayStr } from '../../store';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import CheckinModal from '../CheckinModal';
import ShareModal from '../ShareModal';
import styles from './index.module.scss';

interface PodcastDetailProps {
  lessonId: number;
  onBack: () => void;
  onNavigate: (id: number) => void;
  onRefresh: () => void;
}

interface SingleShareData {
  lessonCode: string;
  title: string;
  level: string;
  levelColor: string;
  thisCount: number;
  totalCount: number;
}

/** 课文内翻译显示方式 */
type TranslationMode = 'full' | 'hover';

const MODE_LABELS: Record<TranslationMode, string> = {
  full: '完全显示',
  hover: '悬浮显示',
};

const MODE_NEXT: Record<TranslationMode, TranslationMode> = {
  full: 'hover',
  hover: 'full',
};

/** 将结构化段落渲染为 JSX */
function renderSegments(
  content: string | TransSegment[],
  showZh: boolean,
  mode: 'full' | 'hover',
) {
  if (typeof content === 'string') {
    return <>{content}</>;
  }
  const containerClass = mode === 'hover' ? styles.hoverMode : styles.fullMode;
  return (
    <div className={containerClass}>
      {content.map((seg, i) => (
        <div key={i} className={styles.segment}>
          <div className={styles.enLine}>{seg.en}</div>
          {showZh && seg.zh && (
            <div className={styles.zhLine}>{seg.zh}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PodcastDetail({ lessonId, onBack, onNavigate, onRefresh }: PodcastDetailProps) {
  const [transcript, setTranscript] = useState<string | TransSegment[]>('');
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [shareData, setShareData] = useState<SingleShareData | null>(null);
  const [translationMode, setTranslationMode] = useState<TranslationMode>('full');

  const podcasts = podcastsData as Podcast[];
  const lesson = podcasts.find(p => p.id === lessonId);

  const showZh = true;
  const zhDisplayMode = translationMode;

  // 计算当前课今日是否有打卡记录，有才显示分享按钮
  const buildShareData = (): SingleShareData | null => {
    if (!lesson) return null;
    const today = todayStr();
    const allRecords = getRecords().filter(r => r.lesson === lessonId);
    const todayRecords = allRecords.filter(r => r.date === today);
    if (todayRecords.length === 0) return null;
    const thisCount = todayRecords.reduce((s, r) => s + r.count, 0);
    const totalCount = allRecords.reduce((s, r) => s + r.count, 0);
    return {
      lessonCode: lesson.code,
      title: lesson.title,
      level: lesson.level,
      levelColor: LEVEL_COLORS[lesson.level] ?? '#888',
      thisCount,
      totalCount,
    };
  };

  const todayShareData = buildShareData();

  // 按需加载文字稿
  useEffect(() => {
    setTranscript('');
    setTranscriptError(false);
    setTranscriptLoading(true);
    const filename = `englishpod_${String(lessonId).padStart(4, '0')}.json`;
    fetch(`/transcripts/${filename}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json() as Promise<{ transcript: string | TransSegment[] }>;
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

  const handleCheckinSuccess = (checkedLesson: number, count: number) => {
    if (!lesson) return;
    onRefresh();
    // 打卡成功后计算历史累计并弹出分享弹窗
    const allRecords = getRecords().filter(r => r.lesson === checkedLesson);
    const totalCount = allRecords.reduce((s, r) => s + r.count, 0);
    setShareData({
      lessonCode: lesson.code,
      title: lesson.title,
      level: lesson.level,
      levelColor: LEVEL_COLORS[lesson.level] ?? '#888',
      thisCount: count,
      totalCount,
    });
  };

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
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink} onClick={onBack}>
            课程库
          </button>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.code}>{lesson.code}</span>
          <span className={styles.levelTag} style={{ background: LEVEL_COLORS[lesson.level] }}>
            {lesson.level}
          </span>
        </div>
        <div className={styles.navBtns}>
          {todayShareData && (
            <button
              className="btn-secondary"
              style={{ padding: '0.5rem 0.875rem', fontSize: 'var(--font-size-sm)' }}
              onClick={() => setShareData(todayShareData)}
              title="分享本课打卡"
            >
              分享
            </button>
          )}
          <button
            className="btn-primary"
            style={{ padding: '0.5rem 0.875rem', fontSize: 'var(--font-size-sm)' }}
            onClick={() => setShowCheckin(true)}
            title="单课打卡"
          >
            单课打卡
          </button>
          <button
            className={styles.translationToggle}
            onClick={() => setTranslationMode(MODE_NEXT[translationMode])}
            title={`翻译模式：${MODE_LABELS[translationMode]}`}
          >
            译
          </button>
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
          {renderSegments(lesson.content, showZh, zhDisplayMode)}
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
            {renderSegments(transcript, showZh, zhDisplayMode)}
          </div>
        )}
      </div>

      {/* 单课打卡弹窗 */}
      {showCheckin && (
        <CheckinModal
          date={todayStr()}
          defaultLesson={lessonId}
          lockLesson
          onClose={() => setShowCheckin(false)}
          onSuccess={handleCheckinSuccess}
        />
      )}

      {/* 单课分享弹窗 */}
      {shareData && (
        <ShareModal
          mode="single"
          date={todayStr()}
          lessonId={lessonId}
          lessonCode={shareData.lessonCode}
          title={shareData.title}
          level={shareData.level}
          levelColor={shareData.levelColor}
          thisCount={shareData.thisCount}
          totalCount={shareData.totalCount}
          onClose={() => setShareData(null)}
        />
      )}
    </div>
  );
}

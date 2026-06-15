/**
 * EnglishPod 课程相关类型定义
 */

/** 翻译段落：一句英文 + 对应中文 */
export interface TransSegment {
  en: string;
  zh: string;
}

/** 课程元数据（静态索引） */
export interface PodcastMeta {
  id: number;
  code: string; // 如 B0001, C0320
  level: string; // Elementary, Intermediate, Upper-Intermediate, Advanced
  title: string;
}

/** 课程完整信息（元数据 + 按需加载的对话） */
export interface Podcast extends PodcastMeta {
  content: string | TransSegment[]; // 对话文本（兼容旧格式）
}

/** 级别颜色映射 */
export const LEVEL_COLORS: Record<string, string> = {
  'Elementary': 'var(--color-success)',
  'Intermediate': 'var(--color-info)',
  'Upper-Intermediate': 'var(--color-warning)',
  'Advanced': 'var(--color-danger)',
};

export { MAX_LESSON } from '../data/podcasts-index';

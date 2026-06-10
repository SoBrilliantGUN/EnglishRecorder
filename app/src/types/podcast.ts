/**
 * EnglishPod 课程相关类型定义
 */

/** 翻译段落：一句英文 + 对应中文 */
export interface TransSegment {
  en: string;
  zh: string;
}

/** 课程基本信息 */
export interface Podcast {
  id: number;
  code: string; // 如 B0001, C0320
  level: string; // Elementary, Intermediate, Upper-Intermediate, Advanced
  title: string;
  content: string | TransSegment[]; // 对话文本（兼容旧格式）
}

/** 级别颜色映射 */
export const LEVEL_COLORS: Record<string, string> = {
  'Elementary': 'var(--color-success)',
  'Intermediate': 'var(--color-info)',
  'Upper-Intermediate': 'var(--color-warning)',
  'Advanced': 'var(--color-danger)',
};

import podcastsData from '../data/podcasts-fixed.json';
const _podcasts = podcastsData as Podcast[];

/** 课程库最大课程编号 */
export const MAX_LESSON = Math.max(..._podcasts.map(p => p.id));

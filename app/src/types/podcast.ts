/**
 * EnglishPod 课程相关类型定义
 */

/** 课程基本信息 */
export interface Podcast {
  id: number;
  code: string; // 如 B0001, C0320
  level: string; // Elementary, Intermediate, Upper-Intermediate, Advanced
  title: string;
  content: string; // 对话文本
}

/** 级别颜色映射 */
export const LEVEL_COLORS: Record<string, string> = {
  'Elementary': 'var(--color-success)',
  'Intermediate': 'var(--color-info)',
  'Upper-Intermediate': 'var(--color-warning)',
  'Advanced': 'var(--color-danger)',
};

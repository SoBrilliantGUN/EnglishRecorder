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

/** 收藏的单词/短语 */
export interface PodcastCollection {
  lessonId: number;
  text: string; // 收藏的单词或短语
  context: string; // 上下文（所在句子）
  timestamp: number;
}

/** 笔记 */
export interface PodcastNote {
  lessonId: number;
  selectedText: string; // 选中的文本
  note: string; // 笔记内容
  timestamp: number;
}

/** 级别颜色映射 */
export const LEVEL_COLORS: Record<string, string> = {
  'Elementary': 'var(--color-success)',
  'Intermediate': 'var(--color-info)',
  'Upper-Intermediate': 'var(--color-warning)',
  'Advanced': 'var(--color-danger)',
};

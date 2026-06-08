import { ComponentType } from 'react';

// 多课分享数据
export interface MultiCardProps {
  label: string;
  stats: {
    checkins: number;
    total: number;
    lessons: number;
  };
  groups: [string, number][];
}

// 单课分享数据
export interface SingleCardProps {
  date: string;
  lessonId: number;
  lessonCode: string;
  title: string;
  level: string;
  levelColor: string;
  thisCount: number;
  totalCount: number;
}

export interface MultiTheme {
  id: string;
  label: string;
  Component: ComponentType<MultiCardProps>;
}

export interface SingleTheme {
  id: string;
  label: string;
  Component: ComponentType<SingleCardProps>;
}

// 向后兼容
export type CardProps = MultiCardProps;
export type Theme = MultiTheme;

import { ComponentType } from 'react';

export interface CardProps {
  label: string;
  stats: {
    checkins: number;
    total: number;
    lessons: number;
  };
  groups: [string, number][];
}

export interface Theme {
  id: string;
  label: string;
  Component: ComponentType<CardProps>;
}

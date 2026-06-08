import { useState } from 'react';
import { getCoef, setCoef, todayStr, addDays, formatDate } from '../store';

const INTERVALS = [1, 2, 4, 7, 15, 30, 60];

export interface CoefPreview {
  round: number;
  days: number;
  date: string;
}

interface UseCoefResult {
  coef: number;
  adjust: (delta: number) => void;
  reset: () => void;
  previews: CoefPreview[];
}

/**
 * 复习间隔系数管理：读取/调整/重置系数，同步预览各轮复习日期。
 * 调整后自动调用 onRefresh 通知父级刷新。
 */
export function useCoef(onRefresh: () => void): UseCoefResult {
  const [coef, setCoefState] = useState(getCoef);

  const adjust = (delta: number) => {
    const newVal = setCoef(coef + delta);
    setCoefState(newVal);
    onRefresh();
  };

  const reset = () => {
    const newVal = setCoef(1.0);
    setCoefState(newVal);
    onRefresh();
  };

  const today = new Date(todayStr());
  const previews: CoefPreview[] = INTERVALS.map((interval, i) => {
    const days = Math.round(interval * coef);
    return { round: i + 1, days, date: formatDate(addDays(today, days)) };
  });

  return { coef, adjust, reset, previews };
}

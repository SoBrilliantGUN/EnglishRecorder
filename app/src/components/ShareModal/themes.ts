import CardDark from './components/CardDark';
import CardWarm from './components/CardWarm';
import SingleCardDark from './components/SingleCardDark';
import SingleCardWarm from './components/SingleCardWarm';
// 注意：以上组件均为单文件（.tsx），禁止拆分为目录形式，确保 html2canvas 导出正确
import { MultiTheme, SingleTheme } from './types';

export const MULTI_THEMES: MultiTheme[] = [
  { id: 'dark', label: '暗黑科技', Component: CardDark },
  { id: 'warm', label: '清新活泼', Component: CardWarm },
];

export const SINGLE_THEMES: SingleTheme[] = [
  { id: 'dark', label: '暗黑科技', Component: SingleCardDark },
  { id: 'warm', label: '清新活泼', Component: SingleCardWarm },
];

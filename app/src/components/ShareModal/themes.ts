import CardDark from './components/CardDark';
import CardWarm from './components/CardWarm';
import CardCream from './components/CardCream';
import CardDarkTopN from './components/CardDarkTopN';
import CardWarmTopN from './components/CardWarmTopN';
import CardCreamTopN from './components/CardCreamTopN';
import SingleCardDark from './components/SingleCardDark';
import SingleCardWarm from './components/SingleCardWarm';
import SingleCardCream from './components/SingleCardCream';
// 注意：以上组件均为单文件（.tsx），禁止拆分为目录形式，确保 html2canvas 导出正确
import { MultiTheme, SingleTheme } from './types';

export const MULTI_THEMES: MultiTheme[] = [
  { id: 'dark',  label: '暗黑科技', Component: CardDark  },
  { id: 'warm',  label: '清新活泼', Component: CardWarm  },
  { id: 'cream', label: '奶油纸本', Component: CardCream },
];

// 课程数 > 5 时使用，与 MULTI_THEMES 共享同一套 id，主题切换状态互通
export const TOPN_THEMES: MultiTheme[] = [
  { id: 'dark',  label: '暗黑科技', Component: CardDarkTopN  },
  { id: 'warm',  label: '清新活泼', Component: CardWarmTopN  },
  { id: 'cream', label: '奶油纸本', Component: CardCreamTopN },
];

export const SINGLE_THEMES: SingleTheme[] = [
  { id: 'dark',  label: '暗黑科技', Component: SingleCardDark  },
  { id: 'warm',  label: '清新活泼', Component: SingleCardWarm  },
  { id: 'cream', label: '奶油纸本', Component: SingleCardCream },
];

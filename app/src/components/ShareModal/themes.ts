import CardDark from './components/CardDark';
import CardWarm from './components/CardWarm';
import SingleCardDark from './components/SingleCardDark';
import SingleCardWarm from './components/SingleCardWarm';
import { MultiTheme, SingleTheme } from './types';

export const MULTI_THEMES: MultiTheme[] = [
  { id: 'dark', label: '暗黑科技', Component: CardDark },
  { id: 'warm', label: '清新活泼', Component: CardWarm },
];

export const SINGLE_THEMES: SingleTheme[] = [
  { id: 'dark', label: '暗黑科技', Component: SingleCardDark },
  { id: 'warm', label: '清新活泼', Component: SingleCardWarm },
];

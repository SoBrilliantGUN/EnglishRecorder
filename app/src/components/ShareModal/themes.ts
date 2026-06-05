import CardDark from './components/CardDark';
import CardWarm from './components/CardWarm';
import CardEditorial from './components/CardEditorial';
import { Theme } from './types';

export const THEMES: Theme[] = [
  { id: 'dark', label: '暗黑科技', Component: CardDark },
  { id: 'warm', label: '清新活泼', Component: CardWarm },
  { id: 'editorial', label: '杂志风', Component: CardEditorial },
];

import CardDark from './components/CardDark';
import CardWarm from './components/CardWarm';
import CardEditorial from './components/CardEditorial';

export const THEMES = [
  { id: 'dark', label: '暗黑科技', Component: CardDark },
  { id: 'warm', label: '清新活泼', Component: CardWarm },
  { id: 'editorial', label: '杂志风', Component: CardEditorial },
];

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'ep_theme';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY, 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return { theme, toggle } as const;
}

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'afkar-theme-mode';
const THEME_EVENT = 'afkar-theme-change';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function useThemeMode() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const syncTheme = () => setTheme(getInitialTheme());
    window.addEventListener('storage', syncTheme);
    window.addEventListener(THEME_EVENT, syncTheme);

    return () => {
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener(THEME_EVENT, syncTheme);
    };
  }, []);

  const setMode = (nextTheme) => {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const toggleTheme = () => setMode(theme === 'dark' ? 'light' : 'dark');

  return {
    theme,
    isLight: theme === 'light',
    toggleTheme,
    setTheme: setMode,
  };
}

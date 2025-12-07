import { useEffect, useState } from 'react';

/**
 * Custom hook for managing system theme preference
 * Automatically detects and applies system dark/light mode preference
 * Provides optional manual theme override capability
 */
export const useSystemTheme = () => {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Use system preference
      applySystemTheme();
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme-preference')) {
        applySystemTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applySystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (selectedTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      applySystemTheme();
    }
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('theme-preference');
    } else {
      localStorage.setItem('theme-preference', newTheme);
    }
  };

  return { theme, toggleTheme, applyTheme };
};

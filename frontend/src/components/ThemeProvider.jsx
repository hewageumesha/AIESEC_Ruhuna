import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-white min-h-screen">
        {children}
      </div>
    </div>
  );
}
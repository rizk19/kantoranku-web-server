import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const onChange = useCallback(
    (e) => {
      setTheme(e.currentTarget.value);
    },
    [setTheme]
  );
  return (
    <select value={theme} onChange={onChange} className={styles.select}>
      <option value="system">System Theme</option>
      <option value="dark">Dark Theme</option>
      <option value="light">Light Theme</option>
    </select>
  );
};

export default ThemeSwitcher;

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const useThemeStore = create<ThemeStore>()(
  devtools((set) => ({
    isDark: localStorage.getItem('theme') === 'dark' || false,
    toggleTheme: () =>
      set((state) => {
        const newDark = !state.isDark;
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
        return { isDark: newDark };
      }),
    setTheme: (isDark) => {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      set({ isDark });
    },
  }))
);

export default useThemeStore;

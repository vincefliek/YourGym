import { ApiFactory, ThemeApi, ThemeMode } from '../../types';

export const createThemeApi: ApiFactory<ThemeApi, {}> = ({ store }) => {
  const getTheme = (): ThemeMode =>
    store.getStoreData(['theme']).theme || 'light';

  const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    store.theme = newTheme;
  };

  return {
    getTheme,
    toggleTheme,
  };
};

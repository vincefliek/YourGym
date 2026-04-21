export interface NavbarProps {
  onHomeClick: () => void;
  onTrainingsClick: () => void;
  onBurgerClick: () => void;
  onDashboardClick: () => void;
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark';
  isHomeActive: boolean;
  isTrainingsActive: boolean;
  isBurgerActive: boolean;
  isDashboardActive: boolean;
}

export interface NavbarState {}

export interface NavbarController {
  onHomeClick: () => void;
  onTrainingsClick: () => void;
  onBurgerClick: () => void;
  onDashboardClick: () => void;
  onThemeToggle: () => void;
  getCurrentTheme: () => 'light' | 'dark';
  isHomeActive: () => boolean;
  isTrainingsActive: () => boolean;
  isBurgerActive: () => boolean;
  isDashboardActive: () => boolean;
  storeDataAccessors: string[];
}

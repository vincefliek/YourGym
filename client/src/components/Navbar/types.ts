export interface NavbarProps {
  onHomeClick: () => void;
  onTrainingsClick: () => void;
  onBurgerClick: () => void;
  onDashboardClick: () => void;
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
  isHomeActive: () => boolean;
  isTrainingsActive: () => boolean;
  isBurgerActive: () => boolean;
  isDashboardActive: () => boolean;
  storeDataAccessors: string[];
}

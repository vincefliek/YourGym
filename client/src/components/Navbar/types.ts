export interface NavbarProps {
  onHomeClick: () => void;
  onTrainingsClick: () => void;
  onBurgerClick: () => void;
  isHomeActive: boolean;
  isTrainingsActive: boolean;
  isBurgerActive: boolean;
}

export interface NavbarState {}

export interface NavbarController {
  onHomeClick: () => void;
  onTrainingsClick: () => void;
  onBurgerClick: () => void;
  isHomeActive: () => boolean;
  isTrainingsActive: () => boolean;
  isBurgerActive: () => boolean;
  storeDataAccessors: string[];
}

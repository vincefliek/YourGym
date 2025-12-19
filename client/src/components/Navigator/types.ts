export interface NavigatorProps {
  route: string | null;
  replace: boolean;
  onNavigateFinish: () => void;
}

export interface NavigatorState {}

export interface NavigatorController {
  getRoute: () => string | null;
  isReplace: () => boolean;
  onNavigateFinish: () => void;
  storeDataAccessors: string[];
}

export interface HomeProps {
  onClick: () => void;
}

export interface HomeState {}

export interface HomeController {
  goToTraining: () => void;
  storeDataAccessors: string[];
}

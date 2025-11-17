import { CompletedTraining } from '../../model/types';

export interface HomeProps {
  isAuthenticated: boolean;
  completedTraining: CompletedTraining[];
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
}

export interface HomeController {
  isAuthenticated: () => boolean;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
  getCompletedTrainings: () => CompletedTraining[];
}

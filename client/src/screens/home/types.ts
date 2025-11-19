import { CompletedTraining, TimestampTZ } from '../../model/types';

interface DateAndTime {
  date: string;
  time: string;
}

export interface HomeProps {
  isAuthenticated: boolean;
  completedTrainings: CompletedTraining[];
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
  onDeleteCompletedTraining: (trainingId: string) => void;
  getDateAndTime: (timestamptz: TimestampTZ) => DateAndTime;
}

export interface HomeController {
  isAuthenticated: () => boolean;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
  getCompletedTrainings: () => CompletedTraining[];
  onDeleteCompletedTraining: (trainingId: string) => void;
  getDateAndTime: (timestamptz: TimestampTZ) => DateAndTime;
}

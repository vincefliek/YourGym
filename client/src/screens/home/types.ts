import {
  CompletedTraining,
  CompletedSet,
  TimestampTZ,
} from '../../model/types';

interface DateAndTime {
  date: string;
  time: string;
}

export interface HomeProps {
  isAuthenticated: boolean;
  completedTrainings: CompletedTraining[];
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  onDeleteCompletedTraining: (trainingId: string) => void;
  getDateAndTime: (timestamptz: TimestampTZ) => DateAndTime;
  createSetsPreview: (sets: CompletedSet[]) => string;
}

export interface HomeController {
  isAuthenticated: () => boolean;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  getCompletedTrainings: () => CompletedTraining[];
  onDeleteCompletedTraining: (trainingId: string) => void;
  getDateAndTime: (timestamptz: TimestampTZ) => DateAndTime;
  createSetsPreview: (sets: CompletedSet[]) => string;
}

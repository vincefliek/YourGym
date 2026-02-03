import {
  Training as TrainingModel,
  Exercise as ExerciseModel,
} from '../../model/types';

type Exercise = Omit<ExerciseModel, 'sets'> & {
  setsPreview: string;
};

type Training = Omit<TrainingModel, 'exercises'> & {
  exercises: Exercise[];
};

export interface Props {
  data: Training;
  isAnyTrainingInProgress: boolean;
  isCurrentTrainingInProgress: boolean;
  onNoData: () => void;
  onStart: () => void;
  onFinish: () => void;
  onBack: () => void;
  onEdit: () => void;
  onOpenExercise: (training: Training, exercise: Exercise) => void;
}

export interface ControllerReturnType {
  isAnyTrainingInProgress: () => boolean;
  isCurrentTrainingInProgress: () => boolean;
  getTraining: () => Training | undefined;
  onNoData: () => void;
  onStart: () => void;
  onFinish: () => void;
  onBack: () => void;
  onEdit: () => void;
  onOpenExercise: (training: Training, exercise: Exercise) => void;
}

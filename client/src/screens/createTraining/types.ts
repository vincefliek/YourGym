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
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
  onReorderExercises: (trainingId: string, exercises: { id: string }[]) => void;
}

export interface Controller {
  getData: () => Training | undefined;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
  onReorderExercises: (trainingId: string, exercises: { id: string }[]) => void;
}

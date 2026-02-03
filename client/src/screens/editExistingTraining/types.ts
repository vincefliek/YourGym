import { Training } from '../../model/types';

export interface ControllerReturnType {
  getTraining: () => Training | undefined;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onEditExercise: (exerciseId: string) => void;
  onReorderExercises: (trainingId: string, exercises: { id: string }[]) => void;
}

import { Exercise } from '../../model/types';

export interface CreateExerciseProps {
  data: Exercise;
  onChangeName: (name: string) => void;
  onChangeRepetitions: (setId: string, value: string) => void;
  onChangeWeight: (setId: string, value: string) => void;
  onNoData: () => void;
  onAddSet: () => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onDelete: () => void;
  onSave: () => void;
}

export interface CreateExerciseState {}

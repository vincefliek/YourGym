import { Exercise } from '../../model/types';

export interface ExerciseProps {
  data: Exercise;
  onChangeName: (value: string) => void;
  onDeleteSet: (setId: string) => void;
  onChangeRepetitions: (setId: string, value: string) => void;
  onChangeWeight: (setId: string, value: string) => void;
  onAddSet: () => void;
  onDelete: () => void;
  onSave: () => void;
}

export interface ExerciseState {}

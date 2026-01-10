import { Exercise } from '../../model/types';

export interface CreateExerciseOwnProps {
  goBack: () => void;
}

export interface CreateExerciseStateProps {
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

export interface Controller {
  getData: () => Exercise;
  onNoData: () => void;
  onChangeName: (name: string) => void;
  onChangeRepetitions: (setId: string, value: string) => void;
  onChangeWeight: (setId: string, value: string) => void;
  onAddSet: () => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onDelete: () => void;
  onSave: () => void;
}

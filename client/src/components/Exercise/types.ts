import { Exercise, ExerciseType } from '../../model/types';

export type ExerciseProps = ExerciseStateProps & ExerciseOwnProps;

export type ExerciseStateProps = {
  exerciseTypes: ExerciseType[];
  onCreateNewType: (label: string, group: string) => void;
  getSelectedTypeLabel: (value: string) => string | undefined;
};

export type ExerciseOwnProps = {
  data: Exercise;
  dataTestId?: string;
  onChangeName: (value: string) => void;
  onDeleteSet: (setId: string) => void;
  onChangeRepetitions: (setId: string, value: string) => void;
  onChangeWeight: (setId: string, value: string) => void;
  onAddSet: () => void;
  onDelete: () => void;
  onSave: () => void;
  disabledDelete?: boolean;
  disabledSave?: boolean;
};

export interface Controller {
  getExerciseTypes: () => ExerciseType[];
  onCreateNewType: (label: string, group: string) => void;
  getSelectedTypeLabel: (value: string) => string | undefined;
}

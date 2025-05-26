export interface Set {
  id: string;
  repetitions: number;
  weight: number;
  time?: string;
}

export interface SetsByDate {
  id: string;
  date: string;
  sets: Set[];
}

export interface ExerciseData {
  id: string;
  name: string;
  sets: Set[];
  setsHistory?: SetsByDate[];
  setsPreview?: string;
}

export interface ExerciseProps {
  data: ExerciseData;
  onChangeName: (value: string) => void;
  onDeleteSet: (setId: string) => void;
  onChangeRepetitions: (setId: string, value: string) => void;
  onChangeWeight: (setId: string, value: string) => void;
  onAddSet: () => void;
  onDelete: () => void;
  onSave: () => void;
}

export interface ExerciseState {}

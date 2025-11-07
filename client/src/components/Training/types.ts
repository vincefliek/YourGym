interface Exercise {
  id: string;
  name: string;
  setsPreview?: string | undefined;
}

export interface TrainingProps {
  id: string;
  name: string;
  exercises: Exercise[];
  onChangeName: (name: string) => void;
  onAddExercise: () => void;
  onDelete: () => Promise<void>;
  onSave: () => Promise<void>;
  onDeleteExercise: (trainingId: string, exerciseId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
}

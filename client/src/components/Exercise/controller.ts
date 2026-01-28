import { AppContext } from '../../types';
import { Controller } from './types';
import { ExerciseType } from '../../model/types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): Controller => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi } = serviceLocator.getAPIs();

  const defaultExerciseTypes: ExerciseType[] = [
    {
      label: 'Barbell Bench Press',
      value: 'barbellBenchPress',
      group: 'chest',
    },
    {
      label: 'Squat',
      value: 'squat',
      group: 'legs',
    },
    {
      label: 'Deadlift',
      value: 'deadlift',
      group: 'compound',
    },
  ];

  const getExerciseTypes = () =>
    getStoreData(controller.storeDataAccessors).exerciseTypes as ExerciseType[];

  return {
    getExerciseTypes: () => {
      const exerciseTypes = getExerciseTypes();
      return [...defaultExerciseTypes, ...exerciseTypes];
    },
    onCreateNewType: (label: string, group: string) => {
      trainingsApi.create.exerciseType({
        label,
        group: group as ExerciseType['group'],
      });
    },
    getSelectedTypeLabel: (value: string) => {
      const exerciseTypes = getExerciseTypes();
      return exerciseTypes.find((type) => type.value === value)?.label;
    },
  };
};

controller.storeDataAccessors = ['exerciseTypes'];

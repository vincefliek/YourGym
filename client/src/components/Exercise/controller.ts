import { AppContext } from '../../types';
import { Controller } from './types';
import { ExerciseType } from '../../model/types';
import { defaultExerciseTypes } from './constants';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): Controller => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi } = serviceLocator.getAPIs();

  const getStoreExerciseTypes = () =>
    getStoreData(controller.storeDataAccessors).exerciseTypes as ExerciseType[];

  const getExerciseTypes = () => {
    const exerciseTypes = getStoreExerciseTypes();
    const sortedByGroup = [...defaultExerciseTypes, ...exerciseTypes].sort(
      (a, b) => a.group.localeCompare(b.group),
    );
    return sortedByGroup;
  };

  return {
    getExerciseTypes: () => getExerciseTypes(),
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
    isSaveDisabledDefault: (data) => {
      return !data.name.trim().length;
    },
  };
};

controller.storeDataAccessors = ['exerciseTypes'];

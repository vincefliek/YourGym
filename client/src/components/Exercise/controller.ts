import { v4 as uuidv4 } from 'uuid';

import { AppContext } from '../../types';
import { Controller } from './types';
import { ExerciseType } from '../../model/types';

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): Controller => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi } = serviceLocator.getAPIs();

  const getExerciseTypes = () =>
    getStoreData(controller.storeDataAccessors).exerciseTypes as ExerciseType[];

  return {
    getExerciseTypes,
    onCreateNewType: async (label: string, group: string) => {
      /**
       * TODO: Move UUID generation to the trainingsApi
       */
      const typeId = `type::${uuidv4()}`;
      const exerciseTypes = getExerciseTypes();

      await trainingsApi.update.exerciseTypes([
        ...exerciseTypes,
        { value: typeId, label, group: group as ExerciseType['group'] },
      ]);
    },
    getSelectedTypeLabel: (value: string) => {
      const exerciseTypes = getExerciseTypes();
      return exerciseTypes.find((type) => type.value === value)?.label;
    },
  };
};

controller.storeDataAccessors = ['exerciseTypes'];

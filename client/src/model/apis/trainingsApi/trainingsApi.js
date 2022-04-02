import { v4 as uuidv4 } from 'uuid';

import {
  trainingSchema,
  exerciseSchema,
  setSchema,
} from './schemas';

export const createTrainingsApi = ({ store, validator }) => {
  validator.addSchema(trainingSchema);
  validator.addSchema(exerciseSchema);
  validator.addSchema(setSchema);

  const validate = (data, schema) => {
    const validationResult = validator.validate(data, schema);

    if (!validationResult.valid) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          '[ERROR_DATA] Validation for Training failed!',
          validationResult.errors,
        );
        throw new Error('Validation for Training failed!');
      } else {
        // TODO log in production
        return;
      }
    }
  };

  const getData = () => store.getStoreData(['trainings', 'newTraining']);

  const deleteNewTraining = () => {
    store.newTraining = null;
  };

  const addTraining = (training) => {
    store.trainings = [
      ...getData().trainings,
      training,
    ];
  };

  const deleteTraining = (id) => {
    store.trainings = getData().trainings.filter(it => it.id !== id);
  };

  return {
    createNew: () => {
      const data = {
        id: uuidv4(),
        name: 'New Training',
        exercises: [],
      };

      validate(data, trainingSchema);

      store.newTraining = data;
    },
    updateNew: (input) => {
      const data = {
        ...getData().newTraining,
        ...input,
      };

      validate(data, trainingSchema);

      store.newTraining = data;
    },
    saveNew: () => {
      const data = getData().newTraining;

      validate(data, trainingSchema);
      addTraining(data);
      deleteNewTraining();
    },
    deleteNew: () => {
      deleteNewTraining();
    },
    delete: (id) => {
      deleteTraining(id);
    },
  };
};

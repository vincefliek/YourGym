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

  const getData = () => store.getStoreData([
    'trainings',
    'newTraining',
    'newExercise',
  ]);

  const deleteNewTraining = () => {
    store.newTraining = null;
  };

  const deleteNewExercise = () => {
    store.newExercise = null;
  };

  const addTraining = (training) => {
    store.trainings = [
      ...getData().trainings,
      training,
    ];
  };

  const addExercise = (trainingId, data) => {
    const newTraining = getData().newTraining;

    if (newTraining.id === trainingId) {
      _update.newTraining({
        exercises: newTraining.exercises.concat(data),
      });
      return;
    }

    store.trainings = getData().trainings.map(tr => {
      if (tr.id === trainingId) {
        return {
          ...tr,
          exercises: tr.exercises.concat(data),
        };
      }

      return tr;
    });
  };

  const deleteTraining = (id) => {
    store.trainings = getData().trainings.filter(it => it.id !== id);
  };

  const _create = {
    newTraining: () => {
      const data = {
        id: uuidv4(),
        name: 'New Training',
        exercises: [],
      };

      validate(data, trainingSchema);

      store.newTraining = data;
    },
    newExercise: () => {
      const data = {
        id: uuidv4(),
        name: 'New Exercise',
        sets: [],
      };

      validate(data, exerciseSchema);

      store.newExercise = data;
    },
  };

  const _update = {
    newTraining: (input) => {
      const data = {
        ...getData().newTraining,
        ...input,
      };

      validate(data, trainingSchema);

      store.newTraining = data;
    },
  };

  const _save = {
    newTraining: () => {
      const data = getData().newTraining;

      validate(data, trainingSchema);
      addTraining(data);
      deleteNewTraining();
    },
    newExercise: (trainingId) => {
      const data = getData().newExercise;

      validate(data, exerciseSchema);
      addExercise(trainingId, data);
      deleteNewExercise();
    },
  };

  const _delete = {
    newTraining: () => {
      deleteNewTraining();
    },
    training: (id) => {
      deleteTraining(id);
    },
    newExercise: () => {
      deleteNewExercise();
    },
  };

  return {
    create: _create,
    update: _update,
    save: _save,
    delete: _delete,
  };
};

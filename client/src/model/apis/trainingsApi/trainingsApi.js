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

  const deleteExercise = (trainingId, exerciseId) => {
    const newTraining = getData().newTraining;

    if (newTraining.id === trainingId) {
      store.newTraining = {
        ...newTraining,
        exercises: newTraining.exercises.filter(exercise =>
          exercise.id !== exerciseId),
      };
      return;
    }

    store.trainings = getData().trainings.map(training => {
      if (training.id === trainingId) {
        return {
          ...training,
          exercises: training.exercises.filter(exercise =>
            exercise.id !== exerciseId),
        };
      }

      return training;
    });
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

  const addSet = (trainingId, exerciseId, data) => {
    const newExercise = getData().newExercise;
    const newTraining = getData().newTraining;

    const _addSet = (exercises) => exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.concat(data),
        };
      }

      return ex;
    });

    if (newExercise?.id === exerciseId) {
      _update.newExercise({
        sets: newExercise.sets.concat(data),
      });
    } else if (newTraining?.id === trainingId) {
      store.newTraining = {
        ...newTraining,
        exercises: _addSet(newTraining.exercises),
      };
    } else {
      const trainings = getData().trainings.map(tr => {
        if (tr.id === trainingId) {
          return {
            ...tr,
            exercises: _addSet(tr.exercises),
          };
        }
        return tr;
      });

      store.trainings = trainings;
    }
  };

  const deleteSet = (exerciseId, setId) => {
    const newTraining = getData().newTraining;
    const newExercise = getData().newExercise;
    
    if (newExercise?.id === exerciseId) {
      store.newExercise = {
        ...newExercise,
        sets: newExercise.sets.filter(it => it.id !== setId),
      };

      return;
    }

    store.newTraining = {
      ...newTraining,
      exercises: newTraining.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.filter(set =>
              set.id !== setId),
          };
        }
        return exercise;
      }),
    };
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
    set: (trainingId, exerciseId) => {
      const data = {
        id: uuidv4(),
        repetitions: 8,
        weight: 12,
      };

      validate(data, setSchema);
      addSet(trainingId, exerciseId, data);
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
    newExercise: (input) => {
      const data = {
        ...getData().newExercise,
        ...input,
      };

      validate(data, exerciseSchema);

      store.newExercise = data;
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
    exercise: (trainingId, exerciseId) => {
      deleteExercise(trainingId, exerciseId);
    },
    set: (exerciseId, setId) => {
      deleteSet(exerciseId, setId);
    },
  };

  return {
    create: _create,
    update: _update,
    save: _save,
    delete: _delete,
  };
};

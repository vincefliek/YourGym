import { v4 as uuidv4 } from 'uuid';

import {
  allTrainingsSchema,
  trainingSchema,
  exerciseSchema,
  setSchema,
  setsHistorySchema,
} from './schemas';

export const createTrainingsApi = ({ store, validator }) => {
  validator.addSchema(allTrainingsSchema);
  validator.addSchema(trainingSchema);
  validator.addSchema(exerciseSchema);
  validator.addSchema(setSchema);
  validator.addSchema(setsHistorySchema);

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

    const trainings = getData().trainings.map(training => {
      if (training.id === trainingId) {
        return {
          ...training,
          exercises: training.exercises.filter(exercise =>
            exercise.id !== exerciseId),
        };
      }

      return training;
    });

    _update.allTrainings(trainings);
  };

  const addTraining = (training) => {
    const trainings = [
      ...getData().trainings,
      training,
    ];

    _update.allTrainings(trainings);
  };

  const addExercise = (trainingId, data) => {
    const newTraining = getData().newTraining;

    if (newTraining.id === trainingId) {
      _update.newTraining({
        exercises: newTraining.exercises.concat(data),
      });
      return;
    }

    const trainings = getData().trainings.map(tr => {
      if (tr.id === trainingId) {
        return {
          ...tr,
          exercises: tr.exercises.concat(data),
        };
      }

      return tr;
    });

    _update.allTrainings(trainings);
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
      _update.newTraining({
        exercises: _addSet(newTraining.exercises),
      });
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

      _update.allTrainings(trainings);
    }
  };

  const deleteSet = (trainingId, exerciseId, setId) => {
    const newTraining = getData().newTraining;
    const newExercise = getData().newExercise;

    const _deleteSet = (exercises) => exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter(set =>
            set.id !== setId),
        };
      }

      return exercise;
    });

    if (newExercise?.id === exerciseId) {
      _update.newExercise({
        sets: newExercise.sets.filter(it => it.id !== setId),
      });
    } else if (newTraining?.id === trainingId) {
      _update.newTraining({
        exercises: _deleteSet(newTraining.exercises),
      });
    } else {
      const trainings = getData().trainings.map(training => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: _deleteSet(training.exercises),
          };
        }

        return training;
      });

      _update.allTrainings(trainings);
    }
  };

  const deleteTraining = (id) => {
    const data = getData().trainings.filter(it => it.id !== id);

    _update.allTrainings(data);
  };

  // TODO find better place for it
  const createSetsPreview = (sets) => {
    let setsPreview = '';

    sets.forEach((set, index) => {
      setsPreview += `${set.repetitions}x${set.weight}kg`;
      if (index < (sets.length - 1)) setsPreview += ' - ';
    });

    return setsPreview;
  };

  const createCurrentDate = () => {
    const date = new Date();

    const currentDate =
      date.toDateString().slice(0, 3) + ', ' +
      date.toLocaleDateString();

    return currentDate;
  };

  const createCurrentTime = () => {
    const date = new Date();

    const currentHours =
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const currentMinutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    const currentTime = `${currentHours}:${currentMinutes}`;

    return currentTime;
  };

  const addSetToHistory = (trainingId, exerciseId, data, set) => {

    const _addSetToHistory = (setsHistory) => {
      const setsByCurrentDate = setsHistory.find(
        setsByDate => setsByDate.date === data.date,
      );

      if (setsByCurrentDate) {
        return setsHistory.map(setsByDate => {
          if (setsByDate.date === data.date) {
            return {
              ...setsByDate,
              sets: [{
                ...set,
                time: createCurrentTime(),
              }].concat(setsByDate.sets),
            };
          }

          return setsByDate;
        });
      }
      return [{
        ...data,
        sets: [{
          ...set,
          time: createCurrentTime(),
        }],
      }].concat(setsHistory);
    };

    const trainings = getData().trainings.map(training => {
      if (training.id === trainingId) {
        return {
          ...training,
          exercises: training.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                setsHistory: _addSetToHistory(exercise.setsHistory),
              };
            }

            return exercise;
          }),
        };
      }

      return training;
    });

    _update.allTrainings(trainings);
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
        setsHistory: [],
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
    setsHistory: (trainingId, exerciseId, set) => {
      const data = {
        id: uuidv4(),
        date: createCurrentDate(),
        sets: [],
      };

      validate(data, setsHistorySchema);
      addSetToHistory(trainingId, exerciseId, data, set);
    },
    setsPreview: (sets) => {
      return createSetsPreview(sets);
    },
  };

  const _update = {
    allTrainings: (input) => {
      const data = input;

      validate(data, allTrainingsSchema);

      store.trainings = data;
    },
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
    set: (trainingId, exerciseId, setId) => {
      deleteSet(trainingId, exerciseId, setId);
    },
  };

  return {
    create: _create,
    update: _update,
    save: _save,
    delete: _delete,
  };
};

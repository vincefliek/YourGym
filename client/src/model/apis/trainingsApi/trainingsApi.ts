import { v4 as uuidv4 } from 'uuid';
import {
  Exercise,
  Set,
  SetsByDate,
  Training,
  ApiTools,
  TrainingsApi,
  ApiFactory,
  AppAPIs,
} from '../../types';
import {
  allTrainingsSchema,
  trainingSchema,
  exerciseSchema,
  setSchema,
  setsHistorySchema,
} from './schemas';

export const createTrainingsApi: ApiFactory<
  TrainingsApi,
  Pick<AppAPIs, 'httpClientAPI'>
> = (
  { store, validator }: ApiTools,
) => {
  validator.addSchema(allTrainingsSchema);
  validator.addSchema(trainingSchema);
  validator.addSchema(exerciseSchema);
  validator.addSchema(setSchema);
  validator.addSchema(setsHistorySchema);

  const validate = (data: any, schema: any) => {
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

  const deleteExercise = (trainingId: string, exerciseId: string) => {
    const newTraining = getData().newTraining;

    if (newTraining?.id === trainingId) {
      store.newTraining = {
        ...newTraining,
        exercises: newTraining.exercises.filter((exercise: Exercise) =>
          exercise.id !== exerciseId),
      };
      return;
    }

    const trainings = getData().trainings.map((training: Training) => {
      if (training.id === trainingId) {
        return {
          ...training,
          exercises: training.exercises.filter((exercise: Exercise) =>
            exercise.id !== exerciseId),
        };
      }

      return training;
    });

    _update.allTrainings(trainings);
  };

  const addTraining = (training: Training) => {
    const trainings = [
      ...getData().trainings,
      training,
    ];

    _update.allTrainings(trainings);
  };

  const addExercise = (trainingId: string, data: Exercise) => {
    const newTraining = getData().newTraining;

    if (newTraining?.id === trainingId) {
      _update.newTraining({
        exercises: newTraining.exercises.concat(data),
      });
      return;
    }

    const trainings = getData().trainings.map((tr: Training) => {
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

  const addSet = (trainingId: string, exerciseId: string, data: Set) => {
    const newExercise = getData().newExercise;
    const newTraining = getData().newTraining;

    const _addSet = (exercises: Exercise[]) => exercises.map((ex: Exercise) => {
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
      const trainings = getData().trainings.map((tr: Training) => {
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

  const deleteSet = (trainingId: string, exerciseId: string, setId: string) => {
    const newTraining = getData().newTraining;
    const newExercise = getData().newExercise;

    const _deleteSet = (
      exercises: Exercise[],
    ) => exercises.map((exercise: Exercise) => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((set: Set) => set.id !== setId),
        };
      }

      return exercise;
    });

    if (newExercise?.id === exerciseId) {
      _update.newExercise({
        sets: newExercise.sets.filter((it: Set) => it.id !== setId),
      });
    } else if (newTraining?.id === trainingId) {
      _update.newTraining({
        exercises: _deleteSet(newTraining.exercises),
      });
    } else {
      const trainings = getData().trainings.map((training: Training) => {
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

  const deleteTraining = (id: string) => {
    const data = getData().trainings.filter((it: Training) => it.id !== id);

    _update.allTrainings(data);
  };

  // TODO find better place for it
  const createSetsPreview = (sets: Set[]): string => {
    let setsPreview = '';

    sets.forEach((set: Set, index: number) => {
      setsPreview += `${set.repetitions}x${set.weight}kg`;
      if (index < (sets.length - 1)) setsPreview += ' - ';
    });

    return setsPreview;
  };

  const createCurrentDate = (): string => {
    const date = new Date();

    const currentDate =
      date.toDateString().slice(0, 3) + ', ' +
      date.toLocaleDateString();

    return currentDate;
  };

  const createCurrentTime = (): string => {
    const date = new Date();

    const currentHours =
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const currentMinutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    const currentTime = `${currentHours}:${currentMinutes}`;

    return currentTime;
  };

  const addSetToHistory = (
    trainingId: string,
    exerciseId: string,
    data: SetsByDate,
    set: Set,
  ) => {
    const _addSetToHistory = (setsHistory: SetsByDate[]) => {
      const setsByCurrentDate = setsHistory.find(
        (setsByDate: SetsByDate) => setsByDate.date === data.date,
      );

      if (setsByCurrentDate) {
        return setsHistory.map((setsByDate: SetsByDate) => {
          if (setsByDate.date === data.date) {
            return {
              ...setsByDate,
              sets: [{
                ...set,
                time: createCurrentTime(),
              } as Set].concat(setsByDate.sets),
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
        } as Set],
      } as SetsByDate].concat(setsHistory);
    };

    const trainings = getData().trainings.map((training: Training) => {
      if (training.id === trainingId) {
        return {
          ...training,
          exercises: training.exercises.map((exercise: Exercise) => {
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
      const data: Training = {
        id: uuidv4(),
        name: 'New Training',
        exercises: [],
      };

      validate(data, trainingSchema);

      store.newTraining = data;
    },
    newExercise: () => {
      const data: Exercise = {
        id: uuidv4(),
        name: 'New Exercise',
        sets: [],
        setsHistory: [],
      };

      validate(data, exerciseSchema);

      store.newExercise = data;
    },
    set: (trainingId: string, exerciseId: string) => {
      const data: Set = {
        id: uuidv4(),
        repetitions: 8,
        weight: 12,
      };

      validate(data, setSchema);
      addSet(trainingId, exerciseId, data);
    },
    setsHistory: async (trainingId: string, exerciseId: string, set: Set) => {
      const data: SetsByDate = {
        id: uuidv4(),
        date: createCurrentDate(),
        sets: [],
      };

      validate(data, setsHistorySchema);
      addSetToHistory(trainingId, exerciseId, data, set);
    },
    setsPreview: (sets: Set[]): string => {
      return createSetsPreview(sets);
    },
  };

  const _update = {
    allTrainings: (trainings: Training[]) => {
      validate(trainings, allTrainingsSchema);
      store.trainings = trainings;
    },
    newTraining: (input: Partial<Training>) => {
      const data = {
        ...getData().newTraining,
        ...input,
      };

      validate(data, trainingSchema);
      store.newTraining = data;
    },
    newExercise: (input: Partial<Exercise>) => {
      const data = {
        ...getData().newExercise,
        ...input,
      };

      validate(data, exerciseSchema);
      store.newExercise = data;
    },
    training: (trainingId: string, data: Partial<Training>) => {
      const trainings = getData().trainings.map((tr: Training) => {
        if (tr.id === trainingId) {
          return {
            ...tr,
            ...data,
          };
        }

        return tr;
      });

      _update.allTrainings(trainings);
    },
    exercise: (
      trainingId: string,
      exerciseId: string,
      data: Partial<Exercise>,
    ) => {
      const trainings = getData().trainings.map((training: Training) => {
        if (training.id === trainingId) {
          return {
            ...training,
            exercises: training.exercises.map((exercise: Exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  ...data,
                };
              }

              return exercise;
            }),
          };
        }

        return training;
      });

      _update.allTrainings(trainings);
    },
  };

  const _save = {
    newTraining: () => {
      const data = getData().newTraining;

      if (data) {
        validate(data, trainingSchema);
        addTraining(data);
        deleteNewTraining();
      }
    },
    newExercise: (trainingId: string) => {
      const data = getData().newExercise;

      if (data) {
        validate(data, exerciseSchema);
        addExercise(trainingId, data);
        deleteNewExercise();
      }
    },
  };

  const _delete = {
    newTraining: () => {
      deleteNewTraining();
    },
    training: (id: string) => {
      deleteTraining(id);
    },
    newExercise: () => {
      deleteNewExercise();
    },
    exercise: (trainingId: string, exerciseId: string) => {
      deleteExercise(trainingId, exerciseId);
    },
    set: (trainingId: string, exerciseId: string, setId: string) => {
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

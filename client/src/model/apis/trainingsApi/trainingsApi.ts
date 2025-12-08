import { v4 as uuidv4 } from 'uuid';
import groupBy from 'lodash/groupBy';
import { format, toZonedTime } from 'date-fns-tz';
import {
  Exercise,
  Set,
  Training,
  ApiTools,
  TrainingsApi,
  ApiFactory,
  AppAPIs,
  CompletedTraining,
  TimestampTZ,
  CompletedTrainingExcercise,
  ActiveTraining,
} from '../../types';
import {
  allTrainingsSchema,
  trainingSchema,
  exerciseSchema,
  setSchema,
  completedTrainingSchema,
  completedTrainingsSchema,
  completedExerciseSchema,
} from './schemas';

export const createTrainingsApi: ApiFactory<
  TrainingsApi,
  Pick<AppAPIs, 'httpClientAPI' | 'trainingsServerApi'>
> = (
  { store, validator }: ApiTools,
  dependencies,
) => {
  validator.addSchema(allTrainingsSchema);
  validator.addSchema(trainingSchema);
  validator.addSchema(exerciseSchema);
  validator.addSchema(setSchema);
  validator.addSchema(completedTrainingsSchema);
  validator.addSchema(completedTrainingSchema);
  validator.addSchema(completedExerciseSchema);

  const { trainingsServerApi } = dependencies;

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
    'completedTrainings',
    'activeTraining',
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

    // Keep `activeTraining` in sync when a new exercise is added to the
    // template training that corresponds to the currently active one.
    // Use `templateTrainingId` for a reliable match.
    const activeTraining = getData().activeTraining;

    if (activeTraining && activeTraining.templateTrainingId === trainingId) {
      const updatedActive = {
        ...activeTraining,
        exercises: activeTraining.exercises.concat({
          id: uuidv4(),
          name: data.name,
          sets: [],
        }),
      } as CompletedTraining;

      try {
        validate(updatedActive, completedTrainingSchema);
        store.activeTraining = updatedActive;
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            '[activeTraining] Failed to append new exercise to activeTraining',
          );
        }
      }
    }
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

  const createSetsPreview = (sets: Set[]): string => {
    let setsPreview = '';

    sets.forEach((set: Set, index: number) => {
      setsPreview += `${set.repetitions}x${set.weight}kg`;
      if (index < (sets.length - 1)) setsPreview += ' - ';
    });

    return setsPreview;
  };

  const createPreviewDate = (timestamptz: TimestampTZ): string => {
    const date = new Date(timestamptz);
    const intlDateTimeOptions = Intl.DateTimeFormat().resolvedOptions();
    const locale = 'en-GB';
    const timeZone = intlDateTimeOptions.timeZone;

    const currentDate =
      date.toDateString().slice(0, 3) + ', ' +
      date.toLocaleDateString(locale, {
        timeZone,
      });

    return currentDate;
  };

  const createPreviewTime = (timestamptz: TimestampTZ): string => {
    const date = new Date(timestamptz);

    const currentHours =
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const currentMinutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    const currentTime = `${currentHours}:${currentMinutes}`;

    return currentTime;
  };

  const getTimestampWithTimeZone = (date: Date): TimestampTZ => {
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';

    const hours = String(Math.floor(
      Math.abs(offsetMinutes) / 60),
    ).padStart(2, '0');
    const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');

    return date
      .toISOString()
      .replace('Z', `${sign}${hours}:${minutes}`) as TimestampTZ;
  };

  const converUTCtoTimeZoned =
    <T extends (string | TimestampTZ | undefined | null)>(date: T): T => {
      if (!date) return date;

      // Get browser/user timezone
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert UTC → user timezone
      const zoned = toZonedTime(date, userTz);

      // Format
      const formatted = format(
        zoned,
        `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`,
        { timeZone: userTz },
      );

      return formatted as T;
    };

  const _create: TrainingsApi['create'] = {
    newTraining: () => {
      const data: Training = {
        id: uuidv4(),
        name: 'New Training',
        exercises: [],
      };

      validate(data, trainingSchema);

      store.newTraining = data;
    },
    newActiveTraining: (trainingId: string) => {
      const templateTraining: Training | undefined = getData().trainings.find(
        (tr: Training) => tr.id === trainingId,
      );

      if (!templateTraining) {
        return;
      }

      const data: ActiveTraining = {
        id: uuidv4(),
        name: templateTraining.name,
        timestamptz: getTimestampWithTimeZone(new Date()),
        templateTrainingId: templateTraining.id,
        exercises: templateTraining.exercises.map(e => {
          return {
            id: uuidv4(),
            name: e.name,
            sets: [],
          };
        }),
      };

      validate(data, completedTrainingSchema);

      store.activeTraining = data;
    },
    newExercise: () => {
      const data: Exercise = {
        id: uuidv4(),
        name: 'New Exercise',
        sets: [],
      };

      validate(data, exerciseSchema);

      store.newExercise = data;
    },
    set: (trainingId: string, exerciseId: string) => {
      const data: Set = {
        id: uuidv4(),
        repetitions: 8,
        weight: 12,
        done: false,
      };

      validate(data, setSchema);
      addSet(trainingId, exerciseId, data);
    },
    setsPreview: (sets: Set[]): string => {
      return createSetsPreview(sets);
    },
    datePreview: createPreviewDate,
    timePreview: createPreviewTime,
  };

  const _update: TrainingsApi['update'] = {
    allTrainings: (trainings: Training[]) => {
      validate(trainings, allTrainingsSchema);
      store.trainings = trainings;
    },
    completedTrainings: (trainings: CompletedTraining[]) => {
      validate(trainings, completedTrainingsSchema);
      store.completedTrainings = trainings;
    },
    newTraining: (input: Partial<Training>) => {
      const data = {
        ...getData().newTraining,
        ...input,
      };

      validate(data, trainingSchema);
      store.newTraining = data;
    },
    newActiveTraining: (
      templateTrainingsId: string,
      templateExerciseId: string,
      set: Set,
    ) => {
      const activeTraining: CompletedTraining = getData().activeTraining;

      if (!activeTraining) {
        return;
      }

      const templateTraining: Training | undefined = getData().trainings.find(
        (tr: Training) => tr.id === templateTrainingsId,
      );

      if (!templateTraining) {
        return;
      }

      const templateExercise: Exercise | undefined =
        templateTraining.exercises.find(
          ex => ex.id === templateExerciseId,
        );

      if (!templateExercise) {
        return;
      }

      const data: CompletedTraining = {
        ...activeTraining,
        exercises: activeTraining.exercises.map(ex => {
          if (ex.name !== templateExercise.name) {
            return ex;
          }
          return {
            ...ex,
            sets: ex.sets.concat({
              id: uuidv4(),
              repetitions: set.repetitions,
              weight: set.weight,
              timestamptz: getTimestampWithTimeZone(new Date()),
            }),
          };
        }),
      };

      validate(data, completedTrainingSchema);

      store.activeTraining = data;
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

  const _save: TrainingsApi['save'] = {
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
    newActiveTraining: () => {
      const _data = getData().activeTraining;

      if (_data) {
        const data: ActiveTraining = {
          ..._data,
        };

        delete data.templateTrainingId;

        validate(data, completedTrainingSchema);

        const trainings = [
          ...getData().completedTrainings,
          data,
        ];

        _update.completedTrainings(trainings);

        store.activeTraining = null;
      }
    },
    /**
     * Save on the server (insert into DB) all trainings
     * that were not synced earlier.
     * After that substitute local ones with the ones from
     * the request result.
     * Saved trainings will be marked with `createdInDbAt: ...`.
     */
    completedTrainings: async () => {
      const items: CompletedTraining[] = getData().completedTrainings
        .filter((tr: CompletedTraining) => !tr.createdInDbAt);
      const itemsIds = items.map(it => it.id);

      const newLastSyncAt = getTimestampWithTimeZone(new Date());

      if (!items.length) {
        store.sync = {
          lastSyncAt: newLastSyncAt,
        };
        return;
      }

      store.sync = { isLoading: true };

      try {
        const result = await trainingsServerApi
          .create.completedTrainings(items);

        const savedItems: CompletedTraining[] = result.map(tr => {
          const grouped = groupBy(tr.exercises, (it) => it.name);
          const exercises = Object.values(grouped).map(gr => ({
            /* "id" - only for client, not used on the server */
            id: uuidv4(),
            name: gr?.[0]?.name,
            sets: gr?.map(it => ({
              id: it.id,
              repetitions: it.reps,
              weight: it.weight,
              timestamptz: converUTCtoTimeZoned(it.date),
            })) ?? [],
          })) as CompletedTrainingExcercise[];
          return {
            id: tr.id,
            name: tr.name,
            exercises,
            timestamptz: converUTCtoTimeZoned(tr.date),
            createdInDbAt: converUTCtoTimeZoned(tr.created_at),
            updatedInDbAt: converUTCtoTimeZoned(tr.updated_at) ?? undefined,
          };
        });

        _update.completedTrainings([
          ...getData().completedTrainings
            .filter((tr: CompletedTraining) => !itemsIds.includes(tr.id)),
          ...savedItems,
        ]);

        store.sync = {
          lastSyncAt: newLastSyncAt,
          isLoading: false,
        };
      } catch (error: any) {
        // TODO schedule a re-try

        store.sync = {
          isLoading: false,
          error: error.message,
        };
      }
    },
  };

  const _delete: TrainingsApi['delete'] = {
    newTraining: () => {
      deleteNewTraining();
    },
    training: (id: string) => {
      deleteTraining(id);
    },
    completedTraining: (trainingId: string) => {
      const training: CompletedTraining = getData().completedTrainings
        .find((tr: CompletedTraining) => tr.id === trainingId);
      const createdInDbAt = training?.createdInDbAt;
      const data = getData().completedTrainings
        .filter((tr: CompletedTraining) => tr.id !== trainingId);

      _update.completedTrainings(data);

      if (createdInDbAt) {
        void trainingsServerApi.delete.completedTraining(training);
      }
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

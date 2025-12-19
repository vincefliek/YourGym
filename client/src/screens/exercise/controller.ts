import toNumber from 'lodash/toNumber';

import { AppContext } from '../../types';
import { Exercise, Training, Set, CompletedTraining } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () =>
    navigationApi.getPathParams(navigationApi.routes.openExercise);
  const findTraining = () => {
    const params = getParams();
    const trainings = getData().trainings;
    const training = trainings.find(
      (training: Training) => training.id === params.training,
    );

    return training;
  };

  const changeSet = (
    exerciseId: string,
    setId: string,
    update: Partial<Set>,
  ) => {
    const trainingId = findTraining()?.id;

    if (!trainingId) return;

    const trainings = getData().trainings.map((training: Training) => {
      if (training.id === trainingId) {
        return {
          ...training,
          exercises: training.exercises.map((exercise: Exercise) => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.map((set: Set) => {
                  if (set.id === setId) {
                    return {
                      ...set,
                      ...update,
                    };
                  }
                  return set;
                }),
              };
            }
            return exercise;
          }),
        };
      }
      return training;
    });

    trainingsApi.update.allTrainings(trainings);
  };

  return {
    isInProgress: () => Boolean(getData().activeTraining),
    getTraining: () => findTraining(),
    getExercise: () => {
      const params = getParams();
      const training = findTraining();
      const exercise = training?.exercises.find(
        (exercise: Exercise) => exercise.id === params.exercise,
      );

      return exercise;
    },
    getCurrentExerciseIntoNavbar: (training: Training, exercise: Exercise) => {
      return training.exercises.indexOf(exercise) + 1;
    },
    getTotalExercisesIntoNavbar: (training: Training) => {
      return training.exercises.length;
    },
    onChangeRepetitions: (exerciseId: string, setId: string, value: string) => {
      changeSet(exerciseId, setId, { repetitions: toNumber(value) });
    },
    onChangeWeight: (exerciseId: string, setId: string, value: string) => {
      changeSet(exerciseId, setId, { weight: toNumber(value) });
    },
    onDoneSet: async (trainingId: string, exerciseId: string, set: Set) => {
      changeSet(exerciseId, set.id, { done: true });
    },
    onResetDoneSet: async (
      trainingId: string,
      exerciseId: string,
      set: Set,
    ) => {
      changeSet(exerciseId, set.id, { done: false });
    },
    onExerciseNext: async (training: Training, exercise: Exercise) => {
      const currentExerciseIndex = training.exercises.indexOf(exercise);

      if (currentExerciseIndex < training.exercises.length - 1) {
        const nextExerciseId = training.exercises[currentExerciseIndex + 1].id;

        await navigationApi.toExercise(training.id, nextExerciseId);
        const trainings = getData().trainings;
        trainingsApi.update.allTrainings(trainings);
      }
    },
    onExercisePrev: async (training: Training, exercise: Exercise) => {
      const currentExerciseIndex = training.exercises.indexOf(exercise);

      if (currentExerciseIndex > 0) {
        const prevExerciseId = training.exercises[currentExerciseIndex - 1].id;

        await navigationApi.toExercise(training.id, prevExerciseId);
        const trainings = getData().trainings;
        trainingsApi.update.allTrainings(trainings);
      }
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onBack: () => {
      const trainingId = getParams().training;

      if (trainingId) {
        navigationApi.toTraining(trainingId);
      }
    },
    getSetsHistory: () => {
      const data = getData();
      const params = getParams();
      const training = findTraining();
      const exercise = training?.exercises.find(
        (ex: Exercise) => ex.id === params.exercise,
      );

      if (!exercise) return [];

      const completed = [...(data.completedTrainings as CompletedTraining[])]
        // sort by most recent first
        .sort(
          (a, b) =>
            new Date(b.timestamptz).getTime() -
            new Date(a.timestamptz).getTime(),
        )
        .map((tr) => {
          // TODO must be selected by exercise "type", not "name"
          const ex = tr.exercises.find((it: any) => it.name === exercise.name);
          if (!ex || !ex.sets.length) return null;

          return {
            date: trainingsApi.create.datePreview(tr.timestamptz),
            sets: ex.sets.map((set: any) => ({
              id: set.id,
              repetitions: set.repetitions,
              weight: set.weight,
              time: trainingsApi.create.timePreview(set.timestamptz),
            })),
          };
        })
        .filter(Boolean);

      return completed;
    },
  };
};

controller.storeDataAccessors = [
  'trainings',
  'activeTraining',
  'completedTrainings',
];

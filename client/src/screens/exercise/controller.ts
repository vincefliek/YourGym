import { AppContext } from '../../types';
import { Exercise, Training, Set } from '../../model/types';

export const controller = (serviceLocator: AppContext['serviceLocator']) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openExercise,
  );
  const findTraining = () => {
    const params = getParams();
    const trainings = getData().trainings;
    const training = trainings.find((training: Training) =>
      training.id === params.training);

    return training;
  };
  const toNumber = (value: string) => Number.parseInt(value, 10);

  return {
    getTraining: () => findTraining(),
    getExercise: () => {
      const params = getParams();
      const training = findTraining();
      const exercise = training?.exercises.find((exercise: Exercise) =>
        exercise.id === params.exercise);

      return exercise;
    },
    getCurrentExerciseIntoNavbar: (training: Training, exercise: Exercise) => {
      return training.exercises.indexOf(exercise) + 1;
    },
    getTotalExercisesIntoNavbar: (training: Training) => {
      return training.exercises.length;
    },
    onChangeRepetitions: (exerciseId: string, setId: string, value: string) => {
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
                        repetitions: toNumber(value),
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
    },
    onChangeWeight: (exerciseId: string, setId: string, value: string) => {
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
                        weight: toNumber(value),
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
    },
    onDoneSet: async (trainingId: string, exerciseId: string, set: Set) => {
      await trainingsApi.create.setsHistory(trainingId, exerciseId, set);
      trainingsApi.delete.set(trainingId, exerciseId, set.id);
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

      navigationApi.toTraining(trainingId);
    },
  };
};

controller.storeDataAccessors = ['trainings'];

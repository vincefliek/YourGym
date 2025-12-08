import { AppContext } from '../../types';
import { Training, Exercise, Set } from '../../model/types';
import { Controller } from '../../utils/HOCs/types';

export const controller: Controller = (
  serviceLocator: AppContext['serviceLocator'],
) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openTraining,
  );
  const findTraining = () => {
    const params = getParams();
    const trainings: Training[] = getData().trainings;
    const training = trainings.find((training: Training) =>
      training.id === params.training);

    return training;
  };

  return {
    isAnyTrainingInProgress: () => Boolean(getData().activeTraining),
    isCurrentTrainingInProgress: () => {
      const training = findTraining();
      const activeTraining = getData().activeTraining;

      if (training && activeTraining) {
        return training.id === activeTraining.templateTrainingId;
      }

      return false;
    },
    getTraining: () => {
      const training = findTraining();

      if (training !== undefined) {
        training.exercises = training.exercises.map((exercise: Exercise) => ({
          ...exercise,
          setsPreview: trainingsApi.create.setsPreview(exercise.sets),
        }));
      }

      return training;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onStart: () => {
      const training = findTraining();

      if (training) {
        if (!training.exercises.length) {
          window.alert('Start denied - training has ZERO exercises!');
          return;
        }

        trainingsApi.create.newActiveTraining(training.id);

        const firstExercise = training.exercises[0];
        navigationApi.toExercise(training.id, firstExercise.id);
      }
    },
    onFinish: async () => {
      const trainingId = findTraining()?.id;

      if (trainingId) {
        if (!getData().activeTraining) {
          window.alert('Stop denied - your training was NOT started!');
          return;
        }

        // iterate over all exercises => set `done: false` for all sets
        const trainings = getData().trainings.map((training: Training) => {
          if (training.id === trainingId) {
            return {
              ...training,
              exercises: training.exercises.map((exercise: Exercise) => {
                return {
                  ...exercise,
                  sets: exercise.sets.map((set: Set) => {
                    if (set.done) {
                      trainingsApi.update.newActiveTraining(
                        trainingId,
                        exercise.id,
                        set,
                      );
                    }
                    return {
                      ...set,
                      done: false,
                    };
                  }),
                };
              }),
            };
          }
          return training;
        });

        trainingsApi.update.allTrainings(trainings);

        trainingsApi.save.newActiveTraining();

        await navigationApi.toHome();
      }
    },
    onBack: () => {
      navigationApi.toTrainings();
    },
    onEdit: () => {
      const training = findTraining();

      if (training) {
        navigationApi.toEditTraining(training.id);
      }
    },
    onOpenExercise: (training: Training, exercise: Exercise) => {
      navigationApi.toExercise(training.id, exercise.id);
    },
  };
};

controller.storeDataAccessors = ['trainings', 'activeTraining'];

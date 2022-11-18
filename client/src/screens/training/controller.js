export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () =>
    navigationApi.getPathParams(navigationApi.routes.openTraining);

  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(
        (training) => training.id === params.training,
      );

      if (training !== undefined) {
        training.exercises = training.exercises.map((exercise) => ({
          ...exercise,
          setsPreview: trainingsApi.create.setsPreview(exercise.sets),
        }));
      }

      return training;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onStart: (training) => {
      trainingsApi.update.training(training.id, {
        trainingActive: true,
      });

      trainingsApi.create.stopwatch(training.id);

      navigationApi.toExercise(training.id, training.exercises[0].id);
    },
    onFinish: (training) => {
      const result = window.confirm(
        `Do you really want to finish training?`,
      );

      if (result) {
        if (training.totalRepetitions === 0 && training.totalWeight === 0) {
          return trainingsApi.update.training(training.id, {
            trainingActive: false,
            trainingTime: '00:00',
          });
        }

        trainingsApi.update.training(training.id, {
          trainingActive: false,
        });

        navigationApi.toTrainingResults(training.id);
      }
    },
    onStopwatch: (training) => {
      const result = window.confirm(
        `Do you really want to finish training?`,
      );

      if (result) {
        if (training.totalRepetitions === 0 && training.totalWeight === 0) {
          return trainingsApi.update.training(training.id, {
            trainingActive: false,
            trainingTime: '00:00',
          });
        }

        trainingsApi.update.training(training.id, {
          trainingActive: false,
        });

        navigationApi.toTrainingResults(training.id);
      }
    },
    onBack: (training) => {
      if (training.trainingActive) {
        const result = window.confirm(
          `Do you really want to go out and finish training?`,
        );

        if (result) {
          if (training.totalRepetitions === 0 && training.totalWeight === 0) {
            trainingsApi.update.training(training.id, {
              trainingActive: false,
            });

            return navigationApi.toTrainings();
          }

          trainingsApi.update.training(training.id, {
            trainingActive: false,
          });

          return navigationApi.toTrainingResults(training.id);
        } else {
          return;
        }
      }

      navigationApi.toTrainings();
    },
    onEdit: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onOpenExercise: (training, exercise) => {
      navigationApi.toExercise(training.id, exercise.id);
    },
  };
};

controller.storeDataAccessors = ['trainings'];

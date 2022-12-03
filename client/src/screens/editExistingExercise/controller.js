export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.editExistingExercise,
  );
  const toNumber = (value) => Number.parseInt(value, 10);

  return {
    getExercise: () => {
      const trainingId = getParams().training;
      const exerciseId = getParams().exercise;

      const training = getData().trainings.find(training =>
        training.id === trainingId);
      const exercise = training?.exercises.find(exercise =>
        exercise.id === exerciseId);

      return exercise;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (exerciseId, name) => {
      const trainingId = getParams().training;

      trainingsApi.update.exercise(trainingId, exerciseId, {name});
    },
    onChangeRepetitions: (exerciseId, setId, value) => {
      const trainingId = getParams().training;

      trainingsApi.update.set(trainingId, exerciseId, setId, {
        repetitions: toNumber(value),
      });
    },
    onChangeWeight: (exerciseId, setId, value) => {
      const trainingId = getParams().training;

      trainingsApi.update.set(trainingId, exerciseId, setId, {
        weight: toNumber(value),
      });
    },
    onAddSet: () => {
      const trainingId = getParams().training;
      const exerciseId = getParams().exercise;

      trainingsApi.create.set(trainingId, exerciseId);
    },
    onDeleteSet: (exerciseId, setId) => {
      const trainingId = getParams().training;

      trainingsApi.delete.set(trainingId, exerciseId, setId);
    },
    onDelete: async () => {
      const trainingId = getParams().training;
      const exerciseId = getParams().exercise;

      await navigationApi.toEditTraining(trainingId);
      trainingsApi.delete.exercise(trainingId, exerciseId);
    },
    onSave: () => {
      const trainingId = getParams().training;

      const trainings = getData().trainings.map(tr => {
        if (tr.id === trainingId) {
          return {
            ...tr,
            exercises: tr.exercises.map(exercise => ({
              ...exercise,
              setsPreview: trainingsApi.create.setsPreview(exercise.sets),
            })),
          };
        }

        return tr;
      });

      trainingsApi.update.allTrainings(trainings);

      navigationApi.toEditTraining(trainingId);
    },
  };
};

controller.storeDataAccessors = ['trainings'];

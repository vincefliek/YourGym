export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getData: () => getData().newExercise,
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (name) => {

    },
    onChangeWeight: (value) => {

    },
    onChangeRepetitions: (value) => {

    },
    onAddSet: () => {
      // const trainingId = getData().newTraining.id;
      // navigationApi.toCreateExercise(trainingId);
    },
    onDelete: async () => {
      await navigationApi.toCreateTraining();
      trainingsApi.delete.newExercise();
    },
    onSave: async () => {
      const trainingId = navigationApi.getPathParams(
        navigationApi.routes.createExercise,
      ).training;

      await navigationApi.toCreateTraining();
      trainingsApi.save.newExercise(trainingId);
    },
  };
};

controller.storeDataAccessors = ['newExercise'];

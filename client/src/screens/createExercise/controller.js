export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getData: () => getData().newExercise,
    onNoData: () => {
      // TODO fix - this is invoked after `trainingsApi.delete.newExercise()`
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
    onDelete: () => {
      navigationApi.toCreateTraining();
      trainingsApi.delete.newExercise();
    },
    onSave: () => {
      const trainingId = navigationApi.getPathParams(
        navigationApi.routes.createExercise,
      ).training;

      navigationApi.toCreateTraining();
      trainingsApi.save.newExercise(trainingId);
    },
  };
};

controller.storeDataAccessors = ['newExercise'];

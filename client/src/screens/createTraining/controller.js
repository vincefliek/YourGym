export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);

  return {
    getData: () => getData().newTraining,
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onChangeName: (name) => {
      trainingsApi.update.newTraining({
        name,
      });
    },
    onAddExercise: () => {
      const trainingId = getData().newTraining.id;

      trainingsApi.create.newExercise();
      navigationApi.toCreateExercise(trainingId);
    },
    onDelete: async () => {
      await navigationApi.toTrainings();
      trainingsApi.delete.newTraining();
    },
    onSave: async () => {
      await navigationApi.toTrainings();
      trainingsApi.save.newTraining();
    },
  };
};

controller.storeDataAccessors = ['newTraining'];

export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi, trainingsApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getById = (id) => getData().trainings.find(it => it.id === id);

  return {
    getTrainings: () => getData().trainings,
    onAddTraining: () => {
      trainingsApi.create.newTraining();
      navigationApi.toCreateTraining();
    },
    onDeleteTraining: (id) => {
      const training = getById(id);

      if (!training) {
        throw new Error(`Training with ID "${id}" doesn't exist!`);
      }

      const result = window.confirm(
        `Do you really want to delete "${training.name}"?`,
      );

      if (result) {
        trainingsApi.delete.training(id);
      }
    },
    onOpenTraining: (trainingId) => {
      navigationApi.toTraining(trainingId);
    },
  };
};

controller.storeDataAccessors = ['trainings'];

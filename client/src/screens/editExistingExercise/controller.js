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
    },
    onNoData: () => {
    },
    onChangeName: (exerciseId, name) => {
    },
    onChangeRepetitions: (exercise, setId, value) => {
    },
    onChangeWeight: (exercise, setId, value) => {
    },
    onAddSet: () => {
    },
    onDeleteSet: (exerciseId, setId) => {
    },
    onDelete: async () => {
    },
    onSave:  () => {
    },
  };
};

controller.storeDataAccessors = ['trainings'];

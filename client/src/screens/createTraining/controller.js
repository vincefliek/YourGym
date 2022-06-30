export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { trainingsApi, navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const createSetsPreview = (sets) => {
    let setsPreview = '';

    sets.forEach((set, index) => {
      setsPreview += `${set.repetitions}x${set.weight}kg`;
      if (index < (sets.length - 1)) setsPreview += ' - ';
    });

    return setsPreview;
  };

  return {
    getData: () => {
      const newTraining = getData().newTraining;

      if (newTraining !== null) {
        newTraining.exercises = newTraining.exercises.map(exercise => ({
          ...exercise,
          setsPreview: createSetsPreview(exercise.sets),
        }));
      }

      return newTraining;
    },
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
    onDeleteExercise: (trainingId, exerciseId) => {
      trainingsApi.delete.exercise(trainingId, exerciseId);
    },
    onOpenExercise: (exerciseId) => {
      const trainingId = getData().newTraining.id;

      navigationApi.toEditNewExercise(trainingId, exerciseId);
    },
  };
};

controller.storeDataAccessors = ['newTraining'];

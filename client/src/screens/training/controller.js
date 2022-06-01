export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () => navigationApi.getPathParams(
    navigationApi.routes.openTraining,
  );
  const createSetsPreview = (sets) => {
    let setsPreview = '';

    sets.forEach((set, index) => {
      setsPreview += `${set.repetitions}x${set.weight}kg`;
      if (index < (sets.length - 1)) setsPreview += ' - ';
    });
    
    return setsPreview;
  };
  
  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(training => training.id === params.training);
      if (training !== undefined) {
        training.exercises.map(exercise => {
          exercise.setsPreview = createSetsPreview(exercise.sets);
         });
      }
      return training;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onStart: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onBack: () => {
      navigationApi.toTrainings();
    },
    onEdit: () => {
      window.alert('You will be able to preview very soon :)');
    },
    onOpenExercise: (exerciseId) => {
      window.alert('You will be able to preview very soon :)');
    },
  };
};

controller.storeDataAccessors = ['trainings'];

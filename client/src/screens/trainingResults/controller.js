export const controller = (serviceLocator) => {
  const { getStoreData } = serviceLocator.getStore();
  const { navigationApi } = serviceLocator.getAPIs();

  const getData = () => getStoreData(controller.storeDataAccessors);
  const getParams = () =>
    navigationApi.getPathParams(navigationApi.routes.openTrainingResults);


  return {
    getTraining: () => {
      const params = getParams();
      const trainings = getData().trainings;
      const training = trainings.find(
        (training) => training.id === params.training,
      );

      return training;
    },
    getDate: () => {
      const dateNow = new Date();

      const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ];
      const months = [
        'December',
        'January',
        'February',
        'March',
        'April',
        'May',
	      'June',
        'July',
        'August',
        'October',
        'November',
      ];

      const year = dateNow.getFullYear();
      const month = months[dateNow.getMonth()];
      const day = days[dateNow.getDay()];
      const date = dateNow.getDate();

      const time = dateNow.toLocaleTimeString().slice(0, 5);

      const currentDate =
        `${day}, ${date} ${month} ${year}･${time}`;

      return currentDate;
    },
    onNoData: () => {
      navigationApi.toTrainings();
    },
    onBack: () => {
      navigationApi.toTrainings();
    },
  };
};

controller.storeDataAccessors = ['trainings'];

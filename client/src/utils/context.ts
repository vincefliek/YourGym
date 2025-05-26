import React from 'react';
import { AppContext as IAppContext } from '../types';

export const AppContext = React.createContext<IAppContext>({
  serviceLocator: {
    getStore: () => ({
      getStoreData: () => ({}),
      subscribe: () => () => {},
    }),
    getAPIs: () => ({
      navigationApi: {
        routes: {
          home: '',
          trainings: '',
          menu: '',
          createTraining: '',
          createExercise: '',
          editNewExercise: '',
          editExistingExercise: '',
          openTraining: '',
          openExercise: '',
        },
      },
    } as any),
  },
});

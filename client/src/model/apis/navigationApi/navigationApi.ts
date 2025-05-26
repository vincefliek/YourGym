import { generatePath, matchPath } from 'react-router-dom';
import { Store } from '../../store';
import { waitForCondition } from '../../../utils';

interface Routes {
  home: string;
  trainings: string;
  menu: string;
  createTraining: string;
  openTraining: string;
  editTraining: string;
  createExercise: string;
  editNewExercise: string;
  editExistingExercise: string;
  openExercise: string;
}

interface StoreType {
  getStoreData: Store['getStoreData'];
  subscribe: Store['subscribe'];
  route?: string;
}

export const createNavigationApi = ({ store }: { store: StoreType }) => {
  const routes: Routes = {
    home: '/',
    trainings: '/trainings',
    menu: '/menu',
    createTraining: '/trainings/new',
    openTraining: '/trainings/:training',
    editTraining: '/trainings/:training/edit',
    createExercise: '/trainings/:training/new-exercise',
    editNewExercise: '/trainings/:training/:exercise/editNew',
    editExistingExercise: '/trainings/:training/:exercise/edit',
    openExercise: '/trainings/:training/:exercise',
  };

  /**
   * Handles URL with and without hash like:
   * - `/#/`
   * - `#/`
   * - `/`
   */
  const getPathName = (): string => window.location.hash.slice(1) || routes.home;

  const getData = () => store.getStoreData(['route']);

  const isRouteOpenedRightNow = (route: string): boolean =>
    Boolean(matchPath(route, getPathName()));

  const setRoute = async (route: string, params: Record<string, string> = {}) => {
    // TODO [vlad-ozh] [it's a hack]
    if (isRouteOpenedRightNow(route) && (route !== routes.openExercise)) {
      return;
    }

    store.route = generatePath(route, params);

    return waitForCondition(async () => isRouteOpenedRightNow(route));
  };

  return {
    routes,
    resetRoute: () => {
      if (getData().route !== undefined) {
        store.route = undefined;
      }
    },
    goBack: () => {
      // Going back in history, will need to handle this differently
      window.history.back();
    },
    toHome: () => {
      return setRoute(routes.home);
    },
    toTrainings: () => {
      return setRoute(routes.trainings);
    },
    toMenu: () => {
      return setRoute(routes.menu);
    },
    toCreateTraining: () => {
      return setRoute(routes.createTraining);
    },
    toCreateExercise: (trainingId: string) => {
      return setRoute(routes.createExercise, {
        training: trainingId,
      });
    },
    toEditNewExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.editNewExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toEditExistingExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.editExistingExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    toTraining: (trainingId: string) => {
      return setRoute(routes.openTraining, {
        training: trainingId,
      });
    },
    toExercise: (trainingId: string, exerciseId: string) => {
      return setRoute(routes.openExercise, {
        training: trainingId,
        exercise: exerciseId,
      });
    },
    isHomeUrl: () => {
      return isRouteOpenedRightNow(routes.home);
    },
    isTrainingsUrl: () => {
      return isRouteOpenedRightNow(routes.trainings);
    },
    isMenuUrl: () => {
      return isRouteOpenedRightNow(routes.menu);
    },
    getPathParams: (route: string) => {
      const match = matchPath(route, getPathName());
      return match?.params ?? {};
    },
  };
};

import { AppContext } from '../../types';

interface BlockingLayerController {
  getData: () => { isVisible: boolean; message?: string };
}

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): BlockingLayerController => {
  const store = serviceLocator.getStore();
  const getStoreData = () => store.getStoreData(controller.storeDataAccessors);

  return {
    getData: () => getStoreData().uiBlockingLayer,
  };
};

controller.storeDataAccessors = ['uiBlockingLayer'];

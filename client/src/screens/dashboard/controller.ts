import { AppContext } from '../../types';
import { CompletedTraining } from '../../model/types';
import { aggregateByDay, TrainingAggregate } from '../../model/aggregation';

interface DashboardController {
  getAggregates: () => TrainingAggregate[];
}

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): DashboardController => {
  const store = serviceLocator.getStore();

  const getStore = () => store.getStoreData(controller.storeDataAccessors);

  return {
    getAggregates: () => {
      const completed: CompletedTraining[] =
        getStore().completedTrainings || [];
      return aggregateByDay(completed);
    },
  };
};

controller.storeDataAccessors = ['completedTrainings'];

import { AppContext } from '../../types';
import { CompletedTraining } from '../../model/types';
import type { TrainingAggregate } from '../../model/aggregation';
import { aggregateByDay, lastNDays } from '../../model/aggregation';

interface CardController {
  getLast7DaysAggregates: () => TrainingAggregate[];
  getTotalsForLast7Days: () => { totalVolumeKg: number; sessions: number };
}

export const controller = (
  serviceLocator: AppContext['serviceLocator'],
): CardController => {
  const store = serviceLocator.getStore();

  const getStore = () => store.getStoreData(controller.storeDataAccessors);

  return {
    getLast7DaysAggregates: () => {
      const completed: CompletedTraining[] =
        getStore().completedTrainings || [];
      const agg = aggregateByDay(completed);
      return lastNDays(agg, 7);
    },
    getTotalsForLast7Days: () => {
      const completed: CompletedTraining[] =
        getStore().completedTrainings || [];
      const agg = aggregateByDay(completed);
      const last7 = lastNDays(agg, 7);
      const totalVolumeKg = last7.reduce((s, a) => s + a.totalVolumeKg, 0);
      const sessions = last7.reduce((s, a) => s + a.sessionsCount, 0);
      return { totalVolumeKg, sessions };
    },
  };
};

controller.storeDataAccessors = ['completedTrainings'];

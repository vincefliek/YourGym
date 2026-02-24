import { AppContext } from '../../types';
import { CompletedTraining } from '../../model/types';
import {
  aggregateByDay,
  aggregateByExercise,
  TrainingAggregate,
  ExerciseMetrics,
} from '../../model/aggregation';

interface DashboardController {
  getAggregates: () => TrainingAggregate[];
  getExerciseMetrics: (days?: number) => ExerciseMetrics[];
  getCompletedTrainings: () => CompletedTraining[];
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
    getExerciseMetrics: (days = 30) => {
      const completed: CompletedTraining[] =
        getStore().completedTrainings || [];
      return aggregateByExercise(completed, days);
    },
    getCompletedTrainings: () => {
      return getStore().completedTrainings || [];
    },
  };
};

controller.storeDataAccessors = ['completedTrainings'];

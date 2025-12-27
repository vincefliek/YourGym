import { getTimestampWithTimeZone } from '../../../utils';
import {
  ApiTools,
  ApiFactory,
  AppAPIs,
  SyncApi,
  CompletedTraining,
} from '../../types';

export const createSyncApi: ApiFactory<
  SyncApi,
  Pick<
    AppAPIs,
    'httpClientAPI' | 'trainingsServerApi' | 'trainingsApi' | 'notificationsApi'
  >
> = ({ store }: ApiTools, dependencies) => {
  const { httpClientAPI, trainingsServerApi, trainingsApi, notificationsApi } =
    dependencies;
  const getData = () => store.getStoreData(['completedTrainings', 'sync']);

  const hasServerChanges = async () => {
    try {
      const quereParams = new URLSearchParams({
        since:
          store.getStoreData(['sync']).sync.lastSyncAt ||
          // no "lastSyncAt" for new user
          getTimestampWithTimeZone(new Date()),
      });
      const url = `/api/changes?${quereParams.toString()}`;

      const result = await httpClientAPI.get<any>(url);

      const serverHasChanges = Boolean(
        result.completedTrainings.data.length ||
        result.completedExercises.data.length,
      );

      store.sync = {
        serverHasChanges,
      };
    } catch (error) {
      console.error('[TrainingsServerApi] hasServerChanges', error);
      throw error;
    }
  };

  /**
   * Save on the server (insert into DB) all trainings
   * that were not synced earlier.
   * After that substitute local ones with the ones from
   * the request result.
   * Saved trainings will be marked with `createdInDbAt: ...`.
   */
  const syncCompletedTrainings = async () => {
    try {
      const items: CompletedTraining[] = getData().completedTrainings.filter(
        (tr: CompletedTraining) => !tr.createdInDbAt,
      );
      const itemsIds = items.map((it) => it.id);

      if (!items.length) {
        return;
      }

      const result = await trainingsServerApi.create.completedTrainings(items);
      const savedItems: CompletedTraining[] =
        trainingsServerApi.mappers.toClientCompletedTrainings(result);

      trainingsApi.update.completedTrainings([
        ...getData().completedTrainings.filter(
          (tr: CompletedTraining) => !itemsIds.includes(tr.id),
        ),
        ...savedItems,
      ]);
    } catch (error: any) {
      throw new Error(`Failed to sync completed trainings: ${error.message}`);
    }
  };

  const sync = async () => {
    store.sync = {
      isLoading: true,
    };

    try {
      await syncCompletedTrainings();

      store.sync = {
        lastSyncAt: getTimestampWithTimeZone(new Date()),
        isLoading: false,
      };
    } catch (error: any) {
      store.sync = {
        isLoading: false,
        error: error.message,
      };
      notificationsApi.addNotification({
        type: 'error',
        message: error.message || 'Sync failed',
      });
    }
  };

  return {
    hasServerChanges,
    sync,
  };
};

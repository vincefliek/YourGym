import { v4 as uuidv4 } from 'uuid';
import groupBy from 'lodash/groupBy';
import { format, toZonedTime } from 'date-fns-tz';

import { getTimestampWithTimeZone } from '../../../utils';
import {
  ApiTools,
  ApiFactory,
  AppAPIs,
  SyncApi,
  CompletedTraining,
  TimestampTZ,
  CompletedTrainingExcercise,
} from '../../types';

export const createSyncApi: ApiFactory<
  SyncApi,
  Pick<AppAPIs, 'httpClientAPI' | 'trainingsServerApi' | 'trainingsApi'>
> = (
  { store }: ApiTools,
  dependencies,
) => {
  const { httpClientAPI, trainingsServerApi, trainingsApi } = dependencies;
  const getData = () => store.getStoreData(['completedTrainings', 'sync']);

  const hasServerChanges = async () => {
    try {
      const quereParams = new URLSearchParams({
        since: store.getStoreData(['sync']).sync.lastSyncAt,
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

  const converUTCtoTimeZoned =
    <T extends (string | TimestampTZ | undefined | null)>(date: T): T => {
      if (!date) return date;

      // Get browser/user timezone
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert UTC → user timezone
      const zoned = toZonedTime(date, userTz);

      // Format
      const formatted = format(
        zoned,
        `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`,
        { timeZone: userTz },
      );

      return formatted as T;
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
      const items: CompletedTraining[] = getData().completedTrainings
        .filter((tr: CompletedTraining) => !tr.createdInDbAt);
      const itemsIds = items.map(it => it.id);

      if (!items.length) {
        return;
      }

      const result = await trainingsServerApi.create.completedTrainings(items);

      const savedItems: CompletedTraining[] = result.map(tr => {
        const grouped = groupBy(tr.exercises, (it) => it.name);
        const exercises = Object.values(grouped).map(gr => ({
          /* "id" - only for client, not used on the server */
          id: uuidv4(),
          name: gr?.[0]?.name,
          sets: gr?.map(it => ({
            id: it.id,
            repetitions: it.reps,
            weight: it.weight,
            timestamptz: converUTCtoTimeZoned(it.date),
          })) ?? [],
        })) as CompletedTrainingExcercise[];
        return {
          id: tr.id,
          name: tr.name,
          exercises,
          timestamptz: converUTCtoTimeZoned(tr.date),
          createdInDbAt: converUTCtoTimeZoned(tr.created_at),
          updatedInDbAt: converUTCtoTimeZoned(tr.updated_at) ?? undefined,
        };
      });

      trainingsApi.update.completedTrainings([
        ...getData().completedTrainings
          .filter((tr: CompletedTraining) => !itemsIds.includes(tr.id)),
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
    }
  };

  return {
    hasServerChanges,
    sync,
  };
};

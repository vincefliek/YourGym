import { v4 as uuidv4 } from 'uuid';
import groupBy from 'lodash/groupBy';
import { format, toZonedTime } from 'date-fns-tz';

import {
  ApiTools,
  ApiFactory,
  AppAPIs,
  TrainingsServerApi,
  CompletedTraining,
  CompletedTrainingExcercise,
  ServerWrite,
  ServerRead,
  TimestampTZ,
} from '../../types';
import { ServerReadSchemas, ServerWriteSchemas } from './schemas';

export const createTrainingsServerApi: ApiFactory<
  TrainingsServerApi,
  Pick<AppAPIs, 'httpClientAPI'>
> = ({ validator }: ApiTools, dependencies) => {
  validator.addSchema(ServerReadSchemas.completedTrainings);
  validator.addSchema(ServerReadSchemas.completedTraining);
  validator.addSchema(ServerReadSchemas.completedExercise);
  validator.addSchema(ServerWriteSchemas.completedTrainings);
  validator.addSchema(ServerWriteSchemas.completedTraining);
  validator.addSchema(ServerWriteSchemas.completedExercise);

  const { httpClientAPI } = dependencies;

  const validate = (data: any, schema: any) => {
    const validationResult = validator.validate(data, schema);

    if (!validationResult.valid) {
      console.error(
        '[ERROR_DATA] Validation for Server Training failed!',
        validationResult.errors,
      );
      throw new Error('Validation for Server Training failed!');
    }
  };

  const converUTCtoTimeZoned = <
    T extends string | TimestampTZ | undefined | null,
  >(
    date: T,
  ): T => {
    if (!date) return date;

    // Get browser/user timezone
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert UTC → user timezone
    const zoned = toZonedTime(date, userTz);

    // Format
    const formatted = format(zoned, `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`, {
      timeZone: userTz,
    });

    return formatted as T;
  };

  const getCompletedTrainings = async (): Promise<
    ServerRead.sr_CompletedTraining[]
  > => {
    let data = [];

    try {
      data = await httpClientAPI.get<any[]>('/api/workouts');

      validate(data, ServerReadSchemas.completedTrainings);

      console.log('=== getCompletedTrainings ===', data);

      return data;
    } catch (error) {
      console.error('[TrainingsServerApi]', error);
      throw error;
    }
  };

  const deleteCompletedTraining = async (data: CompletedTraining) => {
    try {
      const workoutId = data.id;
      await httpClientAPI.delete<any>(`/api/workouts/${workoutId}`);
    } catch (error) {
      console.error('[TrainingsServerApi]', error);
      throw error;
    }
  };

  const completedExerciseToServerWriteType = (
    item: CompletedTrainingExcercise,
  ): ServerWrite.sw_CompletedExcercise[] => {
    return item.sets.map((set) => {
      return {
        name: item.name,
        date: set.timestamptz,
        type: 'custom',
        reps: set.repetitions,
        weight: set.weight,
      };
    });
  };

  const completedTrainingToServerWriteType = (
    item: CompletedTraining,
  ): ServerWrite.sw_CompletedTraining => {
    return {
      tempId: item.id,
      name: item.name,
      date: item.timestamptz,
      exercises: item.exercises.flatMap(completedExerciseToServerWriteType),
    };
  };

  const toClientCompletedTrainings = (
    data: ServerRead.sr_CompletedTraining[],
  ): CompletedTraining[] => {
    const result: CompletedTraining[] = data.map((tr) => {
      const grouped = groupBy(tr.exercises, (it) => it.name);
      const exercises = Object.values(grouped).map((gr) => ({
        /* "id" - only for client, not used on the server */
        id: uuidv4(),
        // TODO use exercise type instead of name? (it's stable)
        name: gr?.[0]?.name,
        sets:
          gr?.map((it) => ({
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
    return result;
  };

  const createCompletedTrainings = async (data: CompletedTraining[]) => {
    try {
      const workouts = data.map(completedTrainingToServerWriteType);

      console.log('=== createCompletedTrainings ===', workouts);

      validate(workouts, ServerWriteSchemas.completedTrainings);

      const result = await httpClientAPI.post<
        ServerRead.sr_CompletedTraining[],
        { workouts: ServerWrite.sw_CompletedTraining[] }
      >('/api/workouts', { workouts });

      return result;
    } catch (error) {
      console.error('[TrainingsServerApi]', error);
      throw error;
    }
  };

  const _get: TrainingsServerApi['get'] = {
    completedTrainings: getCompletedTrainings,
  };

  const _create: TrainingsServerApi['create'] = {
    completedTrainings: createCompletedTrainings,
  };

  const _update: TrainingsServerApi['update'] = {};

  const _delete: TrainingsServerApi['delete'] = {
    completedTraining: deleteCompletedTraining,
  };

  const _mappers: TrainingsServerApi['mappers'] = {
    toClientCompletedTrainings,
  };

  return {
    get: _get,
    create: _create,
    update: _update,
    delete: _delete,
    mappers: _mappers,
  };
};

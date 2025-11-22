import {
  ApiTools,
  ApiFactory,
  AppAPIs,
  TrainingsServerApi,
  CompletedTraining,
  CompletedTrainingExcercise,
  ServerWrite,
} from '../../types';
import {
  ServerReadSchemas,
  ServerWriteSchemas,
} from './schemas';

export const createTrainingsServerApi: ApiFactory<
  TrainingsServerApi,
  Pick<AppAPIs, 'httpClientAPI'>
>  = (
  { store, validator }: ApiTools,
  dependencies,
) => {
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

  const getCompletedTrainings = async () => {
    let data = [];

    try {
      data = await httpClientAPI.get<any[]>('/api/workouts');

      validate(data, ServerReadSchemas.completedTrainings);

      console.log('=== getCompletedTrainings ===', data);

      // const oneTraining = await httpClientAPI.get<any>(
      //   '/api/template-workouts/6e70818b-2318-4c25-8612-3461a411670b',
      // );
      // console.log('>>> oneTraining', oneTraining);
      // data = [oneTraining, ..._data];
    } catch (error) {
      console.error(error);
    } finally {
      return data;
    }
  };

  const completedExerciseToServerWriteType = (
    item: CompletedTrainingExcercise,
  ): ServerWrite.sw_CompletedExcercise[] => {
    return item.sets.map(set => {
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

  const createCompletedTrainings = async (data: CompletedTraining[]) => {
    try {
      const workouts = data.map(completedTrainingToServerWriteType);

      console.log('=== createCompletedTrainings ===', workouts);

      validate(workouts, ServerWriteSchemas.completedTrainings);

      const result = await httpClientAPI.post<any, {
        workouts: ServerWrite.sw_CompletedTraining[];
      }>('/api/workouts', {
        workouts,
      });

      // TODO avoid double insert
      // TODO change tempIds to DB ids?
    } catch (error) {
      console.error(error);
    }
  };

  const _get: TrainingsServerApi['get'] = {
    completedTrainings: getCompletedTrainings,
  };

  const _create: TrainingsServerApi['create'] = {
    completedTrainings: createCompletedTrainings,
  };

  const _update: TrainingsServerApi['update'] = {};

  const _delete: TrainingsServerApi['delete'] = {};

  return {
    get: _get,
    create: _create,
    update: _update,
    delete: _delete,
  };
};

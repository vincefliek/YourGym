import {
  ApiTools,
  ApiFactory,
  AppAPIs,
  TrainingsServerApi,
} from '../../types';
import {
  completedTrainingsServerSchema,
  completedTrainingServerSchema,
  completedExerciseServerSchema,
} from './schemas';

export const createTrainingsServerApi: ApiFactory<
  TrainingsServerApi,
  Pick<AppAPIs, 'httpClientAPI'>
>  = (
  { store, validator }: ApiTools,
  dependencies,
) => {
  validator.addSchema(completedTrainingsServerSchema);
  validator.addSchema(completedTrainingServerSchema);
  validator.addSchema(completedExerciseServerSchema);

  const { httpClientAPI } = dependencies;

  const validate = (data: any, schema: any) => {
    const validationResult = validator.validate(data, schema);

    if (!validationResult.valid) {
      console.error(
        '[ERROR_DATA] Validation for Server Training failed!',
        validationResult.errors,
      );
      throw new Error('Validation for Training failed!');
    }
  };

  const getCompletedTrainings = async () => {
    let data = [];

    try {
      data = await httpClientAPI.get<any[]>('/api/workouts');
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

  return {
    getCompletedTrainings,
  };
};

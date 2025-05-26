import { Validator } from 'jsonschema';
import { ApiTools, Store } from '../types';
import { createNavigationApi } from './navigationApi';
import { createTrainingsApi } from './trainingsApi';

export const createAPIs = (tools: ApiTools) => {
  return {
    navigationApi: createNavigationApi(tools),
    trainingsApi: createTrainingsApi(tools),
  };
};

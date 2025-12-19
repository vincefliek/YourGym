import { AppContext } from '../../types';

export interface Controller<T = any> {
  (serviceLocator: AppContext['serviceLocator']): T;
  storeDataAccessors: string[];
}

export interface ConnectParams<T = any> {
  controller: Controller<T>;
}

export interface MapToProps<T = any, P = any> {
  (controller: T): P;
}

export interface RequireDataConfig {
  isData: boolean;
  onNoData: () => void;
}

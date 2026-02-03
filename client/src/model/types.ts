import { Validator } from 'jsonschema';
import {
  Router,
  RouterConfiguration,
  RoutePaths,
} from './apis/navigationApi/router';

export type TimestampTZ =
  `${string}-${string}-${string}T${string}:${string}:${string}+${string}:${string}`;

export interface Set {
  id: string;
  repetitions: number;
  weight: number;
  done: boolean;
  time?: TimestampTZ;
}

export interface Exercise {
  id: string;
  name: string;
  // TODO add "type" for exercise
  // type: ExerciseType['value'] | 'unset-type';
  sets: Set[];
  /** @deprecated - calculate on the fly */
  setsPreview?: string;
}

export interface ExerciseType {
  group:
    | 'compound' // several muscle groups work together (e.g. Deadlift)
    | 'miscellaneous' // may be not directly gym related (e.g. Plank, Farmer’s walk)
    | 'chest'
    | 'legs'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'abs';
  value: string;
  label: string;
}

export interface Training {
  id: string;
  name: string;
  exercises: Exercise[];
}

export type CompletedSet = Omit<Set, 'done' | 'time'> & {
  /**
   * time stamp with time zone
   * the same as in Postgres DB
   * e.g. '2025-11-17T20:42:52.487+02:00'
   */
  timestamptz: TimestampTZ;
};

export interface CompletedTrainingExcercise extends Omit<
  Exercise,
  'setsPreview' | 'sets'
> {
  sets: CompletedSet[];
}

export type CompletedTraining = Omit<Training, 'exercises'> & {
  exercises: CompletedTrainingExcercise[];
  /**
   * time stamp with time zone
   * the same as in Postgres DB
   * e.g. '2025-11-17T20:42:52.487+02:00'
   */
  timestamptz: TimestampTZ;
  createdInDbAt?: TimestampTZ | undefined;
  updatedInDbAt?: TimestampTZ | undefined;
};

export type ActiveTraining = Pick<
  CompletedTraining,
  'id' | 'name' | 'exercises' | 'timestamptz'
> & {
  templateTrainingId?: string;
};

export interface Store {
  getStoreData: (publicDataAccessors: string[]) => { [key: string]: any };
  subscribe: (
    subscriber: () => void,
    publicDataAccessors: string[],
  ) => () => void;
  hasServerDataInIndexedDB(): Promise<boolean>;
  hydrateFromIndexedDB(): Promise<void>;
  get trainings(): Training[];
  set trainings(value: Training[]);
  get completedTrainings(): CompletedTraining[];
  set completedTrainings(value: CompletedTraining[]);
  get exerciseTypes(): ExerciseType[];
  set exerciseTypes(value: ExerciseType[]);
  get activeTraining(): ActiveTraining | null;
  set activeTraining(value: ActiveTraining | null);
  get newTraining(): Training | null;
  set newTraining(value: Training | null);
  get newExercise(): Exercise | null;
  set newExercise(value: Exercise | null);
  get auth(): AuthState;
  set auth(data: Partial<AuthState>);
  get sync(): SyncWithServer;
  set sync(data: Partial<SyncWithServer>);
  get notifications(): Notification[];
  set notifications(value: Notification[]);
  get uiBlockingLayer(): UiBlockingLayerState;
  set uiBlockingLayer(data: UiBlockingLayerState);
}

export interface UiBlockingLayerState {
  isVisible: boolean;
  message?: string;
}

export type NotificationType = 'error' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: TimestampTZ;
  // optional free-form metadata
  meta?: { [key: string]: any };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  // Add more fields as needed
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
}

export interface SyncWithServer {
  lastSyncAt: TimestampTZ | undefined;
  isLoading: boolean;
  serverHasChanges: boolean;
  error: string | undefined;
}

export interface ApiTools {
  store: Store;
  validator: Validator;
}

export interface AppAPIs {
  navigationApi: NavigationApi;
  trainingsApi: TrainingsApi;
  authApi: AuthApi;
  httpClientAPI: HttpClientAPI;
  trainingsServerApi: TrainingsServerApi;
  syncApi: SyncApi;
  notificationsApi: NotificationsApi;
}

export interface NotificationsApi {
  getNotifications: () => Notification[];
  addNotification: (notification: Partial<Notification>) => string;
  removeNotification: (id: string) => void;
}

export interface SyncApi {
  hasServerChanges: () => Promise<void>;
  sync: () => Promise<void>;
}

export type ApiFactory<T, D, M extends any[] = any[]> = (
  tools: ApiTools,
  dependencies: D,
  ...args: M
) => T;

export type { RouterConfiguration };

interface NavOptions {
  // template path as in definition, e.g. `/trainings/$training/new`
  goBackTo?: string;
}

export interface NavigationApi {
  __router: Router;
  routes: Record<string, RoutePaths>;
  setRouterConfiguration: (config: RouterConfiguration) => void;
  goBack: (params?: { replace?: boolean }) => void;
  toTrainings: (options?: NavOptions) => Promise<unknown>;
  toHome: (options?: NavOptions) => Promise<unknown>;
  toMenu: (options?: NavOptions) => Promise<unknown>;
  toCreateTraining: (
    newTrainingId: string,
    options?: NavOptions,
  ) => Promise<unknown>;
  toCreateExercise: (
    trainingId: string,
    exerciseId: string,
    options?: NavOptions,
  ) => Promise<unknown>;
  toEditNewExercise: (
    trainingId: string,
    exerciseId: string,
    options?: NavOptions,
  ) => Promise<unknown>;
  toEditExistingExercise: (
    trainingId: string,
    exerciseId: string,
    options?: NavOptions,
  ) => Promise<unknown>;
  toTraining: (trainingId: string, options?: NavOptions) => Promise<unknown>;
  toExercise: (
    trainingId: string,
    exerciseId: string,
    options?: NavOptions,
  ) => Promise<unknown>;
  toEditTraining: (
    trainingId: string,
    options?: NavOptions,
  ) => Promise<unknown>;
  toDashboard: (options?: NavOptions) => Promise<unknown>;
  isHomeUrl: (options?: NavOptions) => boolean;
  isTrainingsUrl: () => boolean;
  isMenuUrl: () => boolean;
  // live as in URL, e.g. `/trainings/dac07736-f441-4ae8-96a2-ff1a0c9febf7/new`
  getCurrentPath: () => string;
  // template as in definition, e.g. `/trainings/$training/new`
  getCurrentRoutePath: () => string | undefined;
  getPathParams: (route: string) => { [key: string]: string | undefined };
}

export interface TrainingsApi {
  get: {
    exerciseTypes: () => ExerciseType[];
  };
  create: {
    newTraining: () => void;
    newActiveTraining: (trainingId: string) => void;
    newExercise: () => void;
    set: (trainingId: string, exerciseId: string) => void;
    setsPreview: (sets: Set[]) => string;
    datePreview: (timestamptz: TimestampTZ) => string;
    timePreview: (timestamptz: TimestampTZ) => string;
    exerciseType: (exerciseType: Pick<ExerciseType, 'label' | 'group'>) => void;
  };
  update: {
    newTraining: (input: Partial<Training>) => void;
    newExercise: (input: Partial<Exercise>) => void;
    newActiveTraining: (
      templateTrainingsId: string,
      templateExerciseId: string,
      set: Set,
    ) => void;
    activeTraining: (input: Partial<ActiveTraining>) => void;
    training: (trainingId: string, input: Partial<Training>) => void;
    exercise: (
      trainingId: string,
      exerciseId: string,
      input: Partial<Exercise>,
    ) => void;
    allTrainings: (trainings: Training[]) => void;
    completedTrainings: (trainings: CompletedTraining[]) => void;
    exerciseTypes: (exerciseTypes: ExerciseType[]) => void;
    exercisesOrder: (trainingId: string, exercises: { id: string }[]) => void;
  };
  delete: {
    newTraining: () => void;
    newExercise: () => void;
    training: (id: string) => void;
    completedTraining: (trainingId: string) => Promise<void>;
    exercise: (trainingId: string, exerciseId: string) => void;
    set: (trainingId: string, exerciseId: string, setId: string) => void;
  };
  save: {
    newTraining: () => void;
    newExercise: (trainingId: string) => void;
    newActiveTraining: () => void;
  };
}

// TODO fix any
export interface AuthResponseData {
  session: any;
  user: any;
}

export interface AuthApi {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  getSession: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface HttpClientAPI {
  get<TResponse>(
    url: string,
    options?: RequestInit & { headers?: Record<string, string> },
  ): Promise<TResponse>;
  post<TResponse, TBody = any>(
    url: string,
    body?: TBody,
    options?: RequestInit & { headers?: Record<string, string> },
  ): Promise<TResponse>;
  put<TResponse, TBody = any>(
    url: string,
    body?: TBody,
    options?: RequestInit & { headers?: Record<string, string> },
  ): Promise<TResponse>;
  patch<TResponse, TBody = any>(
    url: string,
    body?: TBody,
    options?: RequestInit & { headers?: Record<string, string> },
  ): Promise<TResponse>;
  delete<TResponse>(
    url: string,
    options?: RequestInit & { headers?: Record<string, string> },
  ): Promise<TResponse>;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  expires_at: number; // seconds
}

export interface TokenStorage {
  getToken(): TokenPair | undefined;
  saveToken(tokenPair: TokenPair): void;
  clearToken(): void;
}

export namespace ServerRead {
  export interface sr_CompletedTraining {
    id: string;
    user_id: string;
    name: string;
    created_at: TimestampTZ;
    updated_at: TimestampTZ | null;
    date: TimestampTZ;
    exercises: sr_CompletedExcercise[];
  }

  export interface sr_CompletedExcercise {
    id: string;
    workout_id: string;
    user_id: string;
    name: string;
    created_at: TimestampTZ;
    updated_at: TimestampTZ | null;
    date: TimestampTZ;
    // TODO delete "custom" after "type" migration is completed
    type: 'custom' | string;
    reps: number;
    weight: number;
  }
}

export namespace ServerWrite {
  export interface sw_CompletedTraining {
    tempId: string;
    name: string;
    date: TimestampTZ;
    exercises: sw_CompletedExcercise[];
  }

  export interface sw_CompletedExcercise {
    name: string;
    date: TimestampTZ;
    type: string;
    reps: number;
    weight: number;
  }
}

export interface TrainingsServerApi {
  get: {
    completedTrainings: () => Promise<ServerRead.sr_CompletedTraining[]>;
  };
  create: {
    completedTrainings: (
      data: CompletedTraining[],
    ) => Promise<ServerRead.sr_CompletedTraining[]>;
  };
  mappers: {
    toClientCompletedTrainings: (
      data: ServerRead.sr_CompletedTraining[],
    ) => CompletedTraining[];
  };
  update: {};
  delete: {
    completedTraining: (data: CompletedTraining) => Promise<void>;
  };
}

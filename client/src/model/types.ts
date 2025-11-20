import { Validator } from 'jsonschema';

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
  sets: Set[];
  /** @deprecated - calculate on the fly */
  setsPreview?: string;
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

export interface CompletedTrainingExcercise
  extends Omit<Exercise, 'setsPreview' | 'sets'> {
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
}


export interface Store {
  getStoreData: (publicDataAccessors: string[]) => { [key: string]: any };
  subscribe: (subscriber: () => void, publicDataAccessors: string[]) => () => void;
  get route(): string | undefined;
  set route(value: string | undefined);
  get backRouteWithHistoryReplace(): string | undefined;
  set backRouteWithHistoryReplace(value: string | undefined);
  get trainings(): Training[];
  set trainings(value: Training[]);
  get completedTrainings(): CompletedTraining[];
  set completedTrainings(value: CompletedTraining[]);
  get activeTraining(): CompletedTraining | null;
  set activeTraining(value: CompletedTraining | null);
  get newTraining(): Training | null;
  set newTraining(value: Training | null);
  get newExercise(): Exercise | null;
  set newExercise(value: Exercise | null);
  get auth(): AuthState;
  set auth(data: Partial<AuthState>);
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
}

export type ApiFactory<T, D, M extends any[] = any[]> = (
  tools: ApiTools,
  dependencies: D,
  ...args: M
) => T;

export interface NavigationApi {
  routes: {
    home: string;
    trainings: string;
    menu: string;
    createTraining: string;
    createExercise: string;
    editNewExercise: string;
    editExistingExercise: string;
    openTraining: string;
    openExercise: string;
    editTraining: string;
  };
  goBack: () => void;
  setBackRouteWithReplace: (
    route: string | undefined,
  ) => void;
  resetRoute: () => void;
  toTrainings: () => Promise<unknown>;
  toHome: () => Promise<unknown>;
  toMenu: () => Promise<unknown>;
  toCreateTraining: () => Promise<unknown>;
  toCreateExercise: (trainingId: string) => Promise<unknown>;
  toEditNewExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
  toEditExistingExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
  toTraining: (trainingId: string) => Promise<unknown>;
  toExercise: (trainingId: string, exerciseId: string) => Promise<unknown>;
  toEditTraining: (trainingId: string) => Promise<unknown>;
  isHomeUrl: () => boolean;
  isTrainingsUrl: () => boolean;
  isMenuUrl: () => boolean;
  getPathParams: (route: string) => { [key: string]: string | undefined };
}

export interface TrainingsApi {
  create: {
    newTraining: () => void;
    newActiveTraining: (trainingId: string) => void;
    newExercise: () => void;
    set: (trainingId: string, exerciseId: string) => void;
    setsPreview: (sets: Set[]) => string;
    datePreview: (timestamptz: TimestampTZ) => string;
    timePreview: (timestamptz: TimestampTZ) => string;
  };
  update: {
    newTraining: (input: Partial<Training>) => void;
    newExercise: (input: Partial<Exercise>) => void;
    newActiveTraining: (
      templateTrainingsId: string,
      templateExerciseId: string,
      set: Set,
    ) => void;
    training: (trainingId: string, input: Partial<Training>) => void;
    exercise: (trainingId: string, exerciseId: string, input: Partial<Exercise>) => void;
    allTrainings: (trainings: Training[]) => void;
    completedTrainings: (trainings: CompletedTraining[]) => void;
  };
  delete: {
    newTraining: () => void;
    newExercise: () => void;
    training: (id: string) => void;
    completedTraining: (trainingId: string) => void;
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
  get<TResponse>(url: string, options?: RequestInit & { headers?: Record<string, string> }): Promise<TResponse>;
  post<TResponse, TBody = any>(
    url: string,
    body?: TBody,
    options?: RequestInit & { headers?: Record<string, string> }
  ): Promise<TResponse>;
  put<TResponse, TBody = any>(
    url: string,
    body?: TBody,
    options?: RequestInit & { headers?: Record<string, string> }
  ): Promise<TResponse>;
  patch<TResponse, TBody = any>(
    url: string,
    body?: TBody,
    options?: RequestInit & { headers?: Record<string, string> }
  ): Promise<TResponse>;
  delete<TResponse>(url: string, options?: RequestInit & { headers?: Record<string, string> }): Promise<TResponse>;
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

export interface TrainingsServerApi {
  // TODO fix any
  getCompletedTrainings: () => Promise<any[]>;
}

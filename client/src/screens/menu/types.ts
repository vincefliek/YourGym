export interface MenuController {
  getAuthData: () => {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  getSyncData: () => {
    lastSyncAt: string | undefined;
    isLoading: boolean;
    serverHasChanges: boolean;
    error: string | undefined;
  };
  sync: () => Promise<void>;
  signout: () => Promise<void>;
}

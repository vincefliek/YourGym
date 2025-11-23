export interface MenuController {
  getAuthData: () => {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  getSyncData: () => {
    lastSyncAt: string | undefined;
    isLoading: boolean;
    error: string | undefined;
  };
}

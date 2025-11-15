export interface MenuController {
  getAuthData: () => {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

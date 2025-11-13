export const mockUser = {
  id: '1',
  email: 'test@example.com',
};

export const tokenStorage = {
  getToken: () => ({
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 3600,
    expires_at: Date.now(),
  }),
  saveToken: jest.fn(),
  clearToken: jest.fn(),
};

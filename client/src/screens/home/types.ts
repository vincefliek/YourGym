export interface HomeProps {
  isAuthenticated: boolean;
  fetchAuthData: () => Promise<void>;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
}

export interface HomeController {
  isAuthenticated: () => boolean;
  fetchAuthData: () => Promise<void>;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
}

export interface HomeProps {
  isAuthenticated: boolean;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
}

export interface HomeController {
  isAuthenticated: () => boolean;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  signout: () => void;
}

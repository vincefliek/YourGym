export interface AuthProtectionProps {
  isAuthenticated: boolean;
  navigate: () => void;
}

export interface AuthProtectionController {
  isAuthenticated: () => boolean;
  navigate: () => Promise<void>;
}

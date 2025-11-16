export interface AuthProtectionProps {
  isAuthenticated: boolean;
  navigateHome: () => void;
}

export interface AuthProtectionController {
  isAuthenticated: () => boolean;
  navigateHome: () => Promise<void>;
}

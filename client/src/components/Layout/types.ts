import { ReactNode } from 'react';

export interface LayoutProps {
  topBar?: ReactNode;
  bottomBar?: ReactNode;
  children?: ReactNode;
}

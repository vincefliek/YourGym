import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonSkin = 'zero-style' | 'primary' | 'icon' | 'text';
export type ButtonFont = 'nunito' | 'indieFlower';
export type ButtonSize = 'small' | 'medium' | 'large' | 'xLarge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  skin?: ButtonSkin;
  font?: ButtonFont;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

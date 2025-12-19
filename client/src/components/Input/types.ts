import { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onBlur'
> {
  value: string | number;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

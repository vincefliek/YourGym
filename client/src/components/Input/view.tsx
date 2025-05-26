import React, { useCallback } from 'react';
import classnames from 'classnames';
import { InputProps } from './types';

import style from './style.module.scss';

export const Input: React.FC<InputProps> = ({ value, onChange, onBlur, className, ...props }) => {
  const [localValue, setLocalValue] = React.useState(value);

  const onChangeLocal = useCallback((eventObject: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = eventObject.target.value;
    setLocalValue(newValue);
    onChange?.(newValue, eventObject);
  }, [onChange]);

  const onBlurLocal = useCallback((eventObject: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(String(localValue), eventObject);
  }, [localValue, onBlur]);

  return (
    <input
      {...props}
      value={localValue}
      onChange={onChangeLocal}
      onBlur={onBlurLocal}
      className={classnames(style.input, className)}
    />
  );
};

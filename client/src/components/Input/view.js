import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.module.scss';

export const Input = ({ value, onChange, onBlur, className, ...props }) => {
  const [localValue, setLocalValue] = React.useState(value);

  const onChangeLocal = useCallback(eventObject => {
    const newValue = eventObject.target.value;
    setLocalValue(newValue);
    onChange?.(newValue, eventObject);
  }, [onChange]);

  const onBlurLocal = useCallback(eventObject => {
    onBlur?.(localValue, eventObject);
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

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.func,
};

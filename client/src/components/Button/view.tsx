import React from 'react';
import classnames from 'classnames';
import { ButtonProps } from './types';

import style from './style.module.scss';

export const Button: React.FC<ButtonProps> = ({
  skin,
  font,
  size,
  className,
  children,
  ...props
}) => {
  const skinClassName = {
    [style.zeroStyle]: skin === 'zero-style',
    [style.primary]: skin === 'primary',
    [style.icon]: skin === 'icon',
    [style.text]: skin === 'text',
  };
  const fontClassName = {
    [style.nunito]: font === 'nunito',
    [style.indieFlower]: font === 'indieFlower',
  };
  const sizeClassName = {
    [style.small]: size === 'small',
    [style.medium]: size === 'medium',
    [style.large]: size === 'large',
    [style.xLarge]: size === 'xLarge',
  };

  return (
    <button
      type="button"
      {...props}
      className={classnames(
        className,
        style.button,
        skinClassName,
        fontClassName,
        sizeClassName,
      )}
    >
      {children}
    </button>
  );
};

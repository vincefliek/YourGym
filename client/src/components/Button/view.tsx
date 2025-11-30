import React from 'react';
import classnames from 'classnames';
import { ButtonProps } from './types';
import { isIOS as _isIOS } from '../../utils';

import style from './style.module.scss';

const isIOS = _isIOS();

export const Button: React.FC<ButtonProps> = ({
  skin,
  font,
  size,
  className,
  children,
  disabled,
  onClick,
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

  /**
   * iOS fix:
   * on iOS, onClick event is not always triggered.
   * the issue was noticed when focus was on input and
   * later un-focusing it by clicking in an empty space.
   * after that, all buttons became unclickable.
   */
  const onClickIOSFix = isIOS
    ? { onTouchEnd: (e: any) => onClick?.(e) }
    : { onClick };

  return (
    <button
      type="button"
      {...props}
      {...(disabled ? void 0 : onClickIOSFix)}
      disabled={disabled}
      className={classnames(
        className,
        style.button,
        skinClassName,
        fontClassName,
        sizeClassName,
        { [style.disabled]: disabled },
      )}
    >
      {children}
    </button>
  );
};

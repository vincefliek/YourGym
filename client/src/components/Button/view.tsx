import React from 'react';
import classnames from 'classnames';
import { ButtonProps } from './types';
import { isIOS as _isIOS } from '../../utils';

import style from './style.module.scss';

const isIOS = _isIOS();

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { skin, font, size, className, children, disabled, onClick, ...props },
    ref,
  ) => {
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
    const Component = isIOS ? IOSFixedOnClickButton : RegularButton;

    return (
      <Component
        type="button"
        {...props}
        ref={ref}
        onClick={disabled ? void 0 : onClick}
        disabled={disabled}
        className={classnames(
          className,
          style.button,
          skinClassName,
          fontClassName,
          sizeClassName,
          { [style.disabled]: disabled },
        )}
        children={children}
      />
    );
  },
);

Button.displayName = 'Button';

const RegularButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => <button ref={ref} {...props} />);

RegularButton.displayName = 'RegularButton';

const IOSFixedOnClickButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    style?: React.CSSProperties;
  }
>(({ onClick, children, style, ...props }, ref) => {
  const isScrolling = React.useRef(false);

  // 1. Detect if the user starts moving (scrolling)
  const onPointerMove = () => {
    isScrolling.current = true;
  };

  // 2. Reset the scroll flag when they first touch
  const onPointerDown = () => {
    isScrolling.current = false;
  };

  // 3. Only fire the handler if they didn't scroll
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isScrolling.current && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        ...style,
        touchAction: 'pan-y',
      }}
    >
      {children}
    </button>
  );
});

IOSFixedOnClickButton.displayName = 'IOSFixedOnClickButton';

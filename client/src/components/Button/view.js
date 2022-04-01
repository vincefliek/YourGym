import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.module.scss';

export const Button = ({ skin, font, size, className, children, ...props }) => {
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

Button.propTypes = {
  className: PropTypes.string,
  skin: PropTypes.oneOf([
    'zero-style',
    'primary',
    // 'secondary', // for future
    'icon',
    'text',
  ]).isRequired,
  font: PropTypes.oneOf([
    'nunito',
    'indieFlower',
  ]),
  size: PropTypes.oneOf([
    'small',
    'medium',
    'large',
    'xLarge',
  ]),
};

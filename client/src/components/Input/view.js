import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.module.scss';

export const Input = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={classnames(style.input, className)}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
};

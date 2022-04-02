import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.module.scss';

export const NavbarContainer = ({ className, children }) => {
  return (
    <div className={classnames(style.navbar, className)}>
      {children}
    </div>
  );
};

NavbarContainer.propTypes = {
  className: PropTypes.string,
};

import React from 'react';

import { connect } from '../../utils';
import { ReactComponent as Burger } from '../../assets/burger.svg';
import { controller } from './controller';
import style from './style.module.scss';

class PureNavbar extends React.Component {
  render() {
    const {
      onHomeClick,
      onTrainingsClick,
      isHomeActive,
      isTrainingsActive,
    } = this.props;
    return (
      <div className={style.navbar}>
        <button
          onClick={onHomeClick}
          className={`${style.button} ${isHomeActive && style.active}`}
        >
          Home
        </button>
        <button
          onClick={onTrainingsClick}
          className={`${style.button} ${isTrainingsActive && style.active}`}
        >
          Trainings
        </button>
        <div className={style.hamburger}>
          <Hamburger />
        </div>
      </div>
    );
  }
}

export const Navbar = connect({
  controller,
}, ctrl => ({
  onHomeClick: ctrl.onHomeClick,
  onTrainingsClick: ctrl.onTrainingsClick,
  isHomeActive: ctrl.isHomeActive(),
  isTrainingsActive: ctrl.isTrainingsActive(),
}))(PureNavbar);

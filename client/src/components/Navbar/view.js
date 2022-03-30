import React from 'react';

import { connect } from '../../utils';
import { Hamburger } from '../icons';
import { controller } from './controller';
import style from './style.module.scss';

class PureNavbar extends React.Component {
  render() {
    const { onHomeClick, onTrainingsClick, isHomeActive, isTrainingsActive } = this.props;
    return (
      <div className={style.navbar}>
        <button onClick={onHomeClick} className={`${style.button} ${isHomeActive && style.navbarActive}`}>
          Home
        </button>
        <button onClick={onTrainingsClick} className={`${style.button} ${isTrainingsActive && style.navbarActive}`} >
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

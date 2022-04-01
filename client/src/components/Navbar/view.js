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
      onBurgerClick,
      isHomeActive,
      isTrainingsActive,
      isBurgerActive,
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
        <button 
          onClick={onBurgerClick}
          className={`${style.burger} ${style.button} ${isBurgerActive && style.activeBurger}`}
        >
          <Burger />
        </button>
      </div>
    );
  }
}

export const Navbar = connect({
  controller,
}, ctrl => ({
  onHomeClick: ctrl.onHomeClick,
  onTrainingsClick: ctrl.onTrainingsClick,
  onBurgerClick: ctrl.onBurgerClick,
  isHomeActive: ctrl.isHomeActive(),
  isTrainingsActive: ctrl.isTrainingsActive(),
  isBurgerActive: ctrl.isBurgerActive(),
}))(PureNavbar);

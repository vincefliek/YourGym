import React from 'react';
import classnames from 'classnames';

import { connect } from '../../utils';
import { ReactComponent as Burger } from '../../assets/burger.svg';
import { controller } from './controller';
import { Button } from '../Button';

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
        <Button
          skin="text"
          font="indieFlower"
          size="large"
          className={classnames({
            [style.active]: isHomeActive,
          })}
          onClick={onHomeClick}
        >
          Home
        </Button>
        <Button
          skin="text"
          font="indieFlower"
          size="large"
          className={classnames({
            [style.active]: isTrainingsActive,
          })}
          onClick={onTrainingsClick}
        >
          Trainings
        </Button>
        <Button 
          skin="icon"
          size="large"
          className={classnames(
            style.burger, {
            [style.activeBurger]: isBurgerActive,
          })}
          onClick={onBurgerClick}
        >
          <Burger />
        </Button>
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

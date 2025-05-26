import React from 'react';
import classnames from 'classnames';

import { connect } from '../../utils';
import { ReactComponent as Burger } from '../../assets/burger.svg';
import { ReactComponent as Dumbbell } from '../../assets/dumbbell.svg';
import { controller } from './controller';
import { Button } from '../Button';
import { NavbarContainer } from '../NavbarContainer';
import { NavbarProps, NavbarState, NavbarController } from './types';

import style from './style.module.scss';

class PureNavbar extends React.Component<NavbarProps, NavbarState> {
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
      <NavbarContainer>
        <Button
          skin="text"
          font="indieFlower"
          size="large"
          className={classnames({
            [style.active]: isHomeActive,
          })}
          onClick={onHomeClick}
        >
          <Dumbbell />
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
          skin="text"
          font="indieFlower"
          size="large"
          className={classnames({
            [style.active]: isBurgerActive,
          })}
          onClick={onBurgerClick}
        >
          <Burger />
        </Button>
      </NavbarContainer>
    );
  }
}

export const Navbar = connect<NavbarController, NavbarProps>({
  controller,
}, ctrl => ({
  onHomeClick: ctrl.onHomeClick,
  onTrainingsClick: ctrl.onTrainingsClick,
  onBurgerClick: ctrl.onBurgerClick,
  isHomeActive: ctrl.isHomeActive(),
  isTrainingsActive: ctrl.isTrainingsActive(),
  isBurgerActive: ctrl.isBurgerActive(),
}))(PureNavbar);

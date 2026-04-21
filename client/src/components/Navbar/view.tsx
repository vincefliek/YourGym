import React from 'react';
import classnames from 'classnames';

import { connect } from '../../utils';
import { BurgerIcon, DumbbellIcon, MoonIcon, SunIcon } from '../icons';
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
      onDashboardClick,
      onThemeToggle,
      currentTheme,
      isHomeActive,
      isTrainingsActive,
      isBurgerActive,
      isDashboardActive,
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
          data-testid="nav-home-button"
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
          data-testid="nav-trainings-button"
        >
          Trainings
        </Button>
        <Button
          skin="text"
          font="indieFlower"
          size="large"
          className={classnames({
            [style.active]: isDashboardActive,
          })}
          onClick={onDashboardClick}
          data-testid="nav-progress-button"
        >
          Progress
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onThemeToggle}
          data-testid="nav-theme-toggle-button"
        >
          {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Button
          skin="icon"
          size="large"
          className={classnames(style.burger, {
            [style.activeBurger]: isBurgerActive,
            [style.animationBurger]: isBurgerActive,
          })}
          onClick={onBurgerClick}
          data-testid="nav-burger-button"
        >
          <BurgerIcon />
          <DumbbellIcon />
        </Button>
      </NavbarContainer>
    );
  }
}

export const Navbar = connect<NavbarController, NavbarProps>(
  {
    controller,
  },
  (ctrl) => ({
    onHomeClick: ctrl.onHomeClick,
    onTrainingsClick: ctrl.onTrainingsClick,
    onBurgerClick: ctrl.onBurgerClick,
    onDashboardClick: ctrl.onDashboardClick,
    onThemeToggle: ctrl.onThemeToggle,
    currentTheme: ctrl.getCurrentTheme(),
    isHomeActive: ctrl.isHomeActive(),
    isTrainingsActive: ctrl.isTrainingsActive(),
    isBurgerActive: ctrl.isBurgerActive(),
    isDashboardActive: ctrl.isDashboardActive(),
  }),
)(PureNavbar);

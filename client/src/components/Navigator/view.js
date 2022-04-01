import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from '../../utils';
import { controller } from './controller';

class PureNavigator extends React.PureComponent {
  componentDidUpdate(prevProps, prevState) {
    this.props.onNavigateFinish();
  }

  render() {
    const { routes, isHome, isTrainings, isBurger } = this.props;
    return (
      <>
        {isHome && <Navigate to={routes.home} />}
        {isTrainings && <Navigate to={routes.trainings} />}
        {isBurger && <Navigate to={routes.burger} />}
      </>
    );
  }
}

export const Navigator = connect({
  controller,
}, ctrl => ({
  routes: ctrl.getRoutes(),
  isHome: ctrl.isHome(),
  isTrainings: ctrl.isTrainings(),
  isBurger: ctrl.isBurger(),
  onNavigateFinish: ctrl.onNavigateFinish,
}))(PureNavigator);

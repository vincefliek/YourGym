import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from '../../utils';
import { controller } from './controller';

class PureNavigator extends React.PureComponent {
  componentDidUpdate() {
    this.props.onNavigateFinish();
  }

  render() {
    const { routes, isHome, isTrainings } = this.props;
    return (
      <>
        {isHome && <Navigate to={routes.home} />}
        {isTrainings && <Navigate to={routes.trainings} />}
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
  onNavigateFinish: ctrl.onNavigateFinish,
}))(PureNavigator);

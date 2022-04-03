import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from '../../utils';
import { controller } from './controller';

class PureNavigator extends React.PureComponent {
  componentDidUpdate() {
    this.props.onNavigateFinish();
  }

  render() {
    const {
      route,
      replace,
    } = this.props;

    if (!route) {
      return null;
    }

    return <Navigate to={route} replace={replace} />;
  }
}

export const Navigator = connect({
  controller,
}, ctrl => ({
  route: ctrl.getRoute(),
  replace: ctrl.isReplace(),
  onNavigateFinish: ctrl.onNavigateFinish,
}))(PureNavigator);

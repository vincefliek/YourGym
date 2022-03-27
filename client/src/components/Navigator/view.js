import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from '../../model';
import { controller } from './controller';

class PureNavigator extends React.PureComponent {
  componentDidUpdate(prevProps, prevState) {
    this.props.onNavigateFinish();
  }

  render() {
    const { isHome, isTrainings } = this.props;
    return (
      <>
        {isHome && <Navigate to="/" />}
        {isTrainings && <Navigate to="trainings" />}
      </>
    );
  }
}

export const Navigator = connect({
  controller,
}, ctrl => ({
  isHome: ctrl.isHome(),
  isTrainings: ctrl.isTrainings(),
  onNavigateFinish: ctrl.onNavigateFinish,
}))(PureNavigator);

import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import './style.css';

class PureNavbar extends React.Component {
  render() {
    const { onHomeClick, onTrainingsClick, isHomeActive, isTrainingsActive } = this.props;
    return (
      <div className="navbar">
        <button onClick={onHomeClick} className={isHomeActive && 'navbar-active'}>
          Home
        </button>
        <button onClick={onTrainingsClick} className={isTrainingsActive && 'navbar-active'}>
          Trainings
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
  isHomeActive: ctrl.isHomeActive(),
  isTrainingsActive: ctrl.isTrainingsActive(),
}))(PureNavbar);

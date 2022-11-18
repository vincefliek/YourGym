import React from 'react';

import { Button, Layout, NavbarContainer } from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as BackIcon } from '../../assets/backArrow.svg';

import style from './style.module.scss';

class PureTrainingResults extends React.Component {
  renderTopBar = () => {
    const { date } = this.props;
    return(
      <div className={style.topBar}>
        <h2 className={style.title}>
          Training results
        </h2>

        <h3 className={style.date}>
          {date}
        </h3>
      </div>
    );
  };

  renderBottomBar = () => {
    const { onBack } = this.props;

    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onBack}
        >
          <BackIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderInfo = () => {
    const { training } = this.props;
    return (
      <div className={style.trainingResults}>
        <div className={style.nameBox}>
          <h5>
            The name of the training:
          </h5>
          <h3>
            {training.name}
          </h3>
        </div>
        <div className={style.trainingTimeBox}>
          <h5>Training time:</h5>
          <h3>{training.trainingTime}</h3>
        </div>
        <div className={style.trainingInfo}>
          <div className={style.totalRepetitionsBox}>
            <h5>Reps done:</h5>
            <h3>{`${training.totalRepetitions}`}</h3>
          </div>

          <div className={style.totalWeightBox}>
            <h5>Weight lifted:</h5>
            <h3>{`${training.totalWeight}`} kg</h3>
          </div>
        </div>

      </div>
    );
  };

  render() {
    // const { training } = this.props;

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={style.screen}>
          {this.renderInfo()}
        </div>
      </Layout>
    );
  }
}

export const TrainingResults = connect({
  controller,
}, ctrl => ({
  training: ctrl.getTraining(),
  date: ctrl.getDate(),
  onNoData: ctrl.onNoData,
  onBack: ctrl.onBack,
}))(
  requireData(props => ({
    isData: Boolean(props.training),
    onNoData: props.onNoData,
  }))(
    PureTrainingResults,
  ),
);

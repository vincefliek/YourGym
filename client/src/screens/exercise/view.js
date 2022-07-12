import React from 'react';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
} from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as BackIcon } from '../../assets/backArrow.svg';
import { ReactComponent as ArrowLeft } from '../../assets/arrowLeft.svg';
import { ReactComponent as ArrowRight } from '../../assets/arrowRight.svg';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';

import style from './style.module.scss';

class PureExercise extends React.Component {
  renderTopBar = () => {
    const { exercise } = this.props;
    return(
      <div className={style.topBar}>
        {exercise.name}
      </div>
    );
  };

  renderBottomBar = () => {
    const { training, onBack } = this.props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onBack}
        >
          <BackIcon />
        </Button>
        <div className={style.switch}>
          <Button
            skin="icon"
            size="large"
            // onClick={}
          >
            <ArrowLeft />
          </Button>
          <div>
            1/
            {training.exercises.length}
          </div>
          <Button
            skin="icon"
            size="large"
            // onClick={}
          >
            <ArrowRight />
          </Button>
        </div>
      </NavbarContainer>
    );
  };

  renderSets = () => {
    const { training, exercise, onDoneSet } = this.props;
    return (
      <ul className={style.sets}>
        {exercise.sets.map((set) => {
          return (
            <li
              key={set.id}
              className={style.set}
            >
              <div className={style.setRepetitions}>
                <Input
                  type="number"
                  value={set.repetitions}
                  readOnly
                />
              </div>
              <div>X</div>
              <div className={style.setWeight}>
                <Input
                  type="number"
                  value={set.weight}
                  readOnly
                />
              </div>
              <div className={style.weightUnit}>
                kg
              </div>
              <Button
                skin="icon"
                size="large"
                className={style.setDone}
                onClick={() => onDoneSet(training.id, exercise.id, set)}
              >
                <DoneIcon />
              </Button>
            </li>
          );
        })}
      </ul>
    );
  };

  renderSetsHistory = () => {
    const { exercise } = this.props;
    return (
      <div className={style.history}>
        <div className={style.historyUnit}>
          History
        </div>
        <ul className={style.sets}>
          {exercise.setsHistory.map((set) => {
            return (
              <li
                key={set.id}
                className={style.set}
              >
                <div className={style.setRepetitions}>
                  <Input
                    type="number"
                    value={set.repetitions}
                    readOnly
                  />
                </div>
                <div>X</div>
                <div className={style.setWeight}>
                  <Input
                    type="number"
                    value={set.weight}
                    readOnly
                  />
                </div>
                <div className={style.weightUnit}>
                  kg
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  render() {
    // const { exercise, onStart } = this.props;

    // const areExercises = Boolean(exercise.exercises.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={style.screen}>
          {this.renderSets()}
          {this.renderSetsHistory()}
        </div>
      </Layout>
    );
  }
}

export const Exercise = connect({
  controller,
}, ctrl => ({
  exercise: ctrl.getExercise(),
  training: ctrl.getTraining(),
  onDoneSet: ctrl.onDoneSet,
  onNoData: ctrl.onNoData,
  onBack: ctrl.onBack,
}))(
  requireData(props => ({
    isData: Boolean(props.exercise),
    onNoData: props.onNoData,
  }))(
    PureExercise,
  ),
);

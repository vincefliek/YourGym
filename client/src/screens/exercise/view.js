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
    const {
      training,
      onBack,
      onExerciseNext,
      onExercisePrev,
    } = this.props;
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
            onClick={() => onExercisePrev(training)}
          >
            <ArrowLeft />
          </Button>
          <div>
            {training.exerciseIndex + 1}
            /
            {training.exercises.length}
          </div>
          <Button
            skin="icon"
            size="large"
            onClick={() => onExerciseNext(training)}
          >
            <ArrowRight />
          </Button>
        </div>
      </NavbarContainer>
    );
  };

  renderSets = () => {
    const { exercise, onDoneSet } = this.props;
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
                onClick={() => onDoneSet(exercise.id, set)}
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
    const { exercise } = this.props;

    const areSets = Boolean(exercise.sets.length);
    const areSetsHistory = Boolean(exercise.setsHistory.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={style.screen}>
          {areSets && this.renderSets()}
          {areSetsHistory && this.renderSetsHistory()}
        </div>
      </Layout>
    );
  }
}

export const Exercise = connect({
  controller,
}, ctrl => ({
  training: ctrl.getTraining(),
  exercise: ctrl.getExercise(),
  onDoneSet: ctrl.onDoneSet,
  onExerciseNext: ctrl.onExerciseNext,
  onExercisePrev: ctrl.onExercisePrev,
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

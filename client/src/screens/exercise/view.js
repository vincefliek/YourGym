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
      exercise,
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
            onClick={() => onExercisePrev(training, exercise)}
          >
            <ArrowLeft />
          </Button>
          <div>
            {training.exercises.indexOf(exercise) + 1}
            /
            {training.exercises.length}
          </div>
          <Button
            skin="icon"
            size="large"
            onClick={() => onExerciseNext(training, exercise)}
          >
            <ArrowRight />
          </Button>
        </div>
      </NavbarContainer>
    );
  };

  renderSets = () => {
    const {
      training,
      exercise,
      onDoneSet,
      onChangeRepetitions,
      onChangeWeight,
    } = this.props;
    return (
      <ul className={style.sets}>
        {exercise.sets.map((set) => {
          return (
            <li
              key={set.id}
              className={style.set}
            >
              <div className={style.setPreview}>
                <div className={style.setRepetitions}>
                  <Input
                    type="number"
                    value={set.repetitions}
                    onBlur={value =>
                      onChangeRepetitions(exercise.id, set.id, value)
                    }
                  />
                </div>
                <div>X</div>
                <div className={style.setWeight}>
                  <Input
                    type="number"
                    value={set.weight}
                    onBlur={value => onChangeWeight(exercise.id, set.id, value)}
                  />
                </div>
                <div >
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
              </div>
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
        <ul className={style.setsHistoryBox}>
          {exercise.setsHistory.map(setsByDate => {
            return (
              <li
                key={setsByDate.date}
                className={style.setsByDate}
              >
                <ul className={style.sets}>
                  <div className={style.setsDate}>
                    <b>
                      {setsByDate.date}
                    </b>
                  </div>

                  {setsByDate.sets.map((set, index) => {
                    return (
                      <li
                        key={set.id}
                        className={style.set}
                      >
                        <div className={style.setPreview}>
                          <div className={style.setUnit}>
                            <b>№{setsByDate.sets.length - index}</b> {' '}
                            {set.repetitions}x{set.weight}kg
                          </div>
                          <div className={style.setTime}>
                            {set.time}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
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
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onChangeWeight: ctrl.onChangeWeight,
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

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
import { Exercise as ExerciseType, Set, Training } from '../../model/types';

import style from './style.module.scss';

interface Props {
  training: Training;
  exercise: ExerciseType;
  // TODO implement
  setsHistory: any[];
  isInProgress: boolean;
  getCurrentExercise: (training: Training, exercise: ExerciseType) => number;
  getTotalExercises: (training: Training) => number;
  onChangeRepetitions: (exerciseId: string, setId: string, value: number) => void;
  onChangeWeight: (exerciseId: string, setId: string, value: number) => void;
  onDoneSet: (trainingId: string, exerciseId: string, set: Set) => void;
  onResetDoneSet: (trainingId: string, exerciseId: string, set: Set) => void;
  onExerciseNext: (training: Training, exercise: ExerciseType) => void;
  onExercisePrev: (training: Training, exercise: ExerciseType) => void;
  onNoData: () => void;
  onBack: () => void;
}

class PureExercise extends React.Component<Props> {
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
      isInProgress,
      getCurrentExercise,
      getTotalExercises,
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
        {isInProgress && <div className={style.switch}>
          <Button
            skin="icon"
            size="large"
            onClick={() => onExercisePrev(training, exercise)}
          >
            <ArrowLeft />
          </Button>
          <div>
            {getCurrentExercise(training, exercise)}
            /
            {getTotalExercises(training)}
          </div>
          <Button
            skin="icon"
            size="large"
            onClick={() => onExerciseNext(training, exercise)}
          >
            <ArrowRight />
          </Button>
        </div>}
      </NavbarContainer>
    );
  };

  renderSets = () => {
    const {
      training,
      exercise,
      isInProgress,
      onDoneSet,
      onResetDoneSet,
      onChangeRepetitions,
      onChangeWeight,
    } = this.props;

    return (
      <ul className={style.sets}>
        {exercise.sets.map((set) => {
          const isDisabledInput = set.done || !isInProgress;

          return (
            <li
              key={set.id}
              className={style.set}
            >
              <div className={style.setPreview}>
                <div className={style.setRepetitions}>
                  <Input
                    type="number"
                    disabled={isDisabledInput}
                    value={set.repetitions}
                    onBlur={value =>
                      onChangeRepetitions(exercise.id, set.id, Number(value))
                    }
                  />
                </div>
                <div>X</div>
                <div className={style.setWeight}>
                  <Input
                    type="number"
                    disabled={isDisabledInput}
                    value={set.weight}
                    onBlur={value =>
                      onChangeWeight(exercise.id, set.id, Number(value))
                    }
                  />
                </div>
                <div>
                kg
                </div>
                {isInProgress ? (
                  set.done ? (
                    <Button
                      skin="text"
                      size="large"
                      font="indieFlower"
                      onClick={() =>
                        onResetDoneSet(training.id, exercise.id, set)}
                    >
                      done
                    </Button>
                  ) : (
                    <Button
                      skin="icon"
                      size="large"
                      className={style.setDone}
                      onClick={() => onDoneSet(training.id, exercise.id, set)}
                    >
                      <DoneIcon />
                    </Button>
                  )
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  renderSetsHistory = () => {
    const { setsHistory } = this.props;
    return (
      <div className={style.history}>
        <div className={style.historyUnit}>
          History
        </div>
        <ul className={style.setsHistoryBox}>
          {setsHistory.map((setsByDate: any) => {
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

                  {setsByDate.sets.map((set: any, index: any) => {
                    return (
                      <li
                        key={set.id}
                        className={style.set}
                      >
                        <div className={style.setPreview}>
                          <div className={style.setUnit}>
                            <b>№{index + 1}</b> {' '}
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
    const { exercise, setsHistory } = this.props;

    const areSets = Boolean(exercise.sets.length);
    const areSetsHistory = Boolean(setsHistory.length);

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

// TODO - add types for controller
export const Exercise = connect<any, Props>({
  controller,
}, ctrl => ({
  training: ctrl.getTraining(),
  exercise: ctrl.getExercise(),
  setsHistory: ctrl.getSetsHistory(),
  isInProgress: ctrl.isInProgress(),
  getCurrentExercise: ctrl.getCurrentExerciseIntoNavbar,
  getTotalExercises: ctrl.getTotalExercisesIntoNavbar,
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onChangeWeight: ctrl.onChangeWeight,
  onDoneSet: ctrl.onDoneSet,
  onResetDoneSet: ctrl.onResetDoneSet,
  onExerciseNext: ctrl.onExerciseNext,
  onExercisePrev: ctrl.onExercisePrev,
  onNoData: ctrl.onNoData,
  onBack: ctrl.onBack,
}))(
  requireData<Props>(props => ({
    isData: Boolean(props.exercise),
    onNoData: props.onNoData,
  }))(
    PureExercise,
  ),
);

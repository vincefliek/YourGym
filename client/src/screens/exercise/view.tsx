import React from 'react';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
} from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import BackIcon from '../../assets/backArrow.svg';
import ArrowLeft from '../../assets/arrowLeft.svg';
import ArrowRight from '../../assets/arrowRight.svg';
import DoneIcon from '../../assets/done.svg';

import style from './style.module.scss';
import { Controller } from '../../utils/HOCs/types';

interface Set {
  id: string;
  repetitions: number;
  weight: number;
  time?: string;
}

interface SetsByDate {
  date: string;
  sets: Set[];
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  setsHistory: SetsByDate[];
}

interface Training {
  id: string;
  exercises: Exercise[];
}

interface Props {
  training: Training;
  exercise: Exercise;
  getCurrentExercise: (training: Training, exercise: Exercise) => number;
  getTotalExercises: (training: Training) => number;
  onChangeRepetitions: (exerciseId: string, setId: string, value: number) => void;
  onChangeWeight: (exerciseId: string, setId: string, value: number) => void;
  onDoneSet: (trainingId: string, exerciseId: string, set: Set) => void;
  onExerciseNext: (training: Training, exercise: Exercise) => void;
  onExercisePrev: (training: Training, exercise: Exercise) => void;
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
        <div className={style.switch}>
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
                      onChangeRepetitions(exercise.id, set.id, Number(value))
                    }
                  />
                </div>
                <div>X</div>
                <div className={style.setWeight}>
                  <Input
                    type="number"
                    value={set.weight}
                    onBlur={value => onChangeWeight(exercise.id, set.id, Number(value))}
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

// TODO - add types for controller
export const Exercise = connect<any, Props>({
  controller,
}, ctrl => ({
  training: ctrl.getTraining(),
  exercise: ctrl.getExercise(),
  getCurrentExercise: ctrl.getCurrentExerciseIntoNavbar,
  getTotalExercises: ctrl.getTotalExercisesIntoNavbar,
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onChangeWeight: ctrl.onChangeWeight,
  onDoneSet: ctrl.onDoneSet,
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

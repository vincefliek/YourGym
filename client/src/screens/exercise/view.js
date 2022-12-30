import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import classnames from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

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

import 'swiper/scss';
import 'swiper/scss/pagination';
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
      onBack,
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
            className='swiperButtonPrev'
          >
            <ArrowLeft />
          </Button>
          <div className={classnames(
            'swiperPaginationFraction',
            style.swiperPaginationFraction,
          )}></div>
          <Button
            skin="icon"
            size="large"
            className='swiperButtonNext'
          >
            <ArrowRight />
          </Button>
        </div>
      </NavbarContainer>
    );
  };

  renderSets = (exercise) => {
    const {
      training,
      onDoneSet,
      onChangeRepetitions,
      onChangeWeight,
    } = this.props;
    return (
      <TransitionGroup component={'ul'} className={style.sets}>
        {exercise.sets.map((set) => {
          return (
            <CSSTransition
              key={set.id}
              timeout={250}
              classNames={{
                exit: style.setExit,
                exitActive: style.setActiveExit,
              }}
            >
              <li className={style.set}>
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
                      onBlur={
                        value => onChangeWeight(exercise.id, set.id, value)
                      }
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
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  renderSetsHistory = (exercise) => {
    return (
      <div className={style.history}>
        <div className={style.historyUnit}>
          History
        </div>
        <ul className={style.setsHistoryBox}>
          {exercise.setsHistory.map(setsByDate => {
            return (
              <li
                key={setsByDate.id}
                className={style.setsByDate}
              >
                <div className={style.setsDate}>
                  <b>
                    {setsByDate.date}
                  </b>
                </div>

                <TransitionGroup component={'ul'} className={style.sets}>
                  {setsByDate.sets.map((set, index) => {
                    return (
                      <CSSTransition
                        key={set.id}
                        timeout={250}
                        classNames={{
                          enter: style.setEnter,
                          enterActive: style.setActiveEnter,
                        }}
                      >
                        <li
                          className={style.setHistory}
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
                      </CSSTransition>
                    );
                  })}
                </TransitionGroup>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  render() {
    const { training, exercise, getCurrentExercise } = this.props;
    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={style.screen}>
          <Swiper
            pagination={{
              el: '.swiperPaginationFraction',
              type: 'fraction',
            }}
            navigation={{
              prevEl: '.swiperButtonPrev',
              nextEl: '.swiperButtonNext',
            }}
            modules={[Pagination, Navigation]}
            initialSlide={getCurrentExercise(training, exercise) - 1}
            className={style.swiper}
          >
            {training.exercises.map(ex => {
              const areSets = Boolean(ex.sets.length);
              const areSetsHistory = Boolean(ex.setsHistory.length);

              return (
                <SwiperSlide
                  key={ex.id}
                  className={style.swiperSlide}
                >
                  {areSets && this.renderSets(ex)}
                  {areSetsHistory && this.renderSetsHistory(ex)}
                </SwiperSlide>
              );
            })}
          </Swiper>
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
  getCurrentExercise: ctrl.getCurrentExerciseIntoNavbar,
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onChangeWeight: ctrl.onChangeWeight,
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

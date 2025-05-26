import React from 'react';
import classnames from 'classnames';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
} from '../../components';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { ExerciseProps, ExerciseState } from './types';

import style from './style.module.scss';

export class Exercise extends React.Component<ExerciseProps, ExerciseState> {
  renderTopBar = () => {
    const { data, onChangeName } = this.props;
    return (
      <div className={style.topBar}>
        <Input
          type="text"
          value={data.name}
          onBlur={onChangeName}
          onChange={() => {}}
          className={style.input}
        />
      </div>
    );
  };

  renderBottomBar = () => {
    const { onDelete, onSave } = this.props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onDelete}
        >
          <DeleteIcon />
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onSave}
        >
          <DoneIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderSets = () => {
    const {
      data,
      onDeleteSet,
      onChangeRepetitions,
      onChangeWeight,
    } = this.props;
    return (
      <TransitionGroup component={'ul'} className={style.sets}>
        {data.sets.map((set, index) => {
          return (
            <CSSTransition
              key={set.id}
              timeout={250}
              classNames={{
                enter: style.setEnter,
                enterActive: style.setActiveEnter,
                exit: style.setExit,
                exitActive: style.setActiveExit,
              }}
            >
              <li className={style.set}>
                <Button
                  skin="icon"
                  size="medium"
                  className={style.setDelete}
                  onClick={() => onDeleteSet(set.id)}
                >
                  <DeleteIcon />
                </Button>
                <div className={style.setName}>
                  Set {index + 1}
                </div>
                <div className={style.setRepetitions}>
                  <Input
                    type="number"
                    value={set.repetitions}
                    onBlur={(value) => onChangeRepetitions(set.id, value)}
                    onChange={() => {}}
                    className={style.input}
                  />
                </div>
                <div>X</div>
                <div className={style.setWeight}>
                  <Input
                    type="number"
                    value={set.weight}
                    onBlur={(value) => onChangeWeight(set.id, value)}
                    onChange={() => {}}
                    className={style.input}
                  />
                </div>
                <div className={style.weightUnit}>
                  kg
                </div>
              </li>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  render() {
    const { data, onAddSet } = this.props;

    const areSets = Boolean(data.sets.length);

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div className={classnames(style.screen, {
          [style.screenNoData]: !areSets,
        })}>
          {this.renderSets()}
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
            onClick={onAddSet}
          >
              Add set
          </Button>
        </div>
      </Layout>
    );
  }
}

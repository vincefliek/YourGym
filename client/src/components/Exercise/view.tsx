import React from 'react';
import classnames from 'classnames';

import { Button, Input, Layout, NavbarContainer } from '../../components';
import DoneIcon from '../../assets/done.svg?react';
import DeleteIcon from '../../assets/delete.svg?react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
          className={style.input}
          data-testid="exercise-name-input"
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
          data-testid="exercise-delete-button"
        >
          <DeleteIcon />
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onSave}
          data-testid="exercise-save-button"
        >
          <DoneIcon />
        </Button>
      </NavbarContainer>
    );
  };

  renderSets = () => {
    const { data, onDeleteSet, onChangeRepetitions, onChangeWeight } =
      this.props;
    return (
      <TransitionGroup
        component={'ul'}
        className={style.sets}
        data-testid="sets-list"
      >
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
              <li className={style.set} data-testid="set-item">
                <Button
                  skin="icon"
                  size="medium"
                  className={style.setDelete}
                  onClick={() => onDeleteSet(set.id)}
                  data-testid="delete-set-button"
                >
                  <DeleteIcon />
                </Button>
                <div className={style.setName}>Set {index + 1}</div>
                <div className={style.setRepetitions}>
                  <Input
                    type="number"
                    value={set.repetitions}
                    onBlur={(value) => onChangeRepetitions(set.id, value)}
                    onChange={() => {}}
                    className={style.input}
                    data-testid="set-repetitions-input"
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
                    data-testid="set-weight-input"
                  />
                </div>
                <div className={style.weightUnit}>kg</div>
              </li>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  render() {
    const { data, onAddSet, dataTestId } = this.props;

    const areSets = Boolean(data.sets.length);

    return (
      <Layout
        dataTestId={dataTestId}
        topBar={this.renderTopBar()}
        bottomBar={this.renderBottomBar()}
      >
        <div
          className={classnames(style.screen, {
            [style.screenNoData]: !areSets,
          })}
        >
          {this.renderSets()}
          <Button
            skin="primary"
            font="nunito"
            className={style.button}
            onClick={onAddSet}
            data-testid="add-set-button"
          >
            Add set
          </Button>
        </div>
      </Layout>
    );
  }
}

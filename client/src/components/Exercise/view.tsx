import React from 'react';
import classnames from 'classnames';
import { Modal, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import sortBy from 'lodash/sortBy';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
  Autocomplete,
} from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';
import DoneIcon from '../../assets/done.svg?react';
import DeleteIcon from '../../assets/delete.svg?react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  ExerciseProps,
  ExerciseStateProps,
  ExerciseOwnProps,
  Controller,
} from './types';

import style from './style.module.scss';
import { ExerciseType } from '../../model/types';

const exerciseGroups: ExerciseType['group'][] = sortBy([
  'compound',
  'miscellaneous',
  'chest',
  'legs',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'abs',
]);

const PureExercise: React.FC<ExerciseProps> = (props) => {
  const [opened, modalHandlers] = useDisclosure(false);
  const [createdOptionLabel, setCreatedOptionLabel] = React.useState<
    string | null
  >(null);
  const [createdOptionGroup, setCreatedOptionGroup] = React.useState<
    string | null
  >(null);

  const {
    data,
    dataTestId,
    exerciseTypes,
    disabledDelete,
    disabledSave,
    onAddSet,
    onChangeName,
    onCreateNewType,
    getSelectedTypeLabel,
    onDelete,
    onSave,
    onDeleteSet,
    onChangeRepetitions,
    onChangeWeight,
    isSaveDisabledDefault,
  } = props;

  const startCreatingOption = (label: string) => {
    setCreatedOptionLabel(label);
    setCreatedOptionGroup(null);
    modalHandlers.open();
  };

  const finishCreatingOption = () => {
    if (createdOptionLabel && createdOptionGroup) {
      onCreateNewType(createdOptionLabel, createdOptionGroup);
      onChangeName(createdOptionLabel);
    }
    modalHandlers.close();
    setCreatedOptionGroup(null);
    setCreatedOptionLabel(null);
  };

  const renderTopBar = () => {
    return (
      <div className={style.topBar}>
        <Autocomplete
          initialValue={data.name}
          options={exerciseTypes}
          className={style.input}
          onSelectOption={(value) => {
            const selectedLabel = getSelectedTypeLabel(value);
            if (selectedLabel) {
              onChangeName(selectedLabel);
            }
          }}
          onCreateOption={(label) => {
            startCreatingOption(label);
          }}
          onClearSelection={() => {
            onChangeName('');
          }}
        />
      </div>
    );
  };

  const renderBottomBar = () => {
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button
          skin="icon"
          size="large"
          onClick={onDelete}
          data-testid="exercise-delete-button"
          disabled={disabledDelete}
        >
          <DeleteIcon />
        </Button>
        <Button
          skin="icon"
          size="large"
          onClick={onSave}
          data-testid="exercise-save-button"
          disabled={disabledSave ?? isSaveDisabledDefault(data)}
        >
          <DoneIcon />
        </Button>
      </NavbarContainer>
    );
  };

  const renderSets = () => {
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

  const areSets = Boolean(data.sets.length);

  return (
    <Layout
      dataTestId={dataTestId}
      topBar={renderTopBar()}
      bottomBar={renderBottomBar()}
    >
      <div
        className={classnames(style.screen, {
          [style.screenNoData]: !areSets,
        })}
      >
        {renderSets()}
        <Button
          skin="primary"
          font="nunito"
          className={style.button}
          onClick={onAddSet}
          data-testid="add-set-button"
        >
          Add set
        </Button>
        <Modal
          opened={opened}
          onClose={modalHandlers.close}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <Select
            label="Choose group for new exercise type"
            placeholder="Pick value"
            data={exerciseGroups}
            onChange={setCreatedOptionGroup}
          />
          <Button
            skin="icon"
            size="large"
            onClick={finishCreatingOption}
            data-testid="finish-create-exercise-type-button"
            disabled={!createdOptionGroup}
          >
            <DoneIcon />
          </Button>
        </Modal>
      </div>
    </Layout>
  );
};

export const Exercise = connect<
  Controller,
  ExerciseStateProps,
  ExerciseOwnProps
>(
  {
    controller,
  },
  (ctrl) => ({
    exerciseTypes: ctrl.getExerciseTypes(),
    onCreateNewType: ctrl.onCreateNewType,
    getSelectedTypeLabel: ctrl.getSelectedTypeLabel,
    isSaveDisabledDefault: ctrl.isSaveDisabledDefault,
  }),
)(PureExercise);

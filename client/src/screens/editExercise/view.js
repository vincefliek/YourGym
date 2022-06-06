import React from 'react';
import classnames from 'classnames';

import {
  Button,
  Input,
  Layout,
  NavbarContainer,
} from '../../components';
import { connect, requireData } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DoneIcon } from '../../assets/done.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import style from './style.module.scss';

class PureEditExercise extends React.Component {
  renderTopBar = () => {
    const { data, onChangeName } = this.props;
    return (
      <div className={style.topBar}>
        <Input
          type="text"
          value={data.name}
          onBlur={onChangeName}
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
      <ul className={style.sets}>
        {data.sets.map((set, index) => {
          return (
            <li
              key={set.id}
              className={style.set}
            >
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
                  onBlur={value => onChangeRepetitions(set.id, value)}
                />
              </div>
              <div>X</div>
              <div className={style.setWeight}>
                <Input
                  type="number"
                  value={set.weight}
                  onBlur={value => onChangeWeight(set.id, value)}
                />
              </div>
              <div className={style.weightUnit}>
                kg
              </div>
            </li>
          );
        })}
      </ul>
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

export const EditExercise = connect({
  controller,
}, ctrl => ({
  data: ctrl.getExercise(),
  onNoData: ctrl.onNoData,
  onChangeName: ctrl.onChangeName,
  onChangeWeight: ctrl.onChangeWeight,
  onChangeRepetitions: ctrl.onChangeRepetitions,
  onAddSet: ctrl.onAddSet,
  onDeleteSet: ctrl.onDeleteSet,
  onDelete: ctrl.onDelete,
  onSave: ctrl.onSave,
}))(
  requireData(props => ({
    isData: Boolean(props.data),
    onNoData: props.onNoData,
  }))(
    PureEditExercise,
  ),
);

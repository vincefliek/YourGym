import React from 'react';

import { Button, Layout, Navbar, NavbarContainer } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as AddIcon } from '../../assets/add.svg';

import style from './style.module.scss';

class PureTrainings extends React.Component {
  renderAddFirstTraining = () => {
    const { onAdd } = this.props;
    return (
      <Button
        skin="primary"
        font="nunito"
        className={style.addNew}
        onClick={onAdd}
      >
        Add your 1st training
      </Button>
    );
  };

  renderTrainings = () => {
    const { data, onDelete, onOpen } = this.props;
    return (
      <div>
        <ul className={style.trainings}>
          {data.map(training => {
            return (
              <li
                key={training.id}
                className={style.training}
              >
                <Button
                  skin="icon"
                  size="large"
                  className={style.trainingDelete}
                  onClick={() => onDelete(training.id)}
                >
                  <DeleteIcon />
                </Button>
                <div onClick={onOpen}>

                  {training.name}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  renderTopBar = () => {
    const { onAdd } = this.props;
    return (
      <NavbarContainer>
        <Button
          skin="icon"
          size="large"
          onClick={onAdd}
        >
          <AddIcon />
        </Button>
      </NavbarContainer>
    );
  };

  render() {
    const { data } = this.props;

    const isData = data.length;

    if (!isData) {
      return (
        <Layout
          bottomBar={<Navbar />}
        >
          <div className={style.screen}>
            {this.renderAddFirstTraining()}
          </div>
        </Layout>
      );
    }

    return (
      <Layout
        topBar={this.renderTopBar()}
        bottomBar={<Navbar />}
      >
        <div className={style.screen}>
          {this.renderTrainings()}
        </div>
      </Layout>
    );
  }
}

export const Trainings = connect({
  controller,
}, ctrl => ({
  data: ctrl.getTrainings(),
  onAdd: ctrl.onAddTraining,
  onDelete: ctrl.onDeleteTraining,
  onOpen: ctrl.onOpenTraining,
}))(PureTrainings);

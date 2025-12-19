import React from 'react';

import { Button, Layout, Navbar, NavbarContainer } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';
import { Training } from '../../model/types';
import DeleteIcon from '../../assets/delete.svg?react';
import AddIcon from '../../assets/add.svg?react';

import style from './style.module.scss';

interface Props {
  data: Training[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

type Controller = ReturnType<typeof controller>;

const PureTrainings: React.FC<Props> = (props) => {
  const { data } = props;

  const isData = data.length;

  const renderAddFirstTraining = () => {
    const { onAdd } = props;
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

  const renderTrainings = () => {
    const { data, onDelete, onOpen } = props;
    return (
      <ul className={style.trainings}>
        {data.map((training) => {
          return (
            <li key={training.id} className={style.training}>
              <Button
                skin="icon"
                size="medium"
                className={style.trainingDelete}
                onClick={() => onDelete(training.id)}
              >
                <DeleteIcon />
              </Button>
              <div
                className={style.trainingBox}
                onClick={() => onOpen(training.id)}
              >
                {training.name}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderTopBar = () => {
    const { onAdd } = props;
    return (
      <NavbarContainer className={style.navbarContainer}>
        <Button skin="icon" size="large" onClick={onAdd}>
          <AddIcon />
        </Button>
      </NavbarContainer>
    );
  };

  if (!isData) {
    return (
      <Layout bottomBar={<Navbar />}>
        <div className={style.screenAddNew}>{renderAddFirstTraining()}</div>
      </Layout>
    );
  }

  return (
    <Layout topBar={renderTopBar()} bottomBar={<Navbar />}>
      <div className={style.screen}>{renderTrainings()}</div>
    </Layout>
  );
};

export const Trainings = connect<Controller, Props>(
  {
    controller,
  },
  (ctrl) => ({
    data: ctrl.getTrainings(),
    onAdd: ctrl.onAddTraining,
    onDelete: ctrl.onDeleteTraining,
    onOpen: ctrl.onOpenTraining,
  }),
)(PureTrainings);

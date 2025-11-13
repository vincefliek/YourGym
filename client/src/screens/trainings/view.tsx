import React, { useEffect, useState } from 'react';

import { Button, Layout, Navbar, NavbarContainer } from '../../components';
import { connect } from '../../utils';
import { controller } from './controller';
import { Training } from '../../model/types';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as AddIcon } from '../../assets/add.svg';

import style from './style.module.scss';

interface Props {
  data: Training[];
  onAdd: () => void; 
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  getTemplateTrainings: () => Promise<any[]>;
}

type Controller = ReturnType<typeof controller>;

const PureTrainings: React.FC<Props> = (props) => {
  const {
    data,
    getTemplateTrainings,
  } = props;

  const [templateTrainings, seTemplateTrainings] = useState<any[]>([]);

  const isData = data.length;

  useEffect(() => {
    getTemplateTrainings()
      .then(data => {
        seTemplateTrainings(data);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {data.map(training => {
          return (
            <li
              key={training.id}
              className={style.training}
            >
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
                onClick={ () => onOpen(training.id) }
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

  if (!isData) {
    return (
      <Layout
        bottomBar={<Navbar />}
      >
        {templateTrainings.map(it => (
          <div key={it.id}>
            <h3>{it.name}</h3>
            <div>Exercices:</div>
            <ul style={{ margin: 0 }}>
              {it.exercises.map((ex: any) => (
                <li key={ex.id}>
                  {ex.type} - {ex.reps} - {ex.weight}
                </li>
              ))}
            </ul>
            ________________________
          </div>
        ))}
        <div className={style.screenAddNew}>
          {renderAddFirstTraining()}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      topBar={renderTopBar()}
      bottomBar={<Navbar />}
    >
      <div className={style.screen}>
        {renderTrainings()}
      </div>
    </Layout>
  );
};

export const Trainings = connect<Controller, Props>({
  controller,
}, ctrl => ({
  data: ctrl.getTrainings(),
  getTemplateTrainings: ctrl.getTemplateTrainings,
  onAdd: ctrl.onAddTraining,
  onDelete: ctrl.onDeleteTraining,
  onOpen: ctrl.onOpenTraining,
}))(PureTrainings);

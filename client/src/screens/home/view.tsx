import React from 'react';
import { Button, Layout, Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';
import { HomeProps, HomeController } from './types';
import DeleteIcon from '../../assets/delete.svg?react';
import style from './style.module.scss';
import classNames from 'classnames';

interface AuthFormData {
  email: string;
  password: string;
}

interface AuthFormProps {
  title: string;
  onSubmit: (data: AuthFormData) => void;
}

const AuthForm = ({ title, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={_onSubmit} className={style.authForm}>
      <h3 className={style.authFormHeader}>{title}</h3>
      <div className={style.authField}>
        <label className={style.authLabel} htmlFor="email">
          Email:
        </label>
        <input
          className={style.authInput}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={style.authField}>
        <label className={style.authLabel} htmlFor="password">
          Password:
        </label>
        <input
          className={style.authInput}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={style.authActions}>
        <Button
          type="submit"
          className={style.authSubmit}
          skin="primary"
          size="medium"
          data-testid="auth-submit-button"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

const PureHome: React.FC<HomeProps> = (props) => {
  const {
    isAuthenticated,
    signin,
    signup,
    onDeleteCompletedTraining,
    createSetsPreview,
  } = props;

  const [expandedTrainingId, setExpandedTrainingId] = React.useState<
    string | null
  >(null);

  const toggleExpanded = (id: string) => {
    setExpandedTrainingId((prev) => (prev === id ? null : id));
  };

  const [isLoginForm, setIsLoginForm] = React.useState(true);

  const renderTrainings = () => {
    const { completedTrainings, getDateAndTime } = props;
    return (
      <>
        <h3 style={{ textAlign: 'center' }}>Recent Trainings</h3>
        <ul className={style.trainings} data-testid="completed-trainings-list">
          {completedTrainings.map((training) => {
            const isExpanded = expandedTrainingId === training.id;
            return (
              <li
                key={training.id}
                className={style.training}
                data-testid="completed-training-item"
              >
                <div className={style.trainingDate}>
                  {getDateAndTime(training.timestamptz).date}
                </div>
                <div className={style.trainingBoxWrapper}>
                  <Button
                    skin="icon"
                    size="medium"
                    className={style.trainingDelete}
                    onClick={() => onDeleteCompletedTraining(training.id)}
                    data-testid="delete-completed-training-button"
                  >
                    <DeleteIcon />
                  </Button>
                  <div className={style.trainingBox}>
                    <div
                      className={style.trainingBoxHeader}
                      aria-expanded={isExpanded}
                    >
                      <div
                        className={classNames({
                          [style.trainingName]: isExpanded,
                        })}
                      >
                        {training.name}
                      </div>
                      <Button
                        className={style.expandIndicator}
                        skin="text"
                        size="medium"
                        onClick={() => toggleExpanded(training.id)}
                        aria-expanded={isExpanded}
                        data-testid="toggle-completed-training-details-button"
                      >
                        {isExpanded ? '📖' : '📗'}
                      </Button>
                    </div>
                    <div
                      className={classNames(style.exerciseList, {
                        [style.expanded]: isExpanded,
                        [style.collapsed]: !isExpanded,
                      })}
                    >
                      {training.exercises.map((ex) => {
                        return (
                          <div key={ex.id} className={style.exerciseRow}>
                            <div className={style.exerciseName}>{ex.name}</div>
                            <div className={style.exerciseSets}>
                              {createSetsPreview(ex.sets)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <Layout bottomBar={<Navbar />} dataTestId="home-screen">
      <div className={style.screen}>
        {!isAuthenticated && (
          <>
            {isLoginForm ? (
              <AuthForm
                title="Sign In"
                onSubmit={({ email, password }) => signin(email, password)}
              />
            ) : (
              <AuthForm
                title="Sign Up"
                onSubmit={({ email, password }) => signup(email, password)}
              />
            )}
            <Button
              className={style.authToggleButton}
              skin="text"
              size="medium"
              onClick={() => setIsLoginForm((state) => !state)}
              data-testid="toggle-form-type-button"
            >
              {isLoginForm ? 'Go to Sign Up' : 'Go to Sign In'}
            </Button>
          </>
        )}
        {isAuthenticated && renderTrainings()}
      </div>
    </Layout>
  );
};

export const Home = connect<HomeController, HomeProps>(
  {
    controller,
  },
  (ctrl) => ({
    isAuthenticated: ctrl.isAuthenticated(),
    completedTrainings: ctrl.getCompletedTrainings(),
    onDeleteCompletedTraining: ctrl.onDeleteCompletedTraining,
    signin: ctrl.signin,
    signup: ctrl.signup,
    getDateAndTime: ctrl.getDateAndTime,
    createSetsPreview: ctrl.createSetsPreview,
  }),
)(PureHome);

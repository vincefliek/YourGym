import React from 'react';
import { Button, Layout, Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';
import { HomeProps, HomeController } from './types';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
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
    <form onSubmit={_onSubmit}>
      <h3>{title}</h3>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const PureHome: React.FC<HomeProps> = (props) => {
  const {
    isAuthenticated,
    signin,
    signup,
    signout,
    onDeleteCompletedTraining,
    createSetsPreview,
  } = props;

  const [expandedTrainingId, setExpandedTrainingId] = React.useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedTrainingId(prev => (prev === id ? null : id));
  };

  const [isLoginForm, setIsLoginForm] = React.useState(true);

  const renderTrainings = () => {
    const { completedTrainings, getDateAndTime } = props;
    return (
      <>
        <h3 style={{ textAlign: 'center' }}>
          Recent Trainings
        </h3>
        <ul className={style.trainings}>
          {completedTrainings.map(training => {
            const isExpanded = expandedTrainingId === training.id;
            return (
              <li
                key={training.id}
                className={style.training}
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
                  >
                    <DeleteIcon />
                  </Button>
                  <div className={style.trainingBox}>
                    <Button
                      className={style.trainingBoxHeader}
                      skin="text"
                      size="medium"
                      onClick={() => toggleExpanded(training.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className={classNames({
                        [style.trainingName]: isExpanded,
                      })}>{training.name}</div>
                      <div className={style.expandIndicator} aria-hidden>
                        {isExpanded ? '📖' : '📗'}
                      </div>
                    </Button>
                    <div className={classNames(style.exerciseList, {
                      [style.expanded]: isExpanded,
                      [style.collapsed]: !isExpanded,
                    })}>
                      {training.exercises.map(ex => {
                        const setsPreview = ex.sets
                          .map(s => {
                            const weightPart = typeof s.weight === 'number' && s.weight > 0 ? `@${s.weight}kg` : '';
                            return `${s.repetitions}${weightPart}`;
                          })
                          .join(', ');

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
    <Layout bottomBar={<Navbar />}>
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
            <div>
              <button onClick={() => setIsLoginForm(state => !state)}>
                {isLoginForm ? 'Go to Sign Up' : 'Go to Sign In'}
              </button>
            </div>
          </>
        )}
        {isAuthenticated && (
          <>
            <div style={{
              color: 'green',
              marginTop: '20px',
              border: '1px solid green',
              padding: '10px',
              textAlign: 'center',
            }}>
              You are logged in!
            </div>
            <div style={{
              marginTop: '20px',
              textAlign: 'center',
            }}>
              <button onClick={() => signout()}>
                Sign out
              </button>
            </div>
          </>
        )}
        {isAuthenticated && renderTrainings()}
      </div>
    </Layout>
  );
};

export const Home = connect<HomeController, HomeProps>({
  controller,
}, ctrl => ({
  isAuthenticated: ctrl.isAuthenticated(),
  completedTrainings: ctrl.getCompletedTrainings(),
  onDeleteCompletedTraining: ctrl.onDeleteCompletedTraining,
  signin: ctrl.signin,
  signup: ctrl.signup,
  signout: ctrl.signout,
  getDateAndTime: ctrl.getDateAndTime,
  createSetsPreview: ctrl.createSetsPreview,
}))(PureHome);

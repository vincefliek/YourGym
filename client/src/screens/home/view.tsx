import React from 'react';
import { Layout, Navbar } from '../../components';

import { connect } from '../../utils';
import { controller } from './controller';
import { HomeProps, HomeController } from './types';

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
  const { isAuthenticated, signin, signup, signout } = props;

  const [isLoginForm, setIsLoginForm] = React.useState(true);

  return (
    <Layout bottomBar={<Navbar />}>
      <div style={{ textAlign: 'center' }}>
        Home
      </div>
      <div style={{ textAlign: 'center' }}>
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
      </div>
    </Layout>
  );
};

export const Home = connect<HomeController, HomeProps>({
  controller,
}, ctrl => ({
  isAuthenticated: ctrl.isAuthenticated(),
  signin: ctrl.signin,
  signup: ctrl.signup,
  signout: ctrl.signout,
}))(PureHome);

import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEventBuilder from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';

import { App } from './App';
import { initApp } from '../../model';
import { apiMocks } from '../../setupTests';

describe('App', () => {
  const renderApp = async () => {
    const { apis, appContext } = await initApp();

    await apis.authApi.signin('test@gmail.com', 'testpassword');

    const app = render(
      <HashRouter>
        <App apis={apis} appContext={appContext} />
      </HashRouter>,
    );

    return app;
  };

  afterEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('renders home initially - user is logged in', async () => {
    await renderApp();

    const homeBtn = await screen.findByText(/Home/i, {
      selector: 'button',
    });
    const trainingsBtn = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();
  });

  test('renders home initially - user is NOT logged in', async () => {
    const { status, body } = apiMocks.unauthorized({
      reason: 'ERROR: no token',
    });
    apiMocks.when('/api/session', 'GET').reply(status, body);

    await renderApp();

    const homeBtn = await screen.findByText(/Home/i, {
      selector: 'button',
    });
    const trainingsBtn = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();
  });

  test('navigates to trainings screen', async () => {
    await renderApp();

    const userEvent = userEventBuilder.setup();

    const homeBtn = await screen.findByText(/Home/i, {
      selector: 'button',
    });
    const trainingsBtnBefore = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    expect(homeBtn.classList.contains('active')).toBeTruthy();
    expect(trainingsBtnBefore.classList.contains('active')).toBeFalsy();

    await act(() => userEvent.click(trainingsBtnBefore));

    const trainingsBtnAfter = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    expect(trainingsBtnAfter.classList.contains('active')).toBeTruthy();
  });
});

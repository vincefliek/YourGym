import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    // logDOM();

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();

    // TODO: check how to wait for all async tasks to finish

    /*
    import { waitFor } from '@testing-library/react';

    // Even if the write is fire-and-forget, it likely changes something in the UI eventually
    await waitFor(() => {
      expect(screen.getByText('Data Saved')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    */
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

    // logDOM();

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();
  });

  test('navigates to trainings screen', async () => {
    await renderApp();

    const homeBtn = await screen.findByText(/Home/i, {
      selector: 'button',
    });
    const trainingsBtnBefore = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    // logDOM();

    expect(homeBtn.classList.contains('active')).toBeTruthy();
    expect(trainingsBtnBefore.classList.contains('active')).toBeFalsy();

    act(() => {
      userEvent.click(trainingsBtnBefore);
    });

    // logDOM();

    const trainingsBtnAfter = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    expect(trainingsBtnAfter.classList.contains('active')).toBeTruthy();
  });
});

import {
  render,
  screen,
  // waitForElementToBeRemoved,
} from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { initApp } from '../../model';

describe('App', () => {
  beforeEach(async () => {
    const { apis, appContext } = await initApp();
    render(
      <HashRouter>
        <App apis={apis} appContext={appContext} />
      </HashRouter>,
    );
  });

  test('renders initially', async () => {
    const homeBtn = await screen.findByText(/Home/i, {
      selector: 'button',
    });
    const trainingsBtn = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();
  });
});

import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { apiMocks } from '../../setupTests';
import { createDriver, TestDriver } from '../../test-utils';

describe('App', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('renders home initially - user is logged in', async () => {
    await driver.render.app();

    const homeBtn = await driver.waitFor.byTestId('nav-home-button');
    const trainingsBtn = await driver.waitFor.byTestId('nav-trainings-button');

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();
  });

  test('renders home initially - user is NOT logged in', async () => {
    const { status, body } = apiMocks.unauthorized({
      reason: 'ERROR: no token',
    });
    apiMocks.when('/api/session', 'GET').reply(status, body);

    await driver.render.app();

    const homeBtn = await driver.waitFor.byTestId('nav-home-button');
    const trainingsBtn = await driver.waitFor.byTestId('nav-trainings-button');

    expect(homeBtn).toBeInTheDocument();
    expect(trainingsBtn).toBeInTheDocument();
  });

  test('navigates to trainings screen', async () => {
    await driver.render.app();

    const userEvent = userEventBuilder.setup();

    const homeBtn = await driver.waitFor.byTestId('nav-home-button');
    const trainingsBtnBefore = await driver.waitFor.byTestId(
      'nav-trainings-button',
    );

    expect(homeBtn.classList.contains('active')).toBeTruthy();
    expect(trainingsBtnBefore.classList.contains('active')).toBeFalsy();

    await act(() => userEvent.click(trainingsBtnBefore));

    const trainingsBtnAfter = await driver.waitFor.byTestId(
      'nav-trainings-button',
    );

    expect(trainingsBtnAfter.classList.contains('active')).toBeTruthy();
  });
});

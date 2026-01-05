import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { TestDriver, createDriver } from '../../test-utils';

describe('navigation', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('navigates between main screens', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // start on home
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // go to Trainings screen
    const trainingsNav = await driver.waitFor.byTestId('nav-trainings-button');
    await act(() => userEvent.click(trainingsNav));

    // Trainings screen (no data) should be shown
    expect(
      await driver.waitFor.byTestId('trainings-screen-no-data'),
    ).toBeInTheDocument();

    // open Menu via burger
    const burger = await driver.waitFor.byTestId('nav-burger-button');
    await act(() => userEvent.click(burger));

    // Menu screen should be shown
    expect(await driver.waitFor.byTestId('menu-screen')).toBeInTheDocument();

    // back to Home via nav
    const homeNav = await driver.waitFor.byTestId('nav-home-button');
    await act(() => userEvent.click(homeNav));

    // Home screen should be shown
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();
  });
});

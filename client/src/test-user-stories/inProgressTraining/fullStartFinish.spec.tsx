import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { TestDriver, createDriver } from '../../test-utils';

describe('in progress training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('start template training and finish with completed training on the home screen', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // back to home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // check there are no completed trainings yet
    await expect(
      driver.waitFor.byTestId('completed-training-item'),
    ).rejects.toThrow();

    await driver.create.firstTemplateTraining();

    // open the newly created training
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // click start
    const startTrainingButton = await driver.waitFor.byTestId(
      'start-training-button',
    );
    await act(() => userEvent.click(startTrainingButton));

    // inside of create exercise screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // mark set as completed
    const completeSetBtn = await driver.waitFor.byTestId('done-set-button');
    await act(() => userEvent.click(completeSetBtn));

    // go to previous screen
    const backBtn = await driver.waitFor.byTestId('back-button');
    await act(() => userEvent.click(backBtn));

    // inside of create training screen
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    // finish training
    const finishTrainingBtn = await driver.waitFor.byTestId(
      'finish-training-button',
    );
    await act(() => userEvent.click(finishTrainingBtn));

    // back to home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // check that completed training is added
    const completedTrainingsAfter = await driver.waitFor.allByTestId(
      'completed-training-item',
    );
    expect(completedTrainingsAfter.length).toBe(1);

    // check that completed training is shown on the home screen
    expect(await driver.waitFor.byText(/New Training/i)).toBeInTheDocument();
  });
});

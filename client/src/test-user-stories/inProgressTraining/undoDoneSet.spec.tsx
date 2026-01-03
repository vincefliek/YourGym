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

  test('mark set done then undo the done action', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // inside of home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    await driver.create.firstTemplateTraining({
      exercises: [
        {
          sets: [
            { reps: 8, weight: 15 },
            { reps: 10, weight: 12 },
          ],
        },
      ],
    });

    // open the newly created training
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // click start
    const startTrainingButton = await driver.waitFor.byTestId(
      'start-training-button',
    );
    await act(() => userEvent.click(startTrainingButton));

    // inside of existing exercise screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // inside of existing exercise screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // mark both sets as completed
    const completeSetBtns = await driver.waitFor.allByTestId('done-set-button');
    await act(() => userEvent.click(completeSetBtns[0]));
    await act(() => userEvent.click(completeSetBtns[1]));

    // undo the second completed set (the last one)
    const [, undoSet2] = await driver.waitFor.allByTestId('undo-set-button');
    await act(() => userEvent.click(undoSet2));

    // go back to training screen
    const backBtn2 = await driver.waitFor.byTestId('back-button');
    await act(() => userEvent.click(backBtn2));

    // finish training
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    const finishTrainingBtn = await driver.waitFor.byTestId(
      'finish-training-button',
    );
    await act(() => userEvent.click(finishTrainingBtn));

    // inside of home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // check that completed training is added
    const completedTrainingsAfter = await driver.waitFor.allByTestId(
      'completed-training-item',
    );
    expect(completedTrainingsAfter.length).toBe(1);

    // check that completed training shows only one set saved (undo worked)
    await expect(driver.waitFor.byText(/8x15kg - 10x12kg/)).rejects.toThrow();

    expect(await driver.waitFor.byText(/8x15kg/)).toBeInTheDocument();
  });
});

import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';

import { createDriver, type TestDriver } from '../../test-utils';

describe('existing training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('exercise history from completed trainings is shown in preview exercise (not in progress)', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // create template training
    await driver.create.firstTemplateTraining({
      exercises: [
        {
          sets: [
            { reps: 8, weight: 15 },
            { reps: 9, weight: 11 },
          ],
        },
        { sets: [{ reps: 6, weight: 10 }] },
      ],
    });

    // open the newly created training and start it to produce completed history
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // start training
    const startTrainingButton = await driver.waitFor.byTestId(
      'start-training-button',
    );
    await act(() => userEvent.click(startTrainingButton));

    // inside of exercise screen (in progress)
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // mark 2nd set done
    const [, doneSecondSetBtn] =
      await driver.waitFor.allByTestId('done-set-button');
    await act(() => userEvent.click(doneSecondSetBtn));

    // go back to training screen and finish training
    const backBtn = await driver.waitFor.byTestId('back-button');
    await act(() => userEvent.click(backBtn));

    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    const finishTrainingBtn = await driver.waitFor.byTestId(
      'finish-training-button',
    );
    await act(() => userEvent.click(finishTrainingBtn));

    // inside of home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // navigate to trainings screen
    const navTrainingsBtn = await driver.waitFor.byTestId(
      'nav-trainings-button',
    );
    await act(() => userEvent.click(navTrainingsBtn));

    // inside of trainings screen
    expect(
      await driver.waitFor.byTestId('trainings-screen'),
    ).toBeInTheDocument();

    // open training in preview mode (not in progress)
    const trainingBox2 = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox2));

    // open the exercise from the preview training
    const items = await driver.waitFor.allByTestId('training-exercise-item');
    expect(items.length).toBeGreaterThan(0);

    await act(() => userEvent.click(items[0]));

    // inside of exercise preview screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // history section is present
    expect(
      await driver.waitFor.byTestId('sets-history-list'),
    ).toBeInTheDocument();

    // only 2nd set is in history
    expect(await driver.waitFor.byTestId('set-history-item')).toHaveTextContent(
      '№1 9x11kg',
    );

    // 1st set must be absent
    expect(
      await driver.waitFor.byTestId('set-history-item'),
    ).not.toHaveTextContent('8x15kg');

    // sets from 2nd exercise must be absent
    expect(
      await driver.waitFor.byTestId('set-history-item'),
    ).not.toHaveTextContent('6x10kg');
  });
});

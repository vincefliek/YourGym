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

  test('navigate between exercises during training', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // inside of home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // create a training with 3 exercises
    await driver.create.firstTemplateTraining({
      exercises: [
        { sets: [{ reps: 8, weight: 10 }] },
        { sets: [{ reps: 6, weight: 12 }] },
        { sets: [{ reps: 5, weight: 15 }] },
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

    // inside of existing exercise screen (first exercise)
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // first exercise shown
    expect(await driver.waitFor.byText(/New Exercise$/i)).toBeInTheDocument();

    // navigate to next exercise
    const nextBtn1 = await driver.waitFor.byTestId('next-exercise-button');
    await act(() => userEvent.click(nextBtn1));

    // second exercise shown
    expect(
      await driver.waitFor.byText(/Plate Loaded Lat Pulldown/i),
    ).toBeInTheDocument();

    // navigate to next exercise (third)
    const nextBtn2 = await driver.waitFor.byTestId('next-exercise-button');
    await act(() => userEvent.click(nextBtn2));

    // third exercise shown
    expect(
      await driver.waitFor.byText(/Single Arm Dumbbell Row/i),
    ).toBeInTheDocument();

    // navigate back to second
    const prevBtn1 = await driver.waitFor.byTestId('prev-exercise-button');
    await act(() => userEvent.click(prevBtn1));
    expect(
      await driver.waitFor.byText(/Plate Loaded Lat Pulldown/i),
    ).toBeInTheDocument();

    // go back to first
    const prevBtn2 = await driver.waitFor.byTestId('prev-exercise-button');
    await act(() => userEvent.click(prevBtn2));
    expect(await driver.waitFor.byText(/New Exercise$/i)).toBeInTheDocument();

    // go back to training screen
    const backBtn = await driver.waitFor.byTestId('back-button');
    await act(() => userEvent.click(backBtn));

    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();
  });
});

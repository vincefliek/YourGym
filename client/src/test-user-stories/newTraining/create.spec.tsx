import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';

import { createDriver, type TestDriver } from '../../test-utils';

describe('new training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('create a new training with one exercise and one set', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // go to trainings screen
    const trainingsNav = await driver.waitFor.byTestId('nav-trainings-button');
    await act(() => userEvent.click(trainingsNav));

    // inside of trainings screen with no data
    expect(
      await driver.waitFor.byTestId('trainings-screen-no-data'),
    ).toBeInTheDocument();

    // start creating the first training
    const addTrainingBtn = await driver.waitFor.byTestId(
      'add-first-training-button',
    );
    await act(() => userEvent.click(addTrainingBtn));

    // inside of create training screen
    expect(
      await driver.waitFor.byTestId('create-training-screen'),
    ).toBeInTheDocument();

    const nameInput = await driver.waitFor.byTestId('training-name-input');
    expect(nameInput).toBeInTheDocument();

    // change training name
    await act(() => userEvent.clear(nameInput));
    await act(() => userEvent.type(nameInput, 'Chest+Back training'));
    await act(() => nameInput.blur());

    // add an exercise
    const addExerciseBtn = await driver.waitFor.byTestId('add-exercise-button');
    await act(() => userEvent.click(addExerciseBtn));

    // inside of create exercise screen
    expect(
      await driver.waitFor.byTestId('create-exercise-screen'),
    ).toBeInTheDocument();

    // add a set
    const addSetBtn = await driver.waitFor.byTestId('add-set-button');
    await act(() => userEvent.click(addSetBtn));

    // find last set's reps input
    const repsInputs = await driver.waitFor.allByTestId(
      'set-repetitions-input',
    );
    const lastReps = repsInputs[repsInputs.length - 1];

    // typr reps
    await act(() => userEvent.clear(lastReps));
    await act(() => userEvent.type(lastReps, '10'));
    await act(() => lastReps.blur());

    // find last set's weight input
    const weightInputs = await driver.waitFor.allByTestId('set-weight-input');
    const lastWeight = weightInputs[weightInputs.length - 1];

    // type weight
    await act(() => userEvent.clear(lastWeight));
    await act(() => userEvent.type(lastWeight, '20'));
    await act(() => lastWeight.blur());

    // save exercise
    const saveExerciseBtn = await driver.waitFor.byTestId(
      'exercise-save-button',
    );
    await act(() => userEvent.click(saveExerciseBtn));

    // inside of create training screen
    expect(
      await driver.waitFor.byTestId('create-training-screen'),
    ).toBeInTheDocument();

    // save training
    const saveTrainingBtn = await driver.waitFor.byTestId(
      'training-save-button',
    );
    await act(() => userEvent.click(saveTrainingBtn));

    // inside of trainings screen
    expect(
      await driver.waitFor.byTestId('trainings-screen'),
    ).toBeInTheDocument();

    // trainings list should show the newly created training
    expect(
      await driver.waitFor.byText('Chest+Back training'),
    ).toBeInTheDocument();
  });
});

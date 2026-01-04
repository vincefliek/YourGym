import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

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

  test('add an exercise to an existing training', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    await driver.create.firstTemplateTraining();

    // open the newly created training
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // click edit the newly created training
    const editTrainingIcon = await driver.waitFor.byTestId(
      'training-edit-button',
    );
    await act(() => userEvent.click(editTrainingIcon));

    // inside of edit existing training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    const itemsBefore = await driver.waitFor.allByTestId('exercise-item');
    expect(itemsBefore.length).toBe(1);

    const addExerciseBtn = await driver.waitFor.byTestId('add-exercise-button');
    await act(() => userEvent.click(addExerciseBtn));

    // inside of create exercise screen
    expect(
      await driver.waitFor.byTestId('create-exercise-screen'),
    ).toBeInTheDocument();

    // add one set to the new exercise
    const addSetBtn = await driver.waitFor.byTestId('add-set-button');
    await act(() => userEvent.click(addSetBtn));

    // save exercise
    const saveExerciseBtn = await driver.waitFor.byTestId(
      'exercise-save-button',
    );
    await act(() => userEvent.click(saveExerciseBtn));

    // back to edit training screen and check exercise added
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    await waitFor(async () => {
      const itemsAfter = await driver.waitFor.allByTestId('exercise-item');
      expect(itemsAfter.length).toBe(2);
    });
  });
});

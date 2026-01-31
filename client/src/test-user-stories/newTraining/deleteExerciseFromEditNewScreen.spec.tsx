import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';

import { createDriver, type TestDriver } from '../../test-utils';
import { waitFor, screen } from '@testing-library/react';

describe('new training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('delete an exercise added in new-training flow and return to create training screen', async () => {
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

    // save exercise
    const saveExerciseBtn = await driver.waitFor.byTestId(
      'exercise-save-button',
    );
    await act(() => userEvent.click(saveExerciseBtn));

    // inside of create training screen
    expect(
      await driver.waitFor.byTestId('create-training-screen'),
    ).toBeInTheDocument();

    // open the saved exercise for editing
    const openButtons = await driver.waitFor.allByTestId(
      'open-exercise-button',
    );
    await act(() => userEvent.click(openButtons[0]));

    // inside of edit new exercise screen
    expect(
      await driver.waitFor.byTestId('edit-new-exercise-screen'),
    ).toBeInTheDocument();

    // delete the exercise
    const deleteExerciseBtn = await driver.waitFor.byTestId(
      'exercise-delete-button',
    );
    await act(() => userEvent.click(deleteExerciseBtn));

    // inside of create training screen
    expect(
      await driver.waitFor.byTestId('create-training-screen'),
    ).toBeInTheDocument();

    // and expect no exercises present anymore
    await waitFor(() => {
      expect(screen.queryAllByTestId('exercise-item').length).toBe(0);
    });
  });
});

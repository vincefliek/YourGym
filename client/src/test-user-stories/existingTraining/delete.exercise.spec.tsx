import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';

import { createDriver, type TestDriver } from '../../test-utils';
import { waitFor } from '@testing-library/react';

describe('existing training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('delete an exercise from an existing training', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // create a training with two exercises
    await driver.create.firstTemplateTraining({
      exercises: [
        { sets: [{ reps: 8, weight: 12 }] },
        { sets: [{ reps: 6, weight: 10 }] },
      ],
    });

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

    // ensure two exercises present
    const itemsBefore = await driver.waitFor.allByTestId('exercise-item');
    expect(itemsBefore.length).toBe(2);

    // click delete on the first exercise
    const deleteButtons = await driver.waitFor.allByTestId(
      'delete-exercise-button',
    );
    await act(() => userEvent.click(deleteButtons[0]));

    await waitFor(async () => {
      // expect one exercise remaining
      const itemsAfter = await driver.waitFor.allByTestId('exercise-item');
      expect(itemsAfter.length).toBe(1);
    });
  });
});

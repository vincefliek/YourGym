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

  test('delete a set from an existing exercise', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // create a training with a single exercise that has two sets
    await driver.create.firstTemplateTraining({
      exercises: [
        {
          sets: [
            { reps: 8, weight: 12 },
            { reps: 6, weight: 10 },
          ],
        },
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

    // open the exercise
    const exerciseBox = await driver.waitFor.byText(/New Exercise/i);
    await act(() => userEvent.click(exerciseBox));

    // inside of edit existing exercise screen
    expect(
      await driver.waitFor.byTestId('edit-existing-exercise-screen'),
    ).toBeInTheDocument();

    // ensure two sets present
    const itemsBefore = await driver.waitFor.allByTestId('set-item');
    expect(itemsBefore.length).toBe(2);

    // click delete on the first set
    const deleteButtons = await driver.waitFor.allByTestId('delete-set-button');
    await act(() => userEvent.click(deleteButtons[0]));

    await waitFor(async () => {
      const itemsAfter = await driver.waitFor.allByTestId('set-item');
      expect(itemsAfter.length).toBe(1);
      expect(itemsAfter[0]).toHaveTextContent('Set 1');
    });
  });
});

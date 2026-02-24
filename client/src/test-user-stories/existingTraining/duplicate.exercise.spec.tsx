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

  test('duplicate an exercise from existing training', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // create a training with exercises
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

    // inside of edit-existing-training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    // verify exercises present
    const exerciseItemsBefore =
      await driver.waitFor.allByTestId('exercise-item');
    expect(exerciseItemsBefore.length).toBe(2);

    // click context menu button on the first exercise
    const [contextMenuButton] = await driver.waitFor.allByTestId(
      'context-menu-trigger',
    );
    await act(() => userEvent.click(contextMenuButton));

    // find and click the "Duplicate" menu item
    const duplicateMenuItem = await driver.waitFor.byTestId(
      'duplicate-exercise-button',
    );
    await act(() => userEvent.click(duplicateMenuItem));

    // wait for the duplicate to appear in the list
    await waitFor(async () => {
      const exerciseItemsAfter =
        await driver.waitFor.allByTestId('exercise-item');
      expect(exerciseItemsAfter.length).toBe(3);
    });

    // verify the diplicate has the same name as the original exercise
    await waitFor(async () => {
      const exerciseNames = await driver.waitFor.allByTestId('exercise-name');
      expect(exerciseNames[0].textContent).toBe(exerciseNames[2].textContent);
    });
  });
});

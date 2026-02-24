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

  test('duplicate an existing training', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // create a training with exercises
    await driver.create.firstTemplateTraining({
      exercises: [
        { sets: [{ reps: 8, weight: 12 }] },
        { sets: [{ reps: 6, weight: 10 }] },
      ],
    });

    // inside of trainings screen
    expect(
      await driver.waitFor.byTestId('trainings-screen'),
    ).toBeInTheDocument();

    // find and verify the original training exists
    const originalTraining = await driver.waitFor.byText(/New Training/i);
    expect(originalTraining).toBeInTheDocument();

    // get the context menu button for the training
    const contextMenuButton = await driver.waitFor.byTestId(
      'context-menu-trigger',
    );
    expect(contextMenuButton).toBeInTheDocument();

    // click the context menu button to open the menu
    await act(() => userEvent.click(contextMenuButton));

    // find and click the "Duplicate" menu item
    const duplicateMenuItem = await driver.waitFor.byText('Duplicate');
    await act(() => userEvent.click(duplicateMenuItem));

    // wait for the duplicate to appear in the list
    await waitFor(async () => {
      const trainingItemsAfter =
        await driver.waitFor.allByTestId('training-item');
      expect(trainingItemsAfter.length).toBe(2);
    });

    // verify the duplicate has the "Copy - " prefix
    const copyTraining = await driver.waitFor.byText(/Copy - New Training/i);
    expect(copyTraining).toBeInTheDocument();
  });

  test('duplicate training multiple times increments counter', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // create a training
    await driver.create.firstTemplateTraining({
      exercises: [{ sets: [{ reps: 8, weight: 12 }] }],
    });

    // inside of trainings screen
    expect(
      await driver.waitFor.byTestId('trainings-screen'),
    ).toBeInTheDocument();

    // duplicate the training first time
    let contextMenuButton = await driver.waitFor.byTestId(
      'context-menu-trigger',
    );
    await act(() => userEvent.click(contextMenuButton));
    let duplicateMenuItem = await driver.waitFor.byText('Duplicate');
    await act(() => userEvent.click(duplicateMenuItem));

    // wait for first duplicate
    await waitFor(async () => {
      const items = await driver.waitFor.allByTestId('training-item');
      expect(items.length).toBe(2);
    });

    // verify first duplicate exists with "Copy - " prefix
    let copyTraining = await driver.waitFor.byText(/Copy - New Training/i);
    expect(copyTraining).toBeInTheDocument();

    // duplicate the training second time
    await waitFor(async () => {
      const contextMenuButtons = await driver.waitFor.allByTestId(
        'context-menu-trigger',
      );
      contextMenuButton = contextMenuButtons[0];
    });
    await act(() => userEvent.click(contextMenuButton));

    // find and click the "Duplicate" menu item again
    duplicateMenuItem = await driver.waitFor.byText('Duplicate');
    await act(() => userEvent.click(duplicateMenuItem));

    // wait for second duplicate
    await waitFor(async () => {
      const items = await driver.waitFor.allByTestId('training-item');
      expect(items.length).toBe(3);
    });

    // verify second duplicate exists with counter "Copy 1 - "
    copyTraining = await driver.waitFor.byText(/Copy 1 - New Training/i);
    expect(copyTraining).toBeInTheDocument();
  });
});

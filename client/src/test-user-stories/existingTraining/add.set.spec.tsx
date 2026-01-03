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

  test('add a set to an existing exercise', async () => {
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

    // open the exercise
    const exerciseBox = await driver.waitFor.byText(/New Exercise/i);
    await act(() => userEvent.click(exerciseBox));

    // inside of edit existing exercise screen
    expect(
      await driver.waitFor.byTestId('edit-existing-exercise-screen'),
    ).toBeInTheDocument();

    const itemsBefore = await driver.waitFor.allByTestId('set-item');
    expect(itemsBefore.length).toBe(1);

    const addSetExisting = await driver.waitFor.byTestId('add-set-button');
    await act(() => userEvent.click(addSetExisting));

    const itemsAfter = await driver.waitFor.allByTestId('set-item');
    expect(itemsAfter.length).toBe(2);
  });
});

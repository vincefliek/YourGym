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

  test('exercise is displayed in preview mode when not in progress', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    await driver.create.firstTemplateTraining();

    // open the newly created training (preview mode)
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // inside of existing (preview) training screen
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    // ensure the exercise is shown with sets preview (e.g. "8x12kg")
    const items = await driver.waitFor.allByTestId('training-exercise-item');
    expect(items.length).toBe(1);
    expect(items[0]).toHaveTextContent(/New Exercise/i);
    expect(items[0]).toHaveTextContent('8x12kg');
  });
});

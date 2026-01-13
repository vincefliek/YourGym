import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { createMemoryHistory } from '@tanstack/react-router';

import { createDriver, type TestDriver } from '../../test-utils';
import { waitFor } from '@testing-library/react';

describe('navigation - back with history replace', () => {
  let driver: TestDriver;
  // let history: ReturnType<typeof createMemoryHistory>;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('navigating from edit-training -> edit-exercise and saving goes back to edit-training', async () => {
    const userEvent = userEventBuilder.setup();

    // mock router history
    jest.doMock('../../model/apis/navigationApi/getRouterParams.ts', () => ({
      history: createMemoryHistory({ initialEntries: ['/'] }),
      defaultPreload: false, // Disable preloading entirely for tests
      defaultPreloadStaleTime: 0,
      defaultPendingMinMs: 0,
    }));

    const { apis, getRouteNavPath } = await driver.render.app();

    await driver.create.firstTemplateTraining();

    // open the newly created training (preview mode)
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // inside of existing (preview) training screen
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    // click edit the newly created training
    const editTrainingIcon = await driver.waitFor.byTestId(
      'training-edit-button',
    );
    await act(() => userEvent.click(editTrainingIcon));

    // inside of edit existing training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    // open the first exercise for editing (this call sets backRouteWithHistoryReplace)
    const openExerciseButtons = await driver.waitFor.allByTestId(
      'open-exercise-button',
    );
    await act(() => userEvent.click(openExerciseButtons[0]));

    // inside of edit existing exercise screen
    expect(
      await driver.waitFor.byTestId('edit-existing-exercise-screen'),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(getRouteNavPath()).toBe(
        apis.navigationApi.routes.editExistingExercise,
      );
    });

    // click save which should trigger navigationApi.goBack() and return to edit training
    const saveExerciseBtn = await driver.waitFor.byTestId(
      'exercise-save-button',
    );
    await act(() => userEvent.click(saveExerciseBtn));

    // inside of edit existing training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(getRouteNavPath()).toBe(apis.navigationApi.routes.editTraining);
    });

    // simulate browser go back btn, but agnostically to the implementation
    // details (e.g. react-router-dom or any another solution).
    //
    // the following works, but not stably...
    //
    await act(() => apis.navigationApi.goBack());

    await waitFor(() => {
      expect(getRouteNavPath()).toBe(apis.navigationApi.routes.editTraining);
    });
  });
});

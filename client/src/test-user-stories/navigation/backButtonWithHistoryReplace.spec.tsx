import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';

import { createDriver, type TestDriver } from '../../test-utils';
import { waitFor } from '@testing-library/react';

describe('navigation - back with history replace', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('navigating from edit-training -> edit-exercise and saving goes back to edit-training', async () => {
    const userEvent = userEventBuilder.setup();

    const { apis, appContext, getUrlNavPath } = await driver.render.app();

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

    await waitFor(
      async () => {
        const store = appContext.serviceLocator.getStore();

        expect(
          isMatch(
            apis.navigationApi.routes.editExistingExercise,
            getUrlNavPath(),
          ),
        ).toBe(true);

        expect(
          isMatch(
            apis.navigationApi.routes.editTraining,
            store.backRouteWithHistoryReplace ?? '',
          ),
        ).toBe(true);
      },
      {
        timeout: 1000,
      },
    );

    // click save which should trigger navigationApi.goBack() and return to edit training
    const saveExerciseBtn = await driver.waitFor.byTestId(
      'exercise-save-button',
    );
    await act(() => userEvent.click(saveExerciseBtn));

    // inside of edit existing training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    await waitFor(
      async () => {
        await new Promise((res) => setTimeout(res, 1000));

        const store = appContext.serviceLocator.getStore();

        // `backRouteWithHistoryReplace` must be reset
        expect(store.backRouteWithHistoryReplace).toBe(undefined);

        // path should remain and match editTraining
        expect(
          isMatch(apis.navigationApi.routes.editTraining, getUrlNavPath()),
        ).toBe(true);
      },
      {
        timeout: 2000,
      },
    );

    // simulate browser go back btn, but agnostically to the implementation
    // details (e.g. react-router-dom or any another solution).
    //
    // the following doesn't work in the test env with the existing setup
    // of the app routing methanism...
    //
    // await act(() => {
    //   apis.navigationApi.goBack();
    // });
  });
});

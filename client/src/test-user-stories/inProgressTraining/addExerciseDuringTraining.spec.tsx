import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { TestDriver, createDriver } from '../../test-utils';
import { logDOM, waitFor } from '@testing-library/react';
import { createMemoryHistory } from '@tanstack/react-router';

describe('in progress training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('add exercise during training and finish', async () => {
    const userEvent = userEventBuilder.setup();

    // mock router history
    jest.doMock('../../model/apis/navigationApi/getRouterParams.ts', () => ({
      history: createMemoryHistory({ initialEntries: ['/'] }),
      defaultPreload: false, // Disable preloading entirely for tests
      defaultPreloadStaleTime: 0,
      defaultPendingMinMs: 0,
    }));

    const { getRouteNavPath } = await driver.render.app();

    // inside of home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    await driver.create.firstTemplateTraining();

    // open the newly created training
    const trainingBox = await driver.waitFor.byText(/New Training/i);
    await act(() => userEvent.click(trainingBox));

    // click start
    const startTrainingButton = await driver.waitFor.byTestId(
      'start-training-button',
    );
    await act(() => userEvent.click(startTrainingButton));

    // inside of create exercise screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // go back to training screen
    const backBtn = await driver.waitFor.byTestId('back-button');
    await act(() => userEvent.click(backBtn));

    // inside of create training screen
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    // click edit the training while it's in progress
    const editTrainingIcon = await driver.waitFor.byTestId(
      'training-edit-button',
    );
    await act(() => userEvent.click(editTrainingIcon));

    // inside of edit existing training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    // add a new exercise
    const addExerciseBtn = await driver.waitFor.byTestId('add-exercise-button');
    await act(() => userEvent.click(addExerciseBtn));

    // inside of create exercise screen (adding new exercise)
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

    await waitFor(async () => {
      logDOM();
      console.log('getRouteNavPath()', getRouteNavPath());
      // back to edit training screen and check exercise added
      expect(
        await driver.waitFor.byTestId('edit-existing-training-screen'),
      ).toBeInTheDocument();
    });

    await waitFor(async () => {
      const exercises = await driver.waitFor.allByTestId('exercise-item');
      expect(exercises.length).toBe(2);
    });

    // save training edits
    const saveTrainingBtn = await driver.waitFor.byTestId(
      'training-save-button',
    );
    await act(() => userEvent.click(saveTrainingBtn));

    // back to existing training screen
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    // open the newly added exercise (second item)
    const exercisesAfter = await driver.waitFor.allByTestId(
      'training-exercise-item',
    );
    await act(() => userEvent.click(exercisesAfter[1]));

    // inside of existing exercise screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // mark set as completed
    const completeSetBtn = await driver.waitFor.byTestId('done-set-button');
    await act(() => userEvent.click(completeSetBtn));

    // go back to training screen
    const backBtn2 = await driver.waitFor.byTestId('back-button');
    await act(() => userEvent.click(backBtn2));

    // finish training
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    const finishTrainingBtn = await driver.waitFor.byTestId(
      'finish-training-button',
    );
    await act(() => userEvent.click(finishTrainingBtn));

    // inside of home screen
    expect(await driver.waitFor.byTestId('home-screen')).toBeInTheDocument();

    // check that completed training is added
    const completedTrainingsAfter = await driver.waitFor.allByTestId(
      'completed-training-item',
    );
    expect(completedTrainingsAfter.length).toBe(1);

    // check that completed training is shown on the home screen
    expect(await driver.waitFor.byText(/New Training/i)).toBeInTheDocument();
  });
});

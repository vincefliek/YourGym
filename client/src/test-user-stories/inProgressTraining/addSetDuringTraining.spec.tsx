import { act } from 'react';
import userEventBuilder from '@testing-library/user-event';
import { TestDriver, createDriver } from '../../test-utils';

describe('in progress training', () => {
  let driver: TestDriver;

  beforeEach(async () => {
    driver = createDriver();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('add set during training and finish', async () => {
    const userEvent = userEventBuilder.setup();

    await driver.render.app();

    // back to home screen
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

    // go back to training screen to edit training while in progress
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

    // open the exercise to edit sets
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

    // save exercise edits
    const saveExerciseBtn = await driver.waitFor.byTestId(
      'exercise-save-button',
    );
    await act(() => userEvent.click(saveExerciseBtn));

    // back to edit training screen
    expect(
      await driver.waitFor.byTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    // save training edits
    const saveTrainingBtn = await driver.waitFor.byTestId(
      'training-save-button',
    );
    await act(() => userEvent.click(saveTrainingBtn));

    // back to existing training screen
    expect(
      await driver.waitFor.byTestId('existing-training-screen'),
    ).toBeInTheDocument();

    // open the exercise during training
    const exerciseDuring = await driver.waitFor.byText(/New Exercise/i);
    await act(() => userEvent.click(exerciseDuring));

    // inside of existing exercise screen
    expect(
      await driver.waitFor.byTestId('existing-exercise-screen'),
    ).toBeInTheDocument();

    // mark newly added set as completed (click the last 'done' button)
    const completeSetBtns = await driver.waitFor.allByTestId('done-set-button');
    await act(() =>
      userEvent.click(completeSetBtns[completeSetBtns.length - 1]),
    );

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

    // back to home screen
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

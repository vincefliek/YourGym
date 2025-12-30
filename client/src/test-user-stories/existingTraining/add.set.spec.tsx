import { act } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';

import { App } from '../../components/App/App';
import { initApp } from '../../model';
import {
  waitForByTestId,
  waitForByText,
  waitForAllByTestId,
} from '../../test-utils';

describe('existing training', () => {
  const renderApp = async () => {
    const { apis, appContext } = await initApp();

    await apis.authApi.signin('test@gmail.com', 'testpassword');

    const app = render(
      <HashRouter>
        <App apis={apis} appContext={appContext} />
      </HashRouter>,
    );

    return { app, apis, appContext };
  };

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('add a set to an existing exercise', async () => {
    await renderApp();

    // go to Trainings screen
    const trainingsNav = await waitForByTestId('nav-trainings-button');
    act(() => {
      userEvent.click(trainingsNav);
    });

    // create new training
    const addTrainingBtn = await waitForByTestId('add-training-button');
    act(() => userEvent.click(addTrainingBtn));

    // inside of create training screen
    expect(await waitForByTestId('training-name-input')).toBeInTheDocument();
    // check there are no exercises yet
    await expect(waitForByTestId('exercise-item')).rejects.toThrow();

    // add an exercise to the new training
    const addExerciseBtn = await waitForByTestId('add-exercise-button');
    act(() => userEvent.click(addExerciseBtn));

    // inside of create exercise screen
    expect(await waitForByTestId('exercise-name-input')).toBeInTheDocument();

    // add one set
    const addSetBtn = await waitForByTestId('add-set-button');
    act(() => userEvent.click(addSetBtn));

    // save exercise
    const saveExerciseBtn = await waitForByTestId('exercise-save-button');
    act(() => userEvent.click(saveExerciseBtn));

    // inside of create training screen
    expect(await waitForByTestId('create-training-screen')).toBeInTheDocument();
    // check that exercise is added
    expect(await waitForByTestId('exercise-item')).toBeInTheDocument();

    // back in createTraining: save training
    // const saveTrainingBtn = await screen.findByTestId('training-save-button');
    const saveTrainingBtn = await waitForByTestId('training-save-button');
    act(() => userEvent.click(saveTrainingBtn));

    // inside of trainings screen
    expect(await waitForByTestId('trainings-screen')).toBeInTheDocument();

    // open the newly created training
    const trainingBox = await waitForByText(/New Training/i);
    act(() => userEvent.click(trainingBox));

    // click edit the newly created training
    const editTrainingIcon = await waitForByTestId('training-edit-button');
    act(() => userEvent.click(editTrainingIcon));

    // inside of edit existing training screen
    expect(
      await waitForByTestId('edit-existing-training-screen'),
    ).toBeInTheDocument();

    // open the exercise
    const exerciseBox = await waitForByText(/New Exercise/i);
    act(() => userEvent.click(exerciseBox));

    // inside of edit existing exercise screen
    expect(
      await waitForByTestId('edit-existing-exercise-screen'),
    ).toBeInTheDocument();

    const itemsBefore = await waitForAllByTestId('set-item');
    expect(itemsBefore.length).toBe(1);

    const addSetExisting = await waitForByTestId('add-set-button');
    act(() => userEvent.click(addSetExisting));

    const itemsAfter = await waitForAllByTestId('set-item');
    expect(itemsAfter.length).toBe(2);
  });
});

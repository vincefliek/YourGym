import { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';

import { App } from '../../components/App/App';
import { initApp } from '../../model';

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
    const trainingsNav = await screen.findByText(/Trainings/i, {
      selector: 'button',
    });
    act(() => {
      userEvent.click(trainingsNav);
    });

    // create new training
    const addTrainingBtn = await screen.findByTestId('add-training-button');
    act(() => userEvent.click(addTrainingBtn));

    // add an exercise to the new training
    const addExerciseBtn = await screen.findByTestId('add-exercise-button');
    act(() => userEvent.click(addExerciseBtn));

    // in createExercise: add one set and save exercise
    const addSetBtn = await screen.findByTestId('add-set-button');
    act(() => userEvent.click(addSetBtn));

    const saveExerciseBtn = await screen.findByTestId('exercise-save-button');
    act(() => userEvent.click(saveExerciseBtn));

    await waitFor(
      async () => {
        expect(await screen.findByText(/New Exercise/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // back in createTraining: save training
    const saveTrainingBtn = await screen.findByTestId('training-save-button');
    act(() => userEvent.click(saveTrainingBtn));

    // open the newly created training
    const trainingBox = await screen.findByText(/New Training/i);
    act(() => userEvent.click(trainingBox));

    // click edit the newly created training
    const editTrainingIcon = await screen.findByTestId('training-edit-button');
    act(() => userEvent.click(editTrainingIcon));

    // open the exercise
    const exerciseBox = await screen.findByText(/New Exercise/i);
    act(() => userEvent.click(exerciseBox));

    const itemsBefore = await screen.getAllByTestId('set-item');
    expect(itemsBefore.length).toBe(1);

    const addSetExisting = await screen.findByTestId('add-set-button');
    act(() => userEvent.click(addSetExisting));

    const itemsAfter = await screen.findAllByTestId('set-item');
    expect(itemsAfter.length).toBe(2);
  });
});

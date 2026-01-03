import { act } from 'react';
import { waitForByTestId, waitForAllByTestId } from './waitHelpers';
import userEventBuilder from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

interface Exercise {
  sets: {
    reps: number;
    weight: number;
  }[];
}

export interface CreateFirstTemplateTrainingConfig {
  exercises?: Exercise[];
}

const defaultExercises: Exercise[] = [
  {
    sets: [{ reps: 8, weight: 12 }],
  },
];

export const createFirstTemplateTraining = async (
  config: CreateFirstTemplateTrainingConfig = {},
) => {
  const { exercises = defaultExercises } = config;

  const userEvent = userEventBuilder.setup();

  // go to Trainings screen
  const trainingsNav = await waitForByTestId('nav-trainings-button');
  await act(() => userEvent.click(trainingsNav));

  // create new training
  const addTrainingBtn = await waitForByTestId('add-first-training-button');
  await act(() => userEvent.click(addTrainingBtn));

  // inside of create training screen
  expect(await waitForByTestId('training-name-input')).toBeInTheDocument();
  // check there are no exercises yet
  await expect(waitForByTestId('exercise-item')).rejects.toThrow();

  for (const ex of exercises) {
    const { sets } = ex;

    // add an exercise to the new training
    const addExerciseBtn = await waitForByTestId('add-exercise-button');
    await act(() => userEvent.click(addExerciseBtn));

    // inside of create exercise screen
    expect(await waitForByTestId('create-exercise-screen')).toBeInTheDocument();

    // change name for 2+ exercise to be "New Exercise 2", "New Exercise 3" and so on.
    if (exercises.indexOf(ex) > 0) {
      const nameInput = await waitForByTestId('exercise-name-input');
      const exIndex = exercises.indexOf(ex) + 1;
      const name = `New Exercise ${exIndex}`;
      await act(() => userEvent.clear(nameInput));
      await act(() => userEvent.type(nameInput, name));
      // blur to trigger onBlur handlers
      await act(() => nameInput.blur());
    }

    for (const set of sets) {
      const { reps, weight } = set;

      // add one set
      const addSetBtn = await waitForByTestId('add-set-button');
      await act(() => userEvent.click(addSetBtn));

      // find the latest set inputs and type values
      const repsInputs = await waitForAllByTestId('set-repetitions-input');
      const weightInputs = await waitForAllByTestId('set-weight-input');
      const lastReps = repsInputs[repsInputs.length - 1];
      const lastWeight = weightInputs[weightInputs.length - 1];

      if (typeof reps !== 'undefined') {
        await act(() => userEvent.clear(lastReps));
        await act(() => userEvent.type(lastReps, String(reps)));
        await act(() => lastReps.blur());
      }

      if (typeof weight !== 'undefined') {
        await act(() => userEvent.clear(lastWeight));
        await act(() => userEvent.type(lastWeight, String(weight)));
        await act(() => lastWeight.blur());
      }
    }

    // save exercise
    const saveExerciseBtn = await waitForByTestId('exercise-save-button');
    await act(() => userEvent.click(saveExerciseBtn));

    // inside of create training screen
    expect(await waitForByTestId('create-training-screen')).toBeInTheDocument();

    // check that exercise is added — ensure count equals number added so far
    await waitFor(async () => {
      const exerciseItems = await waitForAllByTestId('exercise-item');
      const addedIndex = exercises.indexOf(ex);
      expect(exerciseItems.length).toBe(addedIndex + 1);
    });
  }

  // save training
  const saveTrainingBtn = await waitForByTestId('training-save-button');
  await act(() => userEvent.click(saveTrainingBtn));

  // inside of trainings screen
  expect(await waitForByTestId('trainings-screen')).toBeInTheDocument();
};

export const createConsecutiveTemplateTraining = async () => {};

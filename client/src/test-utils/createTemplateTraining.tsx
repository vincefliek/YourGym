import { act } from 'react';
import { waitForByTestId } from './waitHelpers';
import userEventBuilder from '@testing-library/user-event';

export const createFirstTemplateTraining = async () => {
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

  // add an exercise to the new training
  const addExerciseBtn = await waitForByTestId('add-exercise-button');
  await act(() => userEvent.click(addExerciseBtn));

  // inside of create exercise screen
  expect(await waitForByTestId('exercise-name-input')).toBeInTheDocument();

  // add one set
  const addSetBtn = await waitForByTestId('add-set-button');
  await act(() => userEvent.click(addSetBtn));

  // save exercise
  const saveExerciseBtn = await waitForByTestId('exercise-save-button');
  await act(() => userEvent.click(saveExerciseBtn));

  // inside of create training screen
  expect(await waitForByTestId('create-training-screen')).toBeInTheDocument();
  // check that exercise is added
  expect(await waitForByTestId('exercise-item')).toBeInTheDocument();

  // save training
  const saveTrainingBtn = await waitForByTestId('training-save-button');
  await act(() => userEvent.click(saveTrainingBtn));

  // inside of trainings screen
  expect(await waitForByTestId('trainings-screen')).toBeInTheDocument();
};

export const createConsecutiveTemplateTraining = async () => {};

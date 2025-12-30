import {
  Matcher,
  screen,
  waitFor,
  waitForOptions,
} from '@testing-library/react';

const _private_waitForAllByMethod = async (
  method: 'findAllByTestId',
  param: Matcher,
  options?: waitForOptions,
) => {
  return waitFor(async () => {
    const result = await screen[method]?.(param);
    if (Array.isArray(result) && result.length === 0) {
      throw new Error(
        `WaitForAll helper: Element with matcher "${param}" was not found`,
      );
    }
    return result;
  }, options);
};

const _private_waitForByMethod = async (
  method: 'findByTestId' | 'findByText',
  param: Matcher,
  options?: waitForOptions,
) => {
  return waitFor(async () => {
    const result = await screen[method]?.(param);
    if (!result) {
      throw new Error(
        `WaitFor helper: Element with matcher "${param}" was not found`,
      );
    }
    return result;
  }, options);
};

export const waitForByTestId = async (
  testId: Matcher,
  options?: waitForOptions,
) => {
  return _private_waitForByMethod('findByTestId', testId, options);
};

export const waitForAllByTestId = async (
  testId: Matcher,
  options?: waitForOptions,
) => {
  return _private_waitForAllByMethod('findAllByTestId', testId, options);
};

export const waitForByText = async (
  text: Matcher,
  options?: waitForOptions,
) => {
  return _private_waitForByMethod('findByText', text, options);
};

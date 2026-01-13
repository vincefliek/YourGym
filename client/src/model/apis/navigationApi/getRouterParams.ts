import { createHashHistory } from '@tanstack/react-router';

/**
 * Extracted into a separate file in order to
 * be able to mock in the tests.
 */
export const getRouterParams = () => {
  const history = createHashHistory();

  return {
    history,
  };
};

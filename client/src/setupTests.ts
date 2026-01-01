// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * for doing click, hover, drag and drop etc. in tests
 */
import '@testing-library/user-event';

/**
 * for `fetch` in tests
 */
import 'jest-fetch-mock/setupJest';

/**
 * for `indexedDB` in tests
 * `structured-clone` polyfill is required for `fake-indexeddb`
 */
import 'core-js/actual/structured-clone';
import 'fake-indexeddb/auto';

import { IDBFactory } from 'fake-indexeddb';

import { createApiMocks } from './test-utils';

// mock "uuid" npm package
jest.mock('uuid', () => ({
  v4: () => `mock-uuid-${Math.random()}`,
}));

// mock "virtual:pwa-register/react" npm package
jest.mock(
  'virtual:pwa-register/react',
  () => ({
    useRegisterSW: () => ({
      needRefresh: [false, jest.fn()],
      updateServiceWorker: jest.fn(() => Promise.resolve()),
    }),
  }),
  { virtual: true },
);

export const apiMocks = createApiMocks();

beforeAll(() => apiMocks.init());
beforeEach(() => {
  global.indexedDB = new IDBFactory();
});
afterEach(() => {
  apiMocks.resetCache();
});
afterAll(() => apiMocks.destroy());

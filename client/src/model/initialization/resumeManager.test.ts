import { ResumeManager } from './resumeManager';

describe('ResumeManager', () => {
  let manager: ResumeManager;
  let cleanup: () => void;

  beforeEach(() => {
    jest.useFakeTimers();
    manager = new ResumeManager();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    if (cleanup) cleanup();
    // restore visibilityState if tests changed it
    delete (document as any).visibilityState;
    jest.restoreAllMocks();
  });

  test('calls onResume once after visibility becomes visible (with delay)', async () => {
    const onResume = jest.fn().mockResolvedValue(undefined);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    cleanup = manager.init({ onResume });

    document.dispatchEvent(new Event('visibilitychange'));

    // should schedule a 500ms delayed run
    expect(onResume).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    // wait for any microtasks
    await Promise.resolve();

    expect(onResume).toHaveBeenCalledTimes(1);
  });

  test('does not trigger when visibility is not visible', () => {
    const onResume = jest.fn().mockResolvedValue(undefined);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    cleanup = manager.init({ onResume });

    document.dispatchEvent(new Event('visibilitychange'));

    jest.advanceTimersByTime(1000);

    expect(onResume).not.toHaveBeenCalled();
  });

  test('guards against spammy resume signals within 2s', async () => {
    const onResume = jest.fn().mockResolvedValue(undefined);

    // control Date.now
    let now = 1_000_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    cleanup = manager.init({ onResume });

    // first signal
    document.dispatchEvent(new Event('visibilitychange'));
    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(onResume).toHaveBeenCalledTimes(1);

    // simulate time passing 1s (<2000) and fire another signal
    now += 1000;
    document.dispatchEvent(new Event('visibilitychange'));
    jest.advanceTimersByTime(500);
    await Promise.resolve();

    // should still be only one call because of spam guard
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  test('retries once when onResume fails and waits for online event when offline', async () => {
    const error = new Error('initial failure');
    const onResume = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(undefined);

    const onRetryFailed = jest.fn().mockResolvedValue(undefined);

    // make navigator.offline initially
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    cleanup = manager.init({ onResume, onRetryFailed });

    document.dispatchEvent(new Event('visibilitychange'));

    // advance to trigger first attempt
    jest.advanceTimersByTime(500);
    await Promise.resolve();

    // after failure the manager waits for an `online` event; still only one call so far
    expect(onResume).toHaveBeenCalledTimes(1);

    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    // dispatch online to allow retry
    window.dispatchEvent(new Event('online'));

    // let the retry call run
    await Promise.resolve();

    expect(onResume).toHaveBeenCalledTimes(2);
    expect(onRetryFailed).not.toHaveBeenCalled();
  });

  test('calls onRetryFailed when retry also fails', async () => {
    const err1 = new Error('first');
    const err2 = new Error('second');
    const onResume = jest
      .fn()
      .mockRejectedValueOnce(err1)
      .mockRejectedValueOnce(err2);

    const onRetryFailed = jest.fn();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    cleanup = manager.init({ onResume, onRetryFailed });

    document.dispatchEvent(new Event('visibilitychange'));

    // first attempt
    jest.advanceTimersByTime(500);
    await Promise.resolve();

    // sleep/backoff of 1s before retry
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    await Promise.resolve();

    // retry failed -> onRetryFailed should be called with the second error
    expect(onResume).toHaveBeenCalledTimes(2);
    expect(onRetryFailed).toHaveBeenCalledTimes(1);
    expect(onRetryFailed.mock.calls[0][0]).toBe(err2);
  });

  test('prevents concurrent runResume (isRunning guard)', async () => {
    // create a controllable promise for onResume
    let resolveFirst: () => void;
    const firstPromise = new Promise<void>((res) => (resolveFirst = res));
    const onResume = jest.fn().mockImplementation(() => firstPromise);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    cleanup = manager.init({ onResume });

    // trigger first run
    document.dispatchEvent(new Event('visibilitychange'));

    jest.advanceTimersByTime(500);
    await Promise.resolve();

    expect(onResume).toHaveBeenCalledTimes(1);

    // before the first resolves, trigger another signal -> should schedule but then skip because isRunning
    document.dispatchEvent(new Event('visibilitychange'));

    jest.advanceTimersByTime(500);
    await Promise.resolve();

    // still only the initial call
    expect(onResume).toHaveBeenCalledTimes(1);

    // resolve first to finish
    resolveFirst!();
    await Promise.resolve();
  });
});

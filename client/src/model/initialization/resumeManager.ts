interface ResumeManagerConfig {
  onResume: () => Promise<void>;
  onRetryFailed?: (err: Error) => Promise<void>;
  logInfo?: (data: { message: string }) => void;
}

/**
 * Motivation:
 * On iOS, when the app goes to background and comes back,
 * there is a chance that network connections are dropped.
 * This leads to HTTP requests failing with error
 * "Load failed" in iOS or "Failed to fetch" in Safari, etc.
 *
 * How to fix:
 * To mitigate this, we introduce a small delay on resume from background,
 * and retry once if the first attempt fails.
 */
export class ResumeManager {
  private resumeTimer: number | null = null;
  private isRunning = false;
  private lastResume = 0;
  private onResume: ResumeManagerConfig['onResume'] = async () => {};
  private onRetryFailed: Required<ResumeManagerConfig>['onRetryFailed'] =
    async () => {};
  private logInfo: Required<ResumeManagerConfig>['logInfo'] = () => {};

  constructor() {}

  init(config: ResumeManagerConfig) {
    this.onResume = config.onResume;
    if (config.onRetryFailed) {
      this.onRetryFailed = config.onRetryFailed;
    }
    if (config.logInfo) {
      this.logInfo = config.logInfo;
    }

    document.addEventListener('visibilitychange', this.handleSignal, false);
    window.addEventListener('pageshow', this.handleSignal, false);
    window.addEventListener('focus', this.handleSignal, false);

    return () => {
      document.removeEventListener(
        'visibilitychange',
        this.handleSignal,
        false,
      );
      window.removeEventListener('pageshow', this.handleSignal, false);
      window.removeEventListener('focus', this.handleSignal, false);
    };
  }

  private handleSignal = () => {
    if (document.visibilityState !== 'visible') {
      // hack, until it's clear why sometimes the flow exits
      // withouth setting it to "false"
      this.isRunning = false;
      return;
    }

    if (!navigator.onLine) {
      this.logInfo({
        message: 'ResumeManager: OFFLINE when entring `handleSignal`.',
      });
    }

    const now = Date.now();
    if (now - this.lastResume < 2000) return; // guard spam

    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }

    this.resumeTimer = window.setTimeout(() => {
      if (!navigator.onLine) {
        this.logInfo({
          message: 'ResumeManager: OFFLINE when calling `this.runResume()` !!!',
        });
      }
      this.resumeTimer = null;
      this.runResume();
    }, 500); // ⏱️ iOS-safe delay
  };

  private async runResume() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastResume = Date.now();

    try {
      await this.onResume();
    } catch (err) {
      console.error('ResumeManager: resume failed, retrying once', err);
      try {
        await this.retryOnce();
      } catch (retryErr) {
        console.error('ResumeManager: resume retry failed', retryErr);
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async retryOnce() {
    // If offline, wait for an `online` event (with timeout); otherwise wait a short backoff
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await this.waitForOnline();
    } else {
      await this.sleep(1000);
    }

    try {
      await this.onResume();
    } catch (err: any) {
      try {
        await this.onRetryFailed(err);
      } catch (handlerErr) {
        console.error('ResumeManager: onRetryFailed handler threw', handlerErr);
      }
    }
  }

  // Wait until the browser reports `navigator.onLine === true` or an `online`
  // event occurs, or until `timeoutMs` elapses. Ensures event listener and
  // timeout are cleaned up properly.
  private waitForOnline(timeoutMs = 30_000): Promise<void> {
    if (typeof navigator === 'undefined' || navigator.onLine) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      let to: number | null = null;

      const cleanup = () => {
        window.removeEventListener('online', onOnline);
        if (to !== null) {
          clearTimeout(to);
          to = null;
        }
      };

      const onOnline = () => {
        cleanup();
        resolve();
      };

      to = window.setTimeout(() => {
        cleanup();
        resolve();
      }, timeoutMs);

      window.addEventListener('online', onOnline, false);
    });
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}

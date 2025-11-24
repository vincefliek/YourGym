export function createRAFInterval(
  callback: (...args: any[]) => any,
  interval = 1000,
) {
  let last = 0;
  let stopped = false;

  function loop(ts: number) {
    if (stopped) return;

    if (ts - last >= interval) {
      last = ts;
      callback();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  return () => { stopped = true; }; // stop fn
}

export const isIOS = () => {
  const _window = window as any;
  const userAgent = navigator.userAgent || navigator.vendor || _window.opera;

  // Traditional iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !_window.MSStream) {
    return true;
  }

  // Modern iPad detection
  if (navigator.maxTouchPoints > 0 && /Macintosh/.test(userAgent)) {
    return true;
  }

  return false;
};

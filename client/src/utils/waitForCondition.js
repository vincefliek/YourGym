export const waitForCondition = (condition) => {
  return new Promise(resolve => {
    const fn = async () => {
      const result = await condition();

      if (result) {
        resolve(result);
      } else {
        window.requestAnimationFrame(fn);
      }
    };

    window.requestAnimationFrame(fn);
  });
};

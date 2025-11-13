import type { RequestHandler } from 'express';

export const timeoutMiddleware = (): RequestHandler => (req, res, next) => {
  const oneMinute = 60 * 1000;
  res.setTimeout(oneMinute, () => {
    res.status(503).json({ error: 'timeout' });
  });
  next();
};

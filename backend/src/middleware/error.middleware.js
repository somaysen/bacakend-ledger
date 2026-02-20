import { logger } from '../utils/logger.js';

export function errorHandler(err, _req, res, _next) {
  logger.error({ err }, 'Unhandled error');
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}

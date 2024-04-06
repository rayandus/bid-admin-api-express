import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from './logger';

export const getHrTimeDurationMs = (startHrTime: [number, number]): number => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(startHrTime);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const requestLogHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      return;
    }

    const durationInMilliseconds = req.startHrTime
      ? Math.round(getHrTimeDurationMs(req.startHrTime))
      : 0;

    logger.http({
      message: `HTTP ${req.method} ${req.url} ${res.statusCode} ${httpStatus[res.statusCode]} ${durationInMilliseconds}ms`,
    });
  });

  next();
};

export default requestLogHandler;

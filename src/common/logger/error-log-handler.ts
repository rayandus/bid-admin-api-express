import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import httpStatus from 'http-status';
import logger from './logger';
import { getHrTimeDurationMs } from './request-log-handler';
import { ValidationErrorItem } from 'joi';
import { ValidationError } from 'express-validation';
import { ApiError } from '../types';

interface ValidationErrorResponse {
  error: string;
  details: {
    type: string;
    path: (string | number)[];
    message: string;
  }[];
}

interface OperationErrorResponse {
  error: string;
  stack?: string[];
}

const transformValidationError = (err: ValidationError): ValidationErrorResponse => {
  const mappedErrors = err.details.body?.map((item) => {
    // The types seem to be out-of-synced with the actual data
    // Need to cast
    const { message, path, type } = item as unknown as ValidationErrorItem;

    return {
      type,
      path,
      message,
    };
  });

  return {
    error: err.message,
    details: mappedErrors || [],
  };
};

const transformOperationError = (err: ApiError): OperationErrorResponse => {
  const jsonStack = err.stack?.split('\n').map((item) => item.trim()) || [];

  return {
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? jsonStack : undefined,
  };
};

const errorLogHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const { statusCode } = err;

  const responseData =
    err instanceof ValidationError
      ? transformValidationError(err)
      : transformOperationError(err);

  const durationTimeMs = req.startHrTime
    ? Math.round(getHrTimeDurationMs(req.startHrTime))
    : 0;

  logger.error({
    message: `HTTP ${req.method} ${req.url} ${statusCode} ${httpStatus[statusCode]} ${durationTimeMs}ms`,
    ...responseData,
  });

  const responseCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  res.status(responseCode).json(responseData);
};

export default errorLogHandler;

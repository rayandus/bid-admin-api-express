import httpStatus from 'http-status';

class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

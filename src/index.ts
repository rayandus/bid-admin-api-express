import express, { NextFunction, Request, Response } from 'express';
import config from './common/config';
import mongoose from 'mongoose';
import appRouter from './app-router';
import logger, { errorLogHandler, requestLogHandler } from './common/logger';
import createHttpError from 'http-errors';

const app = express();
const port = config.PORT || 7071;

const bootstrap = async (): Promise<void> => {
  await mongoose.connect(config.MONGO_DB_CONNSTR, {
    socketTimeoutMS: 0,
  });

  mongoose.connection.on('error', () => {
    throw createHttpError.InternalServerError('Unable to connect to the database');
  });

  app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`);
  });

  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.startHrTime = process.hrtime();
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogHandler);

  app.use('/api', appRouter);

  app.use(errorLogHandler);
};

bootstrap().catch((err) => {
  logger.error('Bootstrap error', err);
});

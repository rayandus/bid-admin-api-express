import express from 'express';
import config from './common/config';
import mongoose from 'mongoose';
import appRouter from './app-router';

const app = express();
const port = config.PORT || 7071;

const bootstrap = async (): Promise<void> => {
  await mongoose.connect(config.MONGO_DB_CONNSTR, {
    socketTimeoutMS: 0,
  });

  mongoose.connection.on('error', () => {
    throw new Error('unable to connect to database');
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  app.use('/api', appRouter);
};

bootstrap();

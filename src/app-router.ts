import express, { Router, Request, Response } from 'express';
import { userRouter } from './user';
import { authRouter } from './auth';

const appRouter: Router = express.Router();

appRouter.get('/', (_req: Request, res: Response) => {
  res.json('Hello World Express 2.01!');
});

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);

export default appRouter;

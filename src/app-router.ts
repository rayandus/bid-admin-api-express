import express, { Router } from 'express';
import userRouter from './user/user.router';
import { authRouter } from './auth';

const appRouter: Router = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);

export default appRouter;

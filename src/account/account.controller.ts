import createHttpError from 'http-errors';
import { JwtUser } from '../common/types/express';
import { NextFunction, Request, Response } from 'express';
import AccountService from './account.service';
import { DepositBody } from './account.dto';

class AccountController {
  public static deposit = async (
    req: Request<unknown, unknown, DepositBody, unknown, JwtUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, email } = req.user || {};
      const { amount } = req.body;

      if (!userId) {
        throw createHttpError.NotFound(`User ${email} not found`);
      }

      const updatedBalance = await AccountService.addBalance({ userId, amount });

      res.json(updatedBalance);
    } catch (err) {
      next(err);
    }
  };

  public static getBalance = async (
    req: Request<unknown, unknown, unknown, unknown, JwtUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, email } = req.user || {};

      if (!userId) {
        throw createHttpError.NotFound(`User ${email} not found`);
      }

      const accountBalance = await AccountService.getBalance(userId);

      res.json(accountBalance);
    } catch (err) {
      next(err);
    }
  };

  myMethod1(): void {
    console.log('Hello World');
  }

  myMethod2(): void {
    this.myMethod1();
  }
}

export default AccountController;

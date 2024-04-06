import createHttpError from 'http-errors';
import UserService from './user.service';
import { NextFunction, Request, Response } from 'express';
import { UserBody } from './user.dto';
import { Account } from '../account/account.model';
import AccountService from 'account/account.service';

class UserController {
  public static getMyProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, email } = req.user || {};

      if (!userId) {
        throw createHttpError.Unauthorized();
      }

      const user = await UserService.findOneById(userId);

      if (!userId) {
        throw createHttpError.NotFound(`User ${email} not found`);
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  public static register = async (
    req: Request<unknown, unknown, UserBody>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await UserService.register(email, password);

      res.json(user);
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;

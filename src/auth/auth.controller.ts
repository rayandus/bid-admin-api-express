import { NextFunction, Request, Response } from 'express';
import { LoginBodyDto } from './auth.dto';
import AuthService from './auth.service';
import { http } from 'winston';
import createHttpError from 'http-errors';

class AuthController {
  public static login = async (
    req: Request<unknown, unknown, LoginBodyDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public static logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.user || {};

      if (!email) {
        throw createHttpError.Unauthorized(`Unauthorized ${email} user`);
      }

      await AuthService.logout(email);

      res.end();
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;

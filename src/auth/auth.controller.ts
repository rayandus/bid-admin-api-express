import { LoginBodyDto } from './auth.dto';
import AuthService, { SignInResponse } from './auth.service';
import { NextFunction, Request, Response } from 'express';

class AuthController {
  public static login = async (
    req: Request<unknown, unknown, LoginBodyDto>,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      const r = res.json(result);

      console.log('*** r', r);

      return r;
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;

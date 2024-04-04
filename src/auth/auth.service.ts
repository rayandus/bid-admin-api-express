import config from '../common/config';
import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user';
import * as bcrypt from 'bcrypt';

export interface SignInResponse {
  token: string;
}

class AuthService {
  private static extractTokenFromHeader = (req: Request): string | undefined => {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };

  public static checkAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const token = AuthService.extractTokenFromHeader(req);

      if (!token) {
        throw HttpError(httpStatus.UNAUTHORIZED);
      }

      const decodedToken = jwt.decode(token) as {
        email?: string;
      } | null;

      const { email } = decodedToken || {};

      if (!email) {
        throw HttpError(httpStatus.UNAUTHORIZED);
      }

      const matchedUser = await UserService.findOne(email);

      if (!matchedUser?.isLoggedIn) {
        throw HttpError(httpStatus.UNAUTHORIZED);
      }

      const payload = jwt.verify(token, config.JWT_SECRET);
      req['user'] = payload;

      next();
    } catch (err) {
      next(err);
    }
  };

  public static login = async (
    email: string,
    password: string,
  ): Promise<SignInResponse> => {
    const user = await UserService.getUserWithPasswordHash(email);

    if (!user) {
      throw HttpError(httpStatus.UNAUTHORIZED);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw HttpError(httpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, email: user.email, userId: user._id };
    const token = jwt.sign(payload, config.JWT_SECRET);

    user.isLoggedIn = true;
    await user.save();

    return { token };
  };

  public static logout = async (email: string): Promise<void> => {
    const user = await UserService.findOne(email);

    if (!user) {
      return;
    }

    user.isLoggedIn = false;
    await user.save();
  };
}

export default AuthService;

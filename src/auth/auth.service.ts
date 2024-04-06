import config from '../common/config';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../user';
import bcrypt from 'bcrypt';
import { JwtUser } from 'common/types/express';

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
    _res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const token = AuthService.extractTokenFromHeader(req);

      if (!token) {
        throw createHttpError.Unauthorized();
      }

      const decodedToken = jwt.decode(token) as {
        email?: string;
      } | null;

      const { email } = decodedToken || {};

      if (!email) {
        throw createHttpError.Unauthorized(`Unauthorized ${email} user`);
      }

      const matchedUser = await UserService.findOne(email);

      if (!matchedUser?.isLoggedIn) {
        throw createHttpError.Unauthorized(`Unauthorized ${email} user`);
      }

      const payload = jwt.verify(token, config.JWT_SECRET);

      if (typeof payload !== 'string') {
        req.user = payload as unknown as JwtUser;
      }

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
      throw createHttpError.Unauthorized(`Unauthorized ${email} user`);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw createHttpError.Unauthorized(`Unauthorized ${email} user`);
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

import createHttpError from 'http-errors';
import UserModel, { IUser } from './user.model';
import AccountService from '../account/account.service';
import config from '../common/config';

export default class UserService {
  public static findOne = async (email: string): Promise<IUser | null> => {
    return await UserModel.findOne({ email });
  };

  public static findOneById = async (id: string): Promise<IUser | null> => {
    return UserModel.findOne<IUser>({ _id: id });
  };

  public static getUserWithPasswordHash = async (
    email: string,
  ): Promise<IUser | null> => {
    try {
      const user = await UserModel.findOne({ email }).select('+password');

      return user as IUser;
    } catch {
      return null;
    }
  };

  public static isExists = async (email: string): Promise<boolean> => {
    const matchedUser = await UserModel.findOne({ email });

    return !!matchedUser;
  };

  public static register = async (email: string, password: string): Promise<IUser> => {
    const isExists = await UserService.isExists(email);

    if (isExists) {
      throw createHttpError.Conflict(`User ${email} already exists`);
    }

    const user = new UserModel({ email, password });

    // Initialize balance
    await AccountService.addBalance({
      userId: user.id,
      currency: config.CURRENCY,
      amount: 0,
    });

    const savedUser = await user.save();

    return savedUser;
  };
}
